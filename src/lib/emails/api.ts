import { readEmailObject } from "#/lib/emails/storage";
import { createDraft, createMailbox, getMessage, getMailbox, listMailboxes, listMessages, setMessageRead, updateMailbox } from "#/lib/emails/repository";
import { sendDraft } from "#/lib/emails/outbound";
import type { MailboxAddress, MessageFolder } from "#/lib/emails/types";

const folders = new Set<MessageFolder>(["inbox", "sent", "drafts", "archive", "trash"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, init: ResponseInit = {}) =>
  Response.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...init.headers },
  });

const parseJson = async (request: Request) => {
  const value = await request.json();
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Request body must be an object.");
  return value as Record<string, unknown>;
};

function getString(value: unknown, field: string): string;
function getString(value: unknown, field: string, required: false): string | undefined;
function getString(value: unknown, field: string, required = true) {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const normalized = value.trim();
  if (required && !normalized) throw new Error(`${field} is required.`);
  if (normalized.length > 20_000) throw new Error(`${field} is too long.`);
  return normalized;
}

const getAddressList = (value: unknown, field: string, required = false): MailboxAddress[] => {
  if (value === undefined && !required) return [];
  if (!Array.isArray(value) || (required && value.length === 0)) throw new Error(`${field} must contain at least one email address.`);

  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`${field} contains an invalid address.`);
    const address = getString((entry as Record<string, unknown>).address, `${field} address`);
    const name = getString((entry as Record<string, unknown>).name, `${field} name`, false) ?? "";
    if (!emailPattern.test(address)) throw new Error(`${field} contains an invalid email address.`);
    return { name, address: address.toLowerCase() };
  });
};

const assertMailboxDomain = (address: string, env: Env) => {
  const domain = env.EMAIL_DOMAIN.toLowerCase();
  if (!address.endsWith(`@${domain}`)) throw new Error(`Mailbox addresses must use @${domain}.`);
};

const messageSummary = (message: Awaited<ReturnType<typeof listMessages>>[number]) => ({
  id: message.id,
  threadId: message.threadId,
  direction: message.direction,
  subject: message.subject,
  excerpt: message.excerpt,
  from: message.from,
  to: message.to,
  attachmentCount: message.attachmentCount,
  isRead: message.isRead,
  isStarred: message.isStarred,
  createdAt: message.createdAt,
  receivedAt: message.receivedAt,
  sentAt: message.sentAt,
});

const apiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "The request could not be completed.";
  if (message.startsWith("Failed query:")) {
    console.error("Email storage query failed.", error);
    return json({ error: "Email storage is not ready. Apply the D1 migration, then try again." }, { status: 503 });
  }
  return json({ error: message }, { status: 400 });
};

export const handleEmailApi = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin" || parts[1] !== "api" || parts[2] !== "emails") return null;

  try {
    if (parts.length === 4 && parts[3] === "mailboxes") {
      if (request.method === "GET") return json({ mailboxes: await listMailboxes(env) });
      if (request.method === "POST") {
        const body = await parseJson(request);
        const address = getString(body.address, "Address").toLowerCase();
        const displayName = getString(body.displayName, "Display name");
        if (!emailPattern.test(address)) throw new Error("Address must be a valid email address.");
        assertMailboxDomain(address, env);
        return json({ mailbox: await createMailbox(env, address, displayName) }, { status: 201 });
      }
    }

    const mailboxId = parts[4];
    if (parts.length === 5 && parts[3] === "mailboxes" && mailboxId) {
      if (request.method === "GET") {
        const mailbox = await getMailbox(env, mailboxId);
        return mailbox ? json({ mailbox }) : json({ error: "Mailbox not found." }, { status: 404 });
      }
      if (request.method === "PATCH") {
        const body = await parseJson(request);
        const values: {
          displayName?: string;
          signature?: string;
          agentInstructions?: string;
          autoDraft?: boolean;
          isActive?: boolean;
        } = {};
        if (body.displayName !== undefined) values.displayName = getString(body.displayName, "Display name");
        if (body.signature !== undefined) values.signature = getString(body.signature, "Signature", false) ?? "";
        if (body.agentInstructions !== undefined) values.agentInstructions = getString(body.agentInstructions, "Agent instructions", false) ?? "";
        if (body.autoDraft !== undefined) {
          if (typeof body.autoDraft !== "boolean") throw new Error("Auto draft must be true or false.");
          values.autoDraft = body.autoDraft;
        }
        if (body.isActive !== undefined) {
          if (typeof body.isActive !== "boolean") throw new Error("Mailbox status must be true or false.");
          values.isActive = body.isActive;
        }
        const mailbox = await updateMailbox(env, mailboxId, values);
        return mailbox ? json({ mailbox }) : json({ error: "Mailbox not found." }, { status: 404 });
      }
    }

    if (parts.length === 6 && parts[3] === "mailboxes" && parts[5] === "messages" && mailboxId && request.method === "GET") {
      const folder = url.searchParams.get("folder") ?? "inbox";
      if (!folders.has(folder as MessageFolder)) throw new Error("Folder is invalid.");
      const mailbox = await getMailbox(env, mailboxId);
      if (!mailbox) return json({ error: "Mailbox not found." }, { status: 404 });
      const messages = await listMessages(env, mailboxId, folder as MessageFolder, url.searchParams.get("query"));
      return json({ messages: messages.map(messageSummary) });
    }

    const messageId = parts[6];
    if (parts.length === 7 && parts[3] === "mailboxes" && parts[5] === "messages" && mailboxId && messageId) {
      if (request.method === "GET") {
        const result = await getMessage(env, mailboxId, messageId);
        if (!result) return json({ error: "Message not found." }, { status: 404 });
        return json({
          message: { ...messageSummary(result.message), cc: result.message.cc, bcc: result.message.bcc, inReplyTo: result.message.inReplyTo },
          bodyText: result.bodyText,
          bodyHtml: result.bodyHtml,
          attachments: result.attachments.map((attachment) => ({
            id: attachment.id,
            filename: attachment.filename,
            contentType: attachment.contentType,
            disposition: attachment.disposition,
            size: attachment.size,
          })),
        });
      }
      if (request.method === "PATCH") {
        const body = await parseJson(request);
        if (typeof body.isRead !== "boolean") throw new Error("isRead must be true or false.");
        await setMessageRead(env, mailboxId, messageId, body.isRead);
        return json({ ok: true });
      }
    }

    if (parts.length === 6 && parts[3] === "mailboxes" && parts[5] === "drafts" && mailboxId && request.method === "POST") {
      const body = await parseJson(request);
      const text = getString(body.text, "Message");
      const html = body.html === undefined ? undefined : (getString(body.html, "HTML", false) ?? "");
      const replyToMessageId = body.replyToMessageId === undefined ? undefined : getString(body.replyToMessageId, "Reply message ID");
      const messageId = await createDraft(env, {
        mailboxId,
        to: getAddressList(body.to, "To", true),
        cc: getAddressList(body.cc, "Cc"),
        bcc: getAddressList(body.bcc, "Bcc"),
        subject: getString(body.subject, "Subject"),
        text,
        html,
        replyToMessageId,
      });
      return json({ messageId }, { status: 201 });
    }

    if (parts.length === 8 && parts[3] === "mailboxes" && parts[5] === "messages" && parts[7] === "send" && mailboxId && messageId && request.method === "POST") {
      await sendDraft(env, mailboxId, messageId);
      return json({ ok: true });
    }

    if (parts.length === 9 && parts[3] === "mailboxes" && parts[5] === "messages" && parts[7] === "attachments" && mailboxId && messageId && request.method === "GET") {
      const attachmentId = parts[8];
      const result = await getMessage(env, mailboxId, messageId);
      const attachment = result?.attachments.find((item) => item.id === attachmentId);
      if (!attachment) return json({ error: "Attachment not found." }, { status: 404 });
      const object = await readEmailObject(env, attachment.objectKey);
      if (!object) return json({ error: "Attachment content is unavailable." }, { status: 404 });
      const filename = attachment.filename.replace(/["\\\r\n]/g, "_");
      return new Response(object.body, {
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Type": attachment.contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    return apiError(error);
  }

  return json({ error: "Email endpoint not found." }, { status: 404 });
};
