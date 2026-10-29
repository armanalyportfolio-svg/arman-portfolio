"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { formatPhone, whatsappUrl } from "@/lib/content/merge";

export default function WhatsAppButton() {
  const { general, contact } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(contact.whatsappMessage);
  const phone = formatPhone(contact.whatsappNumber);
  const initials = general.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  if (!contact.whatsappNumber) return null;

  const handleSendMessage = () => {
    window.open(whatsappUrl(contact.whatsappNumber, customMsg), "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="mb-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl glass-dark border border-[var(--border-subtle)] shadow-2xl overflow-hidden bg-[var(--bg-surface)]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
                      {initials}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-1.5">
                      {general.name}
                      <Sparkles size={14} className="text-yellow-300" />
                    </h4>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
                      Online · Typically replies in minutes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Close WhatsApp chat popup"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-3 bg-[var(--bg-deep)]/40">
                <div className="bg-[var(--bg-surface)] p-3 rounded-xl rounded-tl-sm border border-[var(--border-subtle)] shadow-sm max-w-[85%]">
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {contact.whatsappGreeting}
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    {phone}
                  </span>
                </div>

                {/* Input area */}
                <div className="mt-2">
                  <textarea
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 cursor-pointer"
                  >
                    <Send size={14} />
                    Open in WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative group w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 border-2 border-emerald-400/40 transition-colors cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          {/* Subtle Radar Pulse Effect */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
                <X size={26} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                {/* Authentic WhatsApp SVG */}
                <svg
                  className="w-7 h-7 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip on hover */}
          {!isOpen && (
            <span className="absolute right-16 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)]">
              Chat on WhatsApp ({phone})
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
