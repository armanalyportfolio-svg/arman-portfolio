"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Inbox, Loader2, Mail, MailOpen, RefreshCw, Reply, Trash2 } from "lucide-react";
import { supabase, type ContactMessage } from "@/lib/supabase";

type Message = ContactMessage & { id: string; created_at: string; is_read: boolean };

export default function MessagesPanel({ onUnreadChange }: { onUnreadChange: (count: number) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchMessages = useCallback(
    () =>
      supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) toast.error(error.message);
          else setMessages(data as Message[]);
          setLoading(false);
        }),
    []
  );

  const load = () => {
    setLoading(true);
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    onUnreadChange(messages.filter((m) => !m.is_read).length);
  }, [messages, onUnreadChange]);

  const setRead = async (id: string, is_read: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read } : m)));
    const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted");
  };

  const toggleOpen = (m: Message) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) setRead(m.id, true);
  };

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-base font-bold text-[var(--text-main)]">Inbox</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Messages sent through the contact form.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading && messages.length === 0 ? (
        <div className="py-16 flex justify-center text-[var(--text-muted)]">
          <Loader2 className="animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-muted)]">
          <Inbox className="mx-auto mb-3 opacity-50" size={32} />
          <p className="text-sm">No messages yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {messages.map((m) => {
            const isOpen = openId === m.id;
            return (
              <li
                key={m.id}
                className={`rounded-xl border transition-colors ${
                  isOpen ? "border-[#5C5470] bg-[var(--bg-deep)]/60" : "border-[var(--border-subtle)] bg-[var(--bg-deep)]/30"
                }`}
              >
                <button
                  onClick={() => toggleOpen(m)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${m.is_read ? "bg-transparent" : "bg-emerald-400"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${m.is_read ? "text-[var(--text-muted)]" : "text-[var(--text-main)] font-semibold"}`}>
                        {m.name}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] truncate hidden sm:inline">&lt;{m.email}&gt;</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {m.subject ? `${m.subject} — ` : ""}
                      {m.message}
                    </p>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono shrink-0">
                    {new Date(m.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-muted)] my-3 space-y-0.5">
                      <div>
                        <strong className="text-[var(--text-main)]">From:</strong> {m.name} &lt;{m.email}&gt;
                      </div>
                      {m.subject && (
                        <div>
                          <strong className="text-[var(--text-main)]">Subject:</strong> {m.subject}
                        </div>
                      )}
                      <div>
                        <strong className="text-[var(--text-main)]">Date:</strong> {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-main)] whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5C5470] text-white hover:bg-[#6d6484]"
                      >
                        <Reply size={13} /> Reply by email
                      </a>
                      <button
                        onClick={() => setRead(m.id, !m.is_read)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                      >
                        {m.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                        Mark as {m.is_read ? "unread" : "read"}
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-500/40 cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
