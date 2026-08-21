export type MailboxAddress = {
  name: string;
  address: string;
};

export type MessageFolder = "inbox" | "sent" | "drafts" | "archive" | "trash";

export type MessageDraftInput = {
  mailboxId: string;
  to: MailboxAddress[];
  cc?: MailboxAddress[];
  bcc?: MailboxAddress[];
  subject: string;
  text: string;
  html?: string;
  replyToMessageId?: string;
};

export type StoredAttachment = {
  filename: string;
  contentType: string;
  disposition: "attachment" | "inline";
  contentId?: string;
  content: ArrayBuffer | Uint8Array | string;
};
