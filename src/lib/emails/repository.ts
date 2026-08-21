import { and, desc, eq, inArray, like, or } from "drizzle-orm";

import { getDb } from "#/lib/database";
import { attachments, folders, mailboxes, messages, threads } from "#/lib/database/schema";
import { deleteEmailObjects, putEmailObject, readEmailText } from "#/lib/emails/storage";
import type { MailboxAddress, MessageDraftInput, MessageFolder, StoredAttachment } from "#/lib/emails/types";

const folderNames: Record<MessageFolder, string> = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  archive: "Archive",
  trash: "Trash",
};

const foldersToCreate = Object.entries(folderNames) as [MessageFolder, string][];

const normalizeAddress = (address: string) => address.trim().toLowerCase();

const parseAddresses = (value: string): MailboxAddress[] => {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((address) => {
      if (
        typeof address === "object" &&
        address !== null &&
        "name" in address &&
        "address" in address &&
        typeof address.name === "string" &&
        typeof address.address === "string"
      ) {
        return [{ name: address.name, address: address.address }];
      }
      return [];
    });
  } catch {
    return [];
  }
};

const asMessage = (message: typeof messages.$inferSelect) => ({
  ...message,
  from: parseAddresses(message.fromJson),
  to: parseAddresses(message.toJson),
  cc: parseAddresses(message.ccJson),
  bcc: parseAddresses(message.bccJson),
});

const getFolder = async (env: Env, mailboxId: string, kind: MessageFolder) => {
  const [folder] = await getDb(env)
    .select()
    .from(folders)
    .where(and(eq(folders.mailboxId, mailboxId), eq(folders.kind, kind)))
    .limit(1);
  if (!folder) throw new Error(`Mailbox ${mailboxId} is missing its ${kind} folder.`);
  return folder;
};

const resolveThread = async (env: Env, mailboxId: string, subject: string, references: string[]) => {
  const db = getDb(env);
  const now = Date.now();

  if (references.length > 0) {
    const [existing] = await db
      .select({ id: messages.threadId })
      .from(messages)
      .where(and(eq(messages.mailboxId, mailboxId), inArray(messages.rfcMessageId, references)))
      .limit(1);
    if (existing) return existing.id;
  }

  const threadId = crypto.randomUUID();
  await db.insert(threads).values({ id: threadId, mailboxId, subject, lastMessageAt: now, createdAt: now });
  return threadId;
};

export const listMailboxes = async (env: Env) =>
  getDb(env).select().from(mailboxes).orderBy(mailboxes.address);

export const getMailbox = async (env: Env, mailboxId: string) => {
  const [mailbox] = await getDb(env).select().from(mailboxes).where(eq(mailboxes.id, mailboxId)).limit(1);
  return mailbox ?? null;
};

export const getMailboxByAddress = async (env: Env, address: string) => {
  const [mailbox] = await getDb(env)
    .select()
    .from(mailboxes)
    .where(eq(mailboxes.address, normalizeAddress(address)))
    .limit(1);
  return mailbox ?? null;
};

export const createMailbox = async (env: Env, address: string, displayName: string) => {
  const normalizedAddress = normalizeAddress(address);
  const existing = await getMailboxByAddress(env, normalizedAddress);
  if (existing) throw new Error(`A mailbox for ${normalizedAddress} already exists.`);

  const now = Date.now();
  const mailbox = {
    id: crypto.randomUUID(),
    address: normalizedAddress,
    displayName: displayName.trim(),
    signature: "",
    agentInstructions: "",
    autoDraft: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  const db = getDb(env);
  await db.insert(mailboxes).values(mailbox);
  await db.insert(folders).values(
    foldersToCreate.map(([kind, name]) => ({ id: crypto.randomUUID(), mailboxId: mailbox.id, kind, name, createdAt: now })),
  );
  return mailbox;
};

export const updateMailbox = async (
  env: Env,
  mailboxId: string,
  values: Partial<Pick<typeof mailboxes.$inferInsert, "displayName" | "signature" | "agentInstructions" | "autoDraft" | "isActive">>,
) => {
  const mailbox = await getMailbox(env, mailboxId);
  if (!mailbox) return null;

  await getDb(env)
    .update(mailboxes)
    .set({ ...values, updatedAt: Date.now() })
    .where(eq(mailboxes.id, mailboxId));
  return getMailbox(env, mailboxId);
};

export const listMessages = async (env: Env, mailboxId: string, folder: MessageFolder, query: string | null) => {
  const selectedFolder = await getFolder(env, mailboxId, folder);
  const terms = query?.trim();
  const conditions = [eq(messages.mailboxId, mailboxId), eq(messages.folderId, selectedFolder.id)];
  if (terms) {
    const pattern = `%${terms.replace(/[%_]/g, "\\$&")}%`;
    conditions.push(or(like(messages.subject, pattern), like(messages.excerpt, pattern))!);
  }

  const results = await getDb(env)
    .select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(desc(messages.createdAt));
  return results.map(asMessage);
};

export const getMessage = async (env: Env, mailboxId: string, messageId: string) => {
  const db = getDb(env);
  const [message] = await db
    .select()
    .from(messages)
    .where(and(eq(messages.id, messageId), eq(messages.mailboxId, mailboxId)))
    .limit(1);
  if (!message) return null;

  const [bodyText, bodyHtml, messageAttachments] = await Promise.all([
    readEmailText(env, message.textKey),
    readEmailText(env, message.htmlKey),
    db.select().from(attachments).where(eq(attachments.messageId, message.id)),
  ]);
  return { message: asMessage(message), bodyText, bodyHtml, attachments: messageAttachments };
};

export const setMessageRead = async (env: Env, mailboxId: string, messageId: string, isRead: boolean) => {
  await getDb(env)
    .update(messages)
    .set({ isRead, updatedAt: Date.now() })
    .where(and(eq(messages.id, messageId), eq(messages.mailboxId, mailboxId)));
};

export const createDraft = async (env: Env, input: MessageDraftInput) => {
  const mailbox = await getMailbox(env, input.mailboxId);
  if (!mailbox) throw new Error("The selected mailbox does not exist.");
  const draftFolder = await getFolder(env, input.mailboxId, "drafts");
  const now = Date.now();
  const messageId = crypto.randomUUID();
  const reply = input.replyToMessageId ? await getMessage(env, input.mailboxId, input.replyToMessageId) : null;
  const threadId = reply?.message.threadId ?? (await resolveThread(env, input.mailboxId, input.subject, []));
  const textKey = `emails/mailboxes/${input.mailboxId}/messages/${messageId}/body.txt`;
  const htmlKey = input.html ? `emails/mailboxes/${input.mailboxId}/messages/${messageId}/body.html` : null;
  const storedKeys = [textKey, ...(htmlKey ? [htmlKey] : [])];

  try {
    await Promise.all([
      putEmailObject(env, textKey, input.text, "text/plain; charset=utf-8"),
      ...(htmlKey && input.html ? [putEmailObject(env, htmlKey, input.html, "text/html; charset=utf-8")] : []),
    ]);
    await getDb(env).insert(messages).values({
      id: messageId,
      mailboxId: input.mailboxId,
      threadId,
      folderId: draftFolder.id,
      direction: "outbound",
      rfcMessageId: null,
      inReplyTo: reply?.message.rfcMessageId ?? null,
      references: reply?.message.rfcMessageId ?? null,
      fromJson: JSON.stringify([{ name: mailbox.displayName, address: mailbox.address }]),
      toJson: JSON.stringify(input.to),
      ccJson: JSON.stringify(input.cc ?? []),
      bccJson: JSON.stringify(input.bcc ?? []),
      subject: input.subject,
      excerpt: input.text.slice(0, 280),
      rawKey: null,
      textKey,
      htmlKey,
      attachmentCount: 0,
      isRead: true,
      isStarred: false,
      receivedAt: null,
      sentAt: null,
      createdAt: now,
      updatedAt: now,
    });
    return messageId;
  } catch (error) {
    await deleteEmailObjects(env, storedKeys);
    throw error;
  }
};

export const storeIncomingMessage = async (
  env: Env,
  input: {
    mailboxId: string;
    from: MailboxAddress[];
    to: MailboxAddress[];
    cc: MailboxAddress[];
    bcc: MailboxAddress[];
    subject: string;
    excerpt: string;
    rfcMessageId: string | null;
    inReplyTo: string | null;
    references: string[];
    raw: ArrayBuffer;
    text: string | null;
    html: string | null;
    attachments: StoredAttachment[];
  },
) => {
  const db = getDb(env);
  if (input.rfcMessageId) {
    const [duplicate] = await db
      .select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.mailboxId, input.mailboxId), eq(messages.rfcMessageId, input.rfcMessageId)))
      .limit(1);
    if (duplicate) return { messageId: duplicate.id, duplicate: true };
  }

  const mailbox = await getMailbox(env, input.mailboxId);
  if (!mailbox) throw new Error("The destination mailbox does not exist.");
  const inbox = await getFolder(env, input.mailboxId, "inbox");
  const messageId = crypto.randomUUID();
  const now = Date.now();
  const threadId = await resolveThread(env, input.mailboxId, input.subject, input.references);
  const baseKey = `emails/mailboxes/${input.mailboxId}/messages/${messageId}`;
  const rawKey = `${baseKey}/raw.eml`;
  const textKey = input.text ? `${baseKey}/body.txt` : null;
  const htmlKey = input.html ? `${baseKey}/body.html` : null;
  const storedKeys = [rawKey, ...(textKey ? [textKey] : []), ...(htmlKey ? [htmlKey] : [])];
  const storedAttachments = input.attachments.map((attachment) => ({
    ...attachment,
    id: crypto.randomUUID(),
    objectKey: `${baseKey}/attachments/${crypto.randomUUID()}-${attachment.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
  }));
  storedKeys.push(...storedAttachments.map((attachment) => attachment.objectKey));

  try {
    await Promise.all([
      putEmailObject(env, rawKey, input.raw, "message/rfc822"),
      ...(textKey && input.text ? [putEmailObject(env, textKey, input.text, "text/plain; charset=utf-8")] : []),
      ...(htmlKey && input.html ? [putEmailObject(env, htmlKey, input.html, "text/html; charset=utf-8")] : []),
      ...storedAttachments.map((attachment) =>
        putEmailObject(env, attachment.objectKey, attachment.content, attachment.contentType),
      ),
    ]);
    await db.insert(messages).values({
      id: messageId,
      mailboxId: input.mailboxId,
      threadId,
      folderId: inbox.id,
      direction: "inbound",
      rfcMessageId: input.rfcMessageId,
      inReplyTo: input.inReplyTo,
      references: input.references.join(" ") || null,
      fromJson: JSON.stringify(input.from),
      toJson: JSON.stringify(input.to),
      ccJson: JSON.stringify(input.cc),
      bccJson: JSON.stringify(input.bcc),
      subject: input.subject,
      excerpt: input.excerpt,
      rawKey,
      textKey,
      htmlKey,
      attachmentCount: storedAttachments.length,
      isRead: false,
      isStarred: false,
      receivedAt: now,
      sentAt: null,
      createdAt: now,
      updatedAt: now,
    });
    if (storedAttachments.length > 0) {
      await db.insert(attachments).values(
        storedAttachments.map((attachment) => ({
          id: attachment.id,
          messageId,
          filename: attachment.filename,
          contentType: attachment.contentType,
          disposition: attachment.disposition,
          contentId: attachment.contentId ?? null,
          size: typeof attachment.content === "string" ? new TextEncoder().encode(attachment.content).byteLength : attachment.content.byteLength,
          objectKey: attachment.objectKey,
        })),
      );
    }
    await db.update(threads).set({ lastMessageAt: now }).where(eq(threads.id, threadId));
    return { messageId, duplicate: false };
  } catch (error) {
    await deleteEmailObjects(env, storedKeys);
    throw error;
  }
};

export const moveMessageToSent = async (env: Env, mailboxId: string, messageId: string) => {
  const sent = await getFolder(env, mailboxId, "sent");
  await getDb(env)
    .update(messages)
    .set({ folderId: sent.id, sentAt: Date.now(), updatedAt: Date.now() })
    .where(and(eq(messages.id, messageId), eq(messages.mailboxId, mailboxId)));
};
