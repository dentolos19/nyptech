import { createFileRoute } from "@tanstack/react-router";
import { Archive, FileText, Inbox, Mail, MailPlus, PenLine, Send, Trash2, Users, X } from "lucide-react";
import { startTransition, useEffect, useState } from "react";

import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/admin/emails/")({
  head: () => ({ meta: [{ title: "Emails | NYP Technopreneurship Admin" }] }),
  component: EmailsPage,
});

type Mailbox = {
  id: string;
  address: string;
  displayName: string;
  autoDraft: boolean;
  isActive: boolean;
};

type Address = { name: string; address: string };

type Message = {
  id: string;
  direction: "inbound" | "outbound";
  subject: string;
  excerpt: string;
  from: Address[];
  to: Address[];
  attachmentCount: number;
  isRead: boolean;
  createdAt: number;
  sentAt: number | null;
};

type MessageDetail = {
  message: Message & { cc: Address[]; bcc: Address[]; inReplyTo: string | null };
  bodyText: string | null;
  bodyHtml: string | null;
  attachments: { id: string; filename: string; contentType: string; disposition: string; size: number }[];
};

type Folder = "inbox" | "sent" | "drafts" | "archive" | "trash";

const folderItems: { id: Folder; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "sent", label: "Sent", icon: Send },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const api = async <T,>(url: string, init?: RequestInit) => {
  const response = await fetch(url, { credentials: "same-origin", ...init });
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "The request could not be completed.");
  return body;
};

const formatPeople = (people: Address[]) => people.map((person) => person.name || person.address).join(", ");

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(value);

const formatSize = (size: number) => (size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`);

function EmailsPage() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [mailboxId, setMailboxId] = useState<string | null>(null);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<MessageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMailbox, setIsAddingMailbox] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [error, setError] = useState("");

  const loadMailboxes = async () => {
    setIsLoading(true);
    try {
      const response = await api<{ mailboxes: Mailbox[] }>("/admin/api/emails/mailboxes");
      setMailboxes(response.mailboxes);
      setMailboxId((current) => current ?? response.mailboxes[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load mailboxes.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!mailboxId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    setSelected(null);
    try {
      const response = await api<{ messages: Message[] }>(`/admin/api/emails/mailboxes/${mailboxId}/messages?folder=${folder}`);
      setMessages(response.messages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMailboxes();
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [mailboxId, folder]);

  const selectMessage = async (message: Message) => {
    if (!mailboxId) return;
    try {
      const response = await api<MessageDetail>(`/admin/api/emails/mailboxes/${mailboxId}/messages/${message.id}`);
      startTransition(() => setSelected(response));
      if (!message.isRead) {
        void api(`/admin/api/emails/mailboxes/${mailboxId}/messages/${message.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, isRead: true } : item)));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to open the message.");
    }
  };

  const sendSelectedDraft = async () => {
    if (!mailboxId || !selected) return;
    try {
      await api(`/admin/api/emails/mailboxes/${mailboxId}/messages/${selected.message.id}/send`, { method: "POST" });
      setFolder("sent");
      setSelected(null);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send the draft.");
    }
  };

  const selectedMailbox = mailboxes.find((mailbox) => mailbox.id === mailboxId) ?? null;

  return (
    <section className="min-w-0 bg-white md:h-full md:min-h-0">
      {isAddingMailbox ? (
        <EmailOverlay title="Add mailbox">
          <MailboxForm
            onClose={() => setIsAddingMailbox(false)}
            onCreated={(mailbox) => {
              setMailboxes((current) => [...current, mailbox]);
              setMailboxId(mailbox.id);
              setIsAddingMailbox(false);
            }}
            onError={setError}
          />
        </EmailOverlay>
      ) : null}

      {isComposing && selectedMailbox ? (
        <EmailOverlay title={`New message from ${selectedMailbox.address}`}>
          <ComposeForm
            mailbox={selectedMailbox}
            onClose={() => setIsComposing(false)}
            onSaved={() => {
              setIsComposing(false);
              setFolder("drafts");
            }}
            onError={setError}
          />
        </EmailOverlay>
      ) : null}

      <div className="border-border grid min-h-dvh border-y bg-white md:h-full md:min-h-0 md:grid-cols-[15rem_minmax(0,1fr)] md:border-y-0 md:border-r lg:grid-cols-[15rem_minmax(18rem,0.95fr)_minmax(0,1.5fr)]">
        <aside className="border-border flex min-h-0 flex-col border-b p-4 md:overflow-y-auto md:border-r md:border-b-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase">Mailboxes</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                disabled={!mailboxId}
                className="text-brand hover:bg-brand-soft grid size-8 place-items-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Compose email"
              >
                <PenLine className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsAddingMailbox(true)}
                className="text-brand hover:bg-brand-soft grid size-8 place-items-center rounded-lg transition-colors"
                aria-label="Add mailbox"
              >
                <MailPlus className="size-4" />
              </button>
            </div>
          </div>
          {error ? (
            <div role="alert" className="border-destructive/30 bg-destructive/10 text-destructive mt-3 rounded-xl border px-3 py-2.5 text-xs leading-relaxed">
              {error}
            </div>
          ) : null}
          <div className="mt-3 space-y-1">
            {mailboxes.map((mailbox) => (
              <button
                key={mailbox.id}
                type="button"
                onClick={() => setMailboxId(mailbox.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  mailbox.id === mailboxId ? "bg-brand text-white" : "hover:bg-brand-soft"
                }`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/20 text-xs font-bold">{mailbox.address[0]?.toUpperCase()}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{mailbox.displayName}</span>
                  <span className={`block truncate text-xs ${mailbox.id === mailboxId ? "text-white/70" : "text-muted-foreground"}`}>{mailbox.address}</span>
                </span>
              </button>
            ))}
            {!isLoading && mailboxes.length === 0 ? <p className="text-muted-foreground px-2 py-4 text-sm">Add your first @nyptech.club mailbox.</p> : null}
          </div>
          <div className="border-border mt-5 border-t pt-4">
            {folderItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFolder(item.id)}
                  className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                    folder === item.id ? "bg-brand-soft text-brand font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="border-border flex min-h-[24rem] min-w-0 flex-col border-b md:min-h-0 md:border-b-0 lg:border-r">
          <div className="border-border flex h-14 items-center justify-between border-b px-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold capitalize">{folder}</p>
              {selectedMailbox ? <p className="text-muted-foreground truncate text-xs">{selectedMailbox.address}</p> : null}
            </div>
            <span className="text-muted-foreground shrink-0 text-xs">{messages.length}</span>
          </div>
          <div className="divide-border min-h-0 flex-1 overflow-y-auto divide-y">
            {isLoading ? <p className="text-muted-foreground p-5 text-sm">Loading messages.</p> : null}
            {!isLoading && messages.length === 0 ? <EmptyMessages folder={folder} /> : null}
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => void selectMessage(message)}
                className={`w-full px-4 py-4 text-left transition-colors hover:bg-[#fffaf7] ${selected?.message.id === message.id ? "bg-brand-soft" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`min-w-0 flex-1 truncate text-sm ${message.isRead ? "font-medium" : "font-bold"}`}>
                    {message.direction === "inbound" ? formatPeople(message.from) : `To ${formatPeople(message.to)}`}
                  </span>
                  <time className="text-muted-foreground shrink-0 text-xs">{formatDate(message.createdAt)}</time>
                </div>
                <p className={`mt-1 truncate text-sm ${message.isRead ? "text-muted-foreground" : "font-semibold"}`}>{message.subject}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">{message.excerpt || "No preview available."}</p>
              </button>
            ))}
          </div>
        </div>

        <MessageViewer detail={selected} mailboxId={mailboxId} onSend={() => void sendSelectedDraft()} />
      </div>
    </section>
  );
}

const EmptyMessages = ({ folder }: { folder: Folder }) => (
  <div className="grid min-h-48 place-items-center p-8 text-center">
    <div>
      <Mail className="text-brand bg-brand-soft mx-auto grid size-10 place-items-center rounded-xl p-2" />
      <p className="mt-4 text-sm font-semibold">Nothing in {folder}.</p>
      <p className="text-muted-foreground mt-1 text-xs">New messages will appear here.</p>
    </div>
  </div>
);

const MessageViewer = ({ detail, mailboxId, onSend }: { detail: MessageDetail | null; mailboxId: string | null; onSend: () => void }) => {
  if (!detail || !mailboxId) {
    return (
      <div className="text-muted-foreground grid min-h-[24rem] place-items-center p-8 text-center md:col-span-2 lg:col-auto lg:min-h-0">
        <div>
          <Mail className="text-brand bg-brand-soft mx-auto grid size-12 place-items-center rounded-2xl p-3" />
          <p className="mt-4 text-sm font-semibold text-foreground">Choose a message.</p>
          <p className="mt-1 max-w-xs text-sm">The message body stays in private object storage until you open it.</p>
        </div>
      </div>
    );
  }

  const sender = detail.message.direction === "inbound" ? detail.message.from : detail.message.to;
  return (
    <article className="min-h-[24rem] min-w-0 md:col-span-2 md:flex md:min-h-0 md:flex-col lg:col-auto">
      <header className="border-border border-b px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">{detail.message.direction === "inbound" ? "Received" : detail.message.sentAt ? "Sent" : "Draft"}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{detail.message.subject}</h2>
          </div>
          {detail.message.direction === "outbound" && !detail.message.sentAt ? (
            <Button onClick={onSend} className="rounded-xl">
              <Send />
              Send Draft
            </Button>
          ) : null}
        </div>
        <div className="mt-5 flex items-center gap-3 text-sm">
          <span className="bg-brand-soft text-brand grid size-9 place-items-center rounded-full font-semibold">{(sender[0]?.name || sender[0]?.address || "?")[0]?.toUpperCase()}</span>
          <div className="min-w-0">
            <p className="truncate font-medium">{formatPeople(sender)}</p>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">{formatDate(detail.message.createdAt)}</p>
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
        {detail.bodyHtml ? (
          <iframe
            title="Email message"
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={detail.bodyHtml}
            className="h-80 w-full rounded-xl border bg-white"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7">{detail.bodyText || "No message body was included."}</p>
        )}
        {detail.attachments.length > 0 ? (
          <div className="border-border mt-8 border-t pt-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase">Attachments</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {detail.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={`/admin/api/emails/mailboxes/${mailboxId}/messages/${detail.message.id}/attachments/${attachment.id}`}
                  className="border-border hover:bg-brand-soft flex items-center gap-3 rounded-xl border p-3 text-sm transition-colors"
                >
                  <FileText className="text-brand size-4" />
                  <span className="min-w-0 flex-1 truncate font-medium">{attachment.filename}</span>
                  <span className="text-muted-foreground text-xs">{formatSize(attachment.size)}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
};

const MailboxForm = ({ onClose, onCreated, onError }: { onClose: () => void; onCreated: (mailbox: Mailbox) => void; onError: (message: string) => void }) => {
  const [address, setAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await api<{ mailbox: Mailbox }>("/admin/api/emails/mailboxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, displayName }),
      });
      onCreated(response.mailbox);
    } catch (saveError) {
      onError(saveError instanceof Error ? saveError.message : "Unable to create the mailbox.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Add a mailbox</h2>
        <p className="text-muted-foreground mt-1 text-sm">Use an address on the NYP Technopreneurship domain.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Address
          <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="hello@nyptech.club" className="border-border h-11 rounded-xl border bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-brand/30" required />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Display Name
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Community Team" className="border-border h-11 rounded-xl border bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-brand/30" required />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Adding" : "Add Mailbox"}</Button>
      </div>
    </form>
  );
};

const ComposeForm = ({ mailbox, onClose, onSaved, onError }: { mailbox: Mailbox; onClose: () => void; onSaved: () => void; onError: (message: string) => void }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api(`/admin/api/emails/mailboxes/${mailbox.id}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: [{ name: "", address: to }], subject, text }),
      });
      onSaved();
    } catch (saveError) {
      onError(saveError instanceof Error ? saveError.message : "Unable to save the draft.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">New message</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm"><Users className="text-brand size-4" /> From {mailbox.address}</p>
        </div>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-9 place-items-center rounded-xl transition-colors" aria-label="Close compose panel"><X className="size-4" /></button>
      </div>
      <div className="grid gap-3">
        <input value={to} onChange={(event) => setTo(event.target.value)} placeholder="Recipient email" className="border-border h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand/30" required />
        <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="border-border h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand/30" required />
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Write your message." className="border-border min-h-44 rounded-xl border bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand/30" required />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Discard</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving" : "Save Draft"}</Button>
      </div>
    </form>
  );
};

const EmailOverlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="fixed inset-0 z-50 flex items-end bg-[#32180b]/35 p-3 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-8" role="dialog" aria-modal="true" aria-label={title}>
    <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-5 shadow-[0_24px_80px_rgba(50,24,11,0.22)] sm:rounded-3xl sm:p-7">
      {children}
    </div>
  </div>
);
