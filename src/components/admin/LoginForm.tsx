"use client";

import { useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginForm({ error: initialError }: { error?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[#5C5470] focus:ring-1 focus:ring-[#5C5470]/40";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-deep)] relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-[420px] h-[420px] rounded-full bg-[#5C5470] opacity-20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] rounded-full bg-[#352F44] opacity-40 blur-[140px] pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm glass rounded-3xl p-7 sm:p-8 border border-[var(--border-subtle)] shadow-2xl space-y-5"
      >
        <div className="text-center mb-2">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#5C5470] flex items-center justify-center text-white">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Admin Login</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Sign in to manage your portfolio</p>
        </div>

        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] rounded-xl font-bold text-sm disabled:opacity-60 cursor-pointer"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
