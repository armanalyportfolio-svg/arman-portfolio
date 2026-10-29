"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Session } from "@supabase/supabase-js";
import {
  Briefcase,
  ExternalLink,
  FileText,
  Home,
  Image as ImageIcon,
  Inbox,
  Loader2,
  LogOut,
  MessageSquareQuote,
  Phone,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mergeContent } from "@/lib/content/merge";
import type { SectionKey, SiteContent } from "@/lib/content/types";
import { saveSection } from "@/app/actions/content";
import LoginForm from "./LoginForm";
import MessagesPanel from "./MessagesPanel";
import {
  AboutEditor,
  ContactEditor,
  GeneralEditor,
  HeroEditor,
  PortfolioEditor,
  ResumeEditor,
  SeoEditor,
  ServicesEditor,
  TestimonialsEditor,
} from "./sections";

type Tab = SectionKey | "messages";

const tabs: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { id: "messages", label: "Inbox", icon: Inbox, description: "Contact form submissions" },
  { id: "general", label: "General", icon: Settings, description: "Name, availability and footer" },
  { id: "hero", label: "Hero", icon: Home, description: "The first screen visitors see" },
  { id: "about", label: "About", icon: User, description: "Bio, photo, stats and skills" },
  { id: "services", label: "Services", icon: Sparkles, description: "What you offer" },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon, description: "Projects, categories and gallery" },
  { id: "resume", label: "Resume", icon: Briefcase, description: "Experience, education and CV" },
  { id: "testimonials", label: "Reviews", icon: MessageSquareQuote, description: "Client testimonials" },
  { id: "contact", label: "Contact", icon: Phone, description: "Email, WhatsApp and social links" },
  { id: "seo", label: "SEO", icon: Search, description: "Google and link-sharing preview" },
];

type EditorFor<K extends SectionKey> = React.ComponentType<{
  value: SiteContent[K];
  onChange: (value: SiteContent[K]) => void;
}>;

const editors: { [K in SectionKey]: EditorFor<K> } = {
  general: GeneralEditor,
  seo: SeoEditor,
  hero: HeroEditor,
  about: AboutEditor,
  services: ServicesEditor,
  portfolio: PortfolioEditor,
  resume: ResumeEditor,
  testimonials: TestimonialsEditor,
  contact: ContactEditor,
};

function renderEditor<K extends SectionKey>(
  key: K,
  value: SiteContent[K],
  onChange: (value: SiteContent[K]) => void
) {
  const Editor = editors[key] as EditorFor<K>;
  return <Editor value={value} onChange={onChange} />;
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "signed-out" | "denied" | "ready">("loading");
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [unread, setUnread] = useState(0);
  const [deniedReason, setDeniedReason] = useState("");

  // Track the Supabase session
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setStatus("signed-out");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) setStatus((prev) => (prev === "denied" ? prev : "signed-out"));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Once signed in: confirm admin rights, then load the latest content
  const userId = session?.user.id;
  const userEmail = session?.user.email;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
      if (cancelled) return;
      if (rpcError || !isAdmin) {
        const email = userEmail ?? "unknown";
        setDeniedReason(
          rpcError
            ? `Admin check failed: ${rpcError.message}. Did you run supabase/schema.sql?`
            : `Signed in as ${email}, but this email is not in the admin_users table.`
        );
        setStatus("denied");
        await supabase.auth.signOut();
        return;
      }
      const { data, error } = await supabase.from("site_content").select("key, data");
      if (cancelled) return;
      if (error) toast.error(`Could not load content: ${error.message}`);
      const content = mergeContent(data);
      setSaved(content);
      setDraft(structuredClone(content));
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, userEmail]);

  const dirtySections = useMemo(() => {
    if (!saved || !draft) return new Set<SectionKey>();
    return new Set(
      (Object.keys(draft) as SectionKey[]).filter(
        (k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])
      )
    );
  }, [saved, draft]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    if (dirtySections.size === 0) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtySections]);

  const handleSave = useCallback(async () => {
    if (!draft || tab === "messages") return;
    setSaving(true);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setSaving(false);
      toast.error("Session expired. Please sign in again.");
      return;
    }
    const result = await saveSection(tab, draft[tab], token);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSaved((prev) => (prev ? { ...prev, [tab]: structuredClone(draft[tab]) } : prev));
    toast.success("Saved — live on the site now");
  }, [draft, tab]);

  // Ctrl/Cmd + S saves the current section
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  const handleDiscard = () => {
    if (!saved || tab === "messages") return;
    setDraft((prev) => (prev ? { ...prev, [tab]: structuredClone(saved[tab]) } : prev));
  };

  const handleUnreadChange = useCallback((count: number) => setUnread(count), []);

  if (!isSupabaseConfigured) return <SetupNotice />;

  if (status === "signed-out" || status === "denied") {
    return (
      <LoginForm
        error={status === "denied" ? deniedReason : undefined}
      />
    );
  }

  if (status === "loading" || !draft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] text-[var(--text-muted)]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const current = tabs.find((t) => t.id === tab)!;
  const isDirty = tab !== "messages" && dirtySections.has(tab);

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] lg:flex">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between lg:block">
          <div>
            <div className="font-display text-lg font-bold">
              <span className="gradient-text">{saved?.general.logoText}</span>
              <span className="text-[#5C5470]">.</span>
              <span className="text-xs font-mono text-[var(--text-muted)] ml-2">admin</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] truncate hidden lg:block mt-0.5">
              {session?.user.email}
            </p>
          </div>
          <div className="flex gap-1 lg:hidden">
            <a href="/" target="_blank" className="p-2 rounded-lg text-[var(--text-muted)]" aria-label="View site">
              <ExternalLink size={17} />
            </a>
            <button onClick={() => supabase.auth.signOut()} className="p-2 rounded-lg text-[var(--text-muted)]" aria-label="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 px-3 pb-3 overflow-x-auto lg:overflow-y-auto lg:flex-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const dirty = t.id !== "messages" && dirtySections.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-[#5C5470] text-white font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{t.label}</span>
                {t.id === "messages" && unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">{unread}</span>
                )}
                {dirty && <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />}
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:flex flex-col gap-1 p-3 border-t border-[var(--border-subtle)]">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <FileText size={18} className="text-[var(--text-muted)] hidden sm:block" />
              {current.label}
            </h1>
            <p className="text-xs text-[var(--text-muted)] truncate">{current.description}</p>
          </div>
          {tab !== "messages" && (
            <div className="flex items-center gap-2 shrink-0">
              {isDirty && (
                <button
                  onClick={handleDiscard}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <RotateCcw size={13} /> <span className="hidden sm:inline">Discard</span>
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {saving ? "Saving..." : isDirty ? "Save changes" : "Saved"}
              </button>
            </div>
          )}
        </header>

        <div className="px-5 sm:px-8 py-6 max-w-4xl space-y-5">
          {tab === "messages" ? (
            <MessagesPanel onUnreadChange={handleUnreadChange} />
          ) : (
            renderEditor(tab, draft[tab], (value) =>
              setDraft((prev) => (prev ? { ...prev, [tab]: value } : prev))
            )
          )}
        </div>
      </main>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-deep)]">
      <div className="max-w-lg glass rounded-3xl p-8 border border-[var(--border-subtle)] space-y-4">
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Admin setup needed</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The admin panel stores content in Supabase, but no Supabase keys are configured yet.
        </p>
        <ol className="text-sm text-[var(--text-muted)] list-decimal pl-5 space-y-1.5">
          <li>Create a free project at supabase.com.</li>
          <li>
            Run <code className="text-[var(--text-main)]">supabase/schema.sql</code> in the SQL Editor.
          </li>
          <li>
            Put the project URL and anon key in <code className="text-[var(--text-main)]">.env.local</code>.
          </li>
          <li>Create your admin user and restart the dev server.</li>
        </ol>
        <p className="text-xs text-[var(--text-muted)]">Full steps are in the README.</p>
      </div>
    </div>
  );
}
