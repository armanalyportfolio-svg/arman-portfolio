"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useSocialProfiles } from "./SocialIcons";
import { useSiteContent } from "./SiteContentProvider";
import { formatPhone, whatsappUrl } from "@/lib/content/merge";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#resume", label: "Resume" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { general, contact } = useSiteContent();
  const socialProfiles = useSocialProfiles();
  const whatsappLink = whatsappUrl(contact.whatsappNumber, contact.whatsappMessage);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const sec of sections.reverse()) {
        const el = document.getElementById(sec);
        if (el && window.scrollY + 100 >= el.offsetTop) {
          setActiveSection(sec);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo("#home")}
            whileHover={{ scale: 1.05 }}
            className="font-display text-xl font-bold cursor-pointer"
          >
            <span className="gradient-text">{general.logoText}</span>
            <span className="text-[#5C5470]">.</span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative text-sm font-medium transition-colors duration-300 cursor-pointer ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[var(--text-main)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                {link.label}
                {activeSection === link.href.replace("#", "") && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--text-main)] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions: Theme Toggle + WhatsApp + Hire Me CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--text-main)] hover:border-[#5C5470] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} className="text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} className="text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Quick WhatsApp link */}
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Direct WhatsApp Chat"
              title={`Chat on WhatsApp (${formatPhone(contact.whatsappNumber)})`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.a>

            {/* Hire Me CTA */}
            <motion.button
              onClick={() => scrollTo("#contact")}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(92,84,112,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-[#5C5470] text-white rounded-full text-sm font-medium hover:bg-[var(--bg-surface)] hover:text-[var(--text-main)] transition-colors border border-[#5C5470] cursor-pointer"
            >
              Hire Me
            </motion.button>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-[var(--text-main)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[var(--text-main)] p-2"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-72 glass-dark flex flex-col pt-24 pb-8 px-8 justify-between md:hidden border-l border-[var(--border-subtle)]"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className={`text-left text-base font-medium transition-colors ${
                    activeSection === link.href.replace("#", "")
                      ? "text-[var(--text-main)] font-bold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-center gap-3">
                {socialProfiles.map((profile) => {
                  const Icon = profile.icon;
                  return (
                    <a
                      key={profile.name}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full glass border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      aria-label={profile.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              <button
                onClick={() => scrollTo("#contact")}
                className="w-full py-2.5 px-4 bg-[#5C5470] text-white rounded-full font-medium text-sm text-center"
              >
                Hire Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}