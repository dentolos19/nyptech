CREATE TABLE `mailboxes` (
  `id` text PRIMARY KEY NOT NULL,
  `address` text NOT NULL,
  `display_name` text NOT NULL,
  `signature` text DEFAULT '' NOT NULL,
  `agent_instructions` text DEFAULT '' NOT NULL,
  `auto_draft` integer DEFAULT false NOT NULL,
  `is_active` integer DEFAULT true NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mailboxes_address_unique` ON `mailboxes` (`address`);
--> statement-breakpoint
CREATE TABLE `folders` (
  `id` text PRIMARY KEY NOT NULL,
  `mailbox_id` text NOT NULL REFERENCES `mailboxes`(`id`) ON UPDATE no action ON DELETE cascade,
  `kind` text NOT NULL,
  `name` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `folders_mailbox_kind_unique` ON `folders` (`mailbox_id`, `kind`);
--> statement-breakpoint
CREATE TABLE `threads` (
  `id` text PRIMARY KEY NOT NULL,
  `mailbox_id` text NOT NULL REFERENCES `mailboxes`(`id`) ON UPDATE no action ON DELETE cascade,
  `subject` text NOT NULL,
  `last_message_at` integer NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `threads_mailbox_last_message_idx` ON `threads` (`mailbox_id`, `last_message_at`);
--> statement-breakpoint
CREATE TABLE `messages` (
  `id` text PRIMARY KEY NOT NULL,
  `mailbox_id` text NOT NULL REFERENCES `mailboxes`(`id`) ON UPDATE no action ON DELETE cascade,
  `thread_id` text NOT NULL REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE cascade,
  `folder_id` text NOT NULL REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE restrict,
  `direction` text NOT NULL,
  `rfc_message_id` text,
  `in_reply_to` text,
  `references` text,
  `from_json` text NOT NULL,
  `to_json` text NOT NULL,
  `cc_json` text DEFAULT '[]' NOT NULL,
  `bcc_json` text DEFAULT '[]' NOT NULL,
  `subject` text NOT NULL,
  `excerpt` text DEFAULT '' NOT NULL,
  `raw_key` text,
  `text_key` text,
  `html_key` text,
  `attachment_count` integer DEFAULT 0 NOT NULL,
  `is_read` integer DEFAULT false NOT NULL,
  `is_starred` integer DEFAULT false NOT NULL,
  `received_at` integer,
  `sent_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages_mailbox_rfc_message_id_unique` ON `messages` (`mailbox_id`, `rfc_message_id`);
--> statement-breakpoint
CREATE INDEX `messages_folder_created_idx` ON `messages` (`folder_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX `messages_thread_created_idx` ON `messages` (`thread_id`, `created_at`);
--> statement-breakpoint
CREATE TABLE `attachments` (
  `id` text PRIMARY KEY NOT NULL,
  `message_id` text NOT NULL REFERENCES `messages`(`id`) ON UPDATE no action ON DELETE cascade,
  `filename` text NOT NULL,
  `content_type` text NOT NULL,
  `disposition` text NOT NULL,
  `content_id` text,
  `size` integer NOT NULL,
  `object_key` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attachments_message_idx` ON `attachments` (`message_id`);
