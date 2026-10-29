"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Stat } from "@/lib/content/types";
import { useSocialProfiles, WhatsAppIcon } from "./SocialIcons";

/* -------------------------------------------------------------------------- */
/* Mini graphs used inside the stat cards                                      */
/* -------------------------------------------------------------------------- */

const BAR_COUNT = 7;

// Bars that reshuffle their heights every couple of seconds
function ShuffleBars({ small }: { small?: boolean }) {
  const reduce = useReducedMotion();
  const [heights, setHeights] = useState([40, 70, 55, 90, 65, 80, 50]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setHeights(Array.from({ length: BAR_COUNT }, () => 25 + Math.round(Math.random() * 75)));
    }, 1800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className={`flex items-end ${small ? "gap-0.5 h-7" : "gap-1 h-10"}`}>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className={`${small ? "w-1" : "w-1.5"} rounded-full bg-gradient-to-t from-[#5C5470] to-[#9F97AD]`}
          animate={{ height: `${h}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
      ))}
    </div>
  );
}

// Circular progress ring, filled to `percent`
function ProgressRing({ percent, small }: { percent: number; small?: boolean }) {
  // Unique id: the same card renders twice (desktop + mobile, one hidden),
  // and a gradient inside a hidden SVG can't be referenced by the visible one.
  const gradientId = `hero-ring-${useId().replace(/:/g, "")}`;
  const r = 17;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <svg viewBox="0 0 44 44" className={`${small ? "w-8 h-8" : "w-11 h-11"} -rotate-90`}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border-subtle)" strokeWidth="5" />
      <motion.circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
        transition={{ duration: 1.6, delay: 0.9, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5C5470" />
          <stop offset="100%" stopColor="#9F97AD" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Line chart that keeps redrawing itself
function Sparkline({ small }: { small?: boolean }) {
  const reduce = useReducedMotion();
  const d = "M2 30 L14 24 L24 27 L36 14 L48 18 L60 8 L72 12 L82 4";
  return (
    <svg viewBox="0 0 84 34" className={`${small ? "w-12 h-6" : "w-20 h-9"} overflow-visible`}>
      <path d={d} fill="none" stroke="var(--border-subtle)" strokeWidth="2.5" strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke="#857B9C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 0.8 }
        }
      />
      <circle cx="82" cy="4" r="3.5" fill="#5C5470" />
    </svg>
  );
}

function StatGraph({ stat, index, small }: { stat: Stat; index: number; small?: boolean }) {
  if (index % 3 === 1) {
    return <ProgressRing small={small} percent={stat.suffix === "%" ? stat.value : Math.min(stat.value, 100)} />;
  }
  if (index % 3 === 2) return <Sparkline small={small} />;
  return <ShuffleBars small={small} />;
}

/* -------------------------------------------------------------------------- */
/* Stat cards                                                                  */
/* -------------------------------------------------------------------------- */

function StatCardBody({ stat, index, compact }: { stat: Stat; index: number; compact?: boolean }) {
  if (compact) {
    return (
      <div className="glass rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 shadow-[var(--card-shadow)] px-3 py-2.5 h-full">
        <div className="flex items-end justify-between gap-2">
          <span className="font-display text-lg font-black text-[var(--text-main)] leading-none">
            {stat.value}
            {stat.suffix}
          </span>
          <StatGraph stat={stat} index={index} small />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight mt-1.5 text-left">
          {stat.label}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 shadow-[var(--card-shadow)] flex items-center justify-between gap-3 px-4 py-3.5 w-60">
      <div className="min-w-0">
        <div className="font-display text-2xl font-black text-[var(--text-main)] leading-none">
          {stat.value}
          {stat.suffix}
        </div>
        <div className="text-[11px] text-[var(--text-main)] font-semibold mt-1 truncate">{stat.label}</div>
        <div className="text-[9px] text-[var(--text-muted)] font-mono truncate">{stat.detail}</div>
      </div>
      <div className="shrink-0">
        <StatGraph stat={stat} index={index} />
      </div>
    </div>
  );
}

// Desktop: zig-zag cards on the right that float and can be dragged around
const FLOAT_LAYOUT = [
  { className: "right-8 xl:right-14 top-[20%]", rotate: 3, duration: 5.5 },
  { className: "right-40 xl:right-52 top-[44%]", rotate: -3, duration: 6.5 },
  { className: "right-6 xl:right-12 top-[66%]", rotate: 2, duration: 6 },
];

export function FloatingStats({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion();
  return (
    <>
      {stats.slice(0, FLOAT_LAYOUT.length).map((stat, i) => {
        const layout = FLOAT_LAYOUT[i];
        return (
          <motion.div
            key={i}
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            whileDrag={{ scale: 1.06, rotate: 0, zIndex: 50 }}
            initial={{ opacity: 0, scale: 0.85, rotate: layout.rotate }}
            animate={{ opacity: 1, scale: 1, rotate: layout.rotate }}
            transition={{ delay: 0.7 + i * 0.15, duration: 0.6 }}
            className={`absolute ${layout.className} z-30 hidden lg:block cursor-grab active:cursor-grabbing touch-none`}
            title="Drag me"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: layout.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            >
              <StatCardBody stat={stat} index={i} />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}

// Mobile / tablet: compact cards in a row under the buttons
export function InlineStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full lg:hidden">
      {stats.slice(0, 3).map((stat, i) => (
        <StatCardBody key={i} stat={stat} index={i} compact />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Call-to-action capsule                                                      */
/* -------------------------------------------------------------------------- */

export function CtaCapsule({
  onExplore,
  onContact,
  whatsappHref,
}: {
  onExplore: () => void;
  onContact: () => void;
  whatsappHref?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1.5 rounded-full glass border border-[var(--border-subtle)] shadow-[var(--card-shadow)]">
      <motion.button
        onClick={onExplore}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group flex items-center gap-3 pl-5 pr-1.5 py-1.5 rounded-full bg-[var(--text-main)] text-[var(--bg-deep)] font-bold text-sm cursor-pointer"
      >
        <span>Explore Works</span>
        <span className="w-8 h-8 rounded-full bg-[var(--bg-deep)] text-[var(--text-main)] flex items-center justify-center transition-transform duration-300 group-hover:-rotate-45">
          <ArrowRight size={15} />
        </span>
      </motion.button>

      <button
        onClick={onContact}
        className="relative px-4 py-2 text-sm font-semibold text-[var(--text-main)] cursor-pointer after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-current after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform"
      >
        Let&apos;s Talk
      </button>

      {whatsappHref && (
        <motion.a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 8 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Chat on WhatsApp"
          className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
        </motion.a>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Social dock: icons in one rounded container, bobbing in a wave              */
/* -------------------------------------------------------------------------- */

export function SocialDock() {
  const profiles = useSocialProfiles();
  const reduce = useReducedMotion();
  if (profiles.length === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full glass border border-[var(--border-subtle)] shadow-[var(--card-shadow)]">
      <span className="pl-3 pr-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
        Follow
      </span>
      {profiles.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.a
            key={`${p.name}-${i}`}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.name}
            title={`${p.name} (${p.handle})`}
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
            whileHover={{ scale: 1.15 }}
            className={`w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] transition-colors ${p.accent}`}
          >
            <Icon className="w-4 h-4" />
          </motion.a>
        );
      })}
    </div>
  );
}
