import PostalMime, { type Address } from "postal-mime";

import { createAutomaticDraft } from "#/lib/emails/auto-draft";
import { getMailboxByAddress, storeIncomingMessage } from "#/lib/emails/repository";
import type { MailboxAddress, StoredAttachment } from "#/lib/emails/types";

const flattenAddresses = (addresses: Address[] | undefined): MailboxAddress[] =>
  (addresses ?? []).flatMap((address) =>
    address.group
      ? address.group.map((member) => ({ name: member.name, address: member.address.toLowerCase() }))
      : [{ name: address.name, address: address.address.toLowerCase() }],
  );

const flattenAddress = (address: Address | undefined): MailboxAddress[] => (address ? flattenAddresses([address]) : []);

const parseReferences = (references: string | undefined, inReplyTo: string | undefined) =>
  Array.from(new Set([inReplyTo, ...(references?.match(/<[^>]+>/g) ?? [])].filter((value): value is string => Boolean(value))));

const toAttachment = (attachment: Awaited<ReturnType<typeof PostalMime.parse>>["attachments"][number]): StoredAttachment => ({
  filename: attachment.filename ?? "attachment",
  contentType: attachment.mimeType || "application/octet-stream",
  disposition: attachment.disposition ?? "attachment",
  contentId: attachment.contentId,
  content: attachment.content,
});

export const handleIncomingEmail = async (message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) => {
  const mailbox = await getMailboxByAddress(env, message.to);
  if (!mailbox || !mailbox.isActive) {
    message.setReject("This mailbox does not accept email.");
    return;
  }

  const raw = await new Response(message.raw).arrayBuffer();
  const parsed = await PostalMime.parse(raw, { maxNestingDepth: 30, maxHeadersSize: 256 * 1024 });
  const text = parsed.text?.trim() || null;
  const html = parsed.html?.trim() || null;
  const sender = flattenAddress(parsed.from);

  const stored = await storeIncomingMessage(env, {
    mailboxId: mailbox.id,
    from: sender.length > 0 ? sender : [{ name: "", address: message.from.toLowerCase() }],
    to: flattenAddresses(parsed.to),
    cc: flattenAddresses(parsed.cc),
    bcc: flattenAddresses(parsed.bcc),
    subject: parsed.subject?.trim() || "(No subject)",
    excerpt: (text ?? html?.replace(/<[^>]*>/g, " ") ?? "").replace(/\s+/g, " ").trim().slice(0, 280),
    rfcMessageId: parsed.messageId ?? null,
    inReplyTo: parsed.inReplyTo ?? null,
    references: parseReferences(parsed.references, parsed.inReplyTo),
    raw,
    text,
    html,
    attachments: parsed.attachments.map(toAttachment),
  });
  if (!stored.duplicate) ctx.waitUntil(createAutomaticDraft(env, mailbox.id, stored.messageId));
};
