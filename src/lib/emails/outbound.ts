import { getMailbox, getMessage, moveMessageToSent } from "#/lib/emails/repository";

const recipientAddresses = (addresses: { address: string }[]) => addresses.map((recipient) => recipient.address);

export const sendDraft = async (env: Env, mailboxId: string, messageId: string) => {
  const [mailbox, draft] = await Promise.all([getMailbox(env, mailboxId), getMessage(env, mailboxId, messageId)]);
  if (!mailbox) throw new Error("The selected mailbox does not exist.");
  if (!draft) throw new Error("The selected message does not exist.");
  if (draft.message.direction !== "outbound" || draft.message.sentAt !== null) {
    throw new Error("Only unsent drafts can be sent.");
  }
  if (draft.message.to.length === 0) throw new Error("A draft needs at least one recipient.");

  await env.EMAIL.send({
    from: { name: mailbox.displayName, email: mailbox.address },
    to: recipientAddresses(draft.message.to),
    cc: recipientAddresses(draft.message.cc),
    bcc: recipientAddresses(draft.message.bcc),
    subject: draft.message.subject,
    text: draft.bodyText ?? "",
    html: draft.bodyHtml ?? undefined,
    headers: {
      ...(draft.message.inReplyTo ? { "In-Reply-To": draft.message.inReplyTo } : {}),
      ...(draft.message.references ? { References: draft.message.references } : {}),
    },
  });
  await moveMessageToSent(env, mailboxId, messageId);
};
