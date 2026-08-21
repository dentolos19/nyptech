import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const mailboxes = sqliteTable(
  "mailboxes",
  {
    id: text("id").primaryKey(),
    address: text("address").notNull(),
    displayName: text("display_name").notNull(),
    signature: text("signature").notNull().default(""),
    agentInstructions: text("agent_instructions").notNull().default(""),
    autoDraft: integer("auto_draft", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [uniqueIndex("mailboxes_address_unique").on(table.address)],
);

export const folders = sqliteTable(
  "folders",
  {
    id: text("id").primaryKey(),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailboxes.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["inbox", "sent", "drafts", "archive", "trash"] }).notNull(),
    name: text("name").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [uniqueIndex("folders_mailbox_kind_unique").on(table.mailboxId, table.kind)],
);

export const threads = sqliteTable(
  "threads",
  {
    id: text("id").primaryKey(),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailboxes.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    lastMessageAt: integer("last_message_at").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("threads_mailbox_last_message_idx").on(table.mailboxId, table.lastMessageAt)],
);

export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    mailboxId: text("mailbox_id")
      .notNull()
      .references(() => mailboxes.id, { onDelete: "cascade" }),
    threadId: text("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    folderId: text("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "restrict" }),
    direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
    rfcMessageId: text("rfc_message_id"),
    inReplyTo: text("in_reply_to"),
    references: text("references"),
    fromJson: text("from_json").notNull(),
    toJson: text("to_json").notNull(),
    ccJson: text("cc_json").notNull().default("[]"),
    bccJson: text("bcc_json").notNull().default("[]"),
    subject: text("subject").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    rawKey: text("raw_key"),
    textKey: text("text_key"),
    htmlKey: text("html_key"),
    attachmentCount: integer("attachment_count").notNull().default(0),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    isStarred: integer("is_starred", { mode: "boolean" }).notNull().default(false),
    receivedAt: integer("received_at"),
    sentAt: integer("sent_at"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("messages_mailbox_rfc_message_id_unique").on(table.mailboxId, table.rfcMessageId),
    index("messages_folder_created_idx").on(table.folderId, table.createdAt),
    index("messages_thread_created_idx").on(table.threadId, table.createdAt),
  ],
);

export const attachments = sqliteTable(
  "attachments",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    disposition: text("disposition").notNull(),
    contentId: text("content_id"),
    size: integer("size").notNull(),
    objectKey: text("object_key").notNull(),
  },
  (table) => [index("attachments_message_idx").on(table.messageId)],
);
