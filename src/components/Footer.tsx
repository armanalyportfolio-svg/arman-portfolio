"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mail } from "lucide-react";
import { useSocialProfiles } from "./SocialIcons";
import { useSiteContent } from "./SiteContentProvider";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Resume", href: "#resume" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const { general, contact } = useSiteContent();
  const socialProfiles = useSocialProfiles();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[var(--bg-deep)] border-t border-[var(--border-subtle)] py-14 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-10 border-b border-[var(--border-subtle)]">
          {/* Logo & Headline (5 Cols) */}
          <div className="md:col-span-5 text-center md:text-left">
            <span className="font-display text-2xl font-black gradient-text tracking-tight">
              {general.name}
            </span>
            <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1 max-w-sm">
              {general.footerTagline}
            </p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-mono"
              >
                <Mail size={13} />
                <span>{contact.email}</span>
              </a>
            </div>
          </div>

          {/* Social Profiles Pill Row (5 Cols) */}
          <div className="md:col-span-5 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {socialProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <motion.a
                  key={profile.name}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={profile.name}
                  className={`w-10 h-10 glass rounded-full flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)] transition-all cursor-pointer ${profile.accent}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>

          {/* Scroll to Top (2 Cols) */}
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 glass rounded-full flex items-center justify-center text-[var(--text-main)] hover:bg-[#5C5470] hover:text-white transition-all cursor-pointer border border-[var(--border-subtle)]"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <nav className="flex flex-wrap justify-center gap-5 md:gap-7">
            {footerLinks.map((link) => (
              <button
                key={link.href}
                onClick={() =>
                  document
                    .getElementById(link.href.replace("#", ""))
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-[var(--text-muted)] text-xs md:text-sm hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <p className="text-[var(--text-muted)] text-xs flex items-center justify-center gap-1.5 font-mono">
            {general.footerCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}