"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, FileText, PhoneCall, ArrowUpRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useSocialProfiles } from "./SocialIcons";
import { useSiteContent } from "./SiteContentProvider";
import { formatPhone, whatsappUrl } from "@/lib/content/merge";
import { GlitchHeading, SymbioteDivider, SymbioteBlob } from "./Symbiote";

export default function Contact() {
  const { general, contact } = useSiteContent();
  const socialProfiles = useSocialProfiles();
  const contactInfo = [
    {
      icon: <PhoneCall size={18} className="text-emerald-400" />,
      label: "WhatsApp / Direct Phone",
      value: formatPhone(contact.whatsappNumber),
      href: whatsappUrl(contact.whatsappNumber, contact.whatsappMessage),
      isExternal: true,
    },
    {
      icon: <Mail size={18} className="text-[#DBD8E3]" />,
      label: "Email Address",
      value: contact.email,
      href: `mailto:${contact.email}`,
      isExternal: false,
    },
  ].filter((item) => item.value);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("contact_messages").insert([
          {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
          },
        ]);
        if (error) throw error;
      } else {
        // Fallback for local demo mode until live Supabase credentials are inserted
        console.log("Contact form submitted (Demo Mode):", form);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      toast.success("Message sent! I'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[#5C5470] focus:ring-1 focus:ring-[#5C5470]/30 transition-all duration-300";

  return (
    <section id="contact" className="py-20 md:py-28 bg-[var(--bg-surface)] relative overflow-hidden">
      <SymbioteDivider from="deep" />
      <SymbioteBlob className="absolute -bottom-28 -left-24 w-[380px] opacity-50 z-0" />
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,#2A2438_0%,transparent_70%)] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-[radial-gradient(circle,#5C5470_0%,transparent_70%)] opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-[var(--text-muted)] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            {contact.eyebrow}
          </p>
          <GlitchHeading className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">{contact.heading}</GlitchHeading>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto text-sm md:text-base">
            {contact.subheading}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column — Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Primary Contacts */}
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-main)] mb-4">
                Direct Contact
              </h3>
              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-[#5C5470] transition-all group border border-[var(--border-subtle)] cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#5C5470]/20 flex items-center justify-center text-[var(--text-main)] group-hover:bg-[#5C5470] group-hover:text-white transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[var(--text-muted)] text-xs font-mono mb-0.5">{item.label}</p>
                      <p className="text-[var(--text-main)] text-sm font-semibold truncate">{item.value}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Social Media Profiles */}
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-main)] mb-4">
                Social Profiles
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialProfiles.map((profile) => {
                  const Icon = profile.icon;
                  return (
                    <motion.a
                      key={profile.name}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`glass rounded-2xl p-3.5 flex items-center gap-3 border border-[var(--border-subtle)] transition-all cursor-pointer group ${profile.accent}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)] group-hover:text-current transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[var(--text-main)] text-xs font-semibold leading-tight group-hover:text-current transition-colors">
                          {profile.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate font-mono">
                          {profile.handle}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability Status Card */}
            {general.availableForWork && (
            <div className="glass-dark rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-deep)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-[var(--text-main)] font-semibold text-sm">
                  {general.availabilityText}
                </span>
              </div>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                {contact.availabilityNote}
              </p>
            </div>
            )}
          </motion.div>

          {/* Right Column — Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-3xl p-6 sm:p-8 space-y-5 border border-[var(--border-subtle)]"
            >
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text-main)] mb-1">
                  Send a Message
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Fill out the form below and I will respond to your inquiry shortly.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <FileText size={15} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject (e.g. Logo Design, Banner, Business Cards)"
                  value={form.subject}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <MessageSquare size={15} className="absolute left-4 top-3.5 text-[var(--text-muted)]" />
                <textarea
                  name="message"
                  placeholder="Tell me about your project, timeline, and vision... *"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} pl-10 resize-none`}
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 25px rgba(92,84,112,0.4)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              <p className="text-[var(--text-muted)] text-[11px] text-center">
                Messages are delivered directly to {general.name}.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}