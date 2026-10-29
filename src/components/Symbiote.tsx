"use client";

import { useEffect, useId, useRef } from "react";
import { useInView } from "framer-motion";

// Venom-style decorative pieces shared across sections, so the rest of the
// site matches the glitching hero. Styles live in globals.css ("Symbiote").

/* -------------------------------------------------------------------------- */
/* GlitchHeading: glitches once when scrolled into view, and on hover          */
/* -------------------------------------------------------------------------- */

export function GlitchHeading({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-glitching");
    const timer = setTimeout(() => el.classList.remove("is-glitching"), 700);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <h2 ref={ref} data-text={children} className={`glitch-text ${className}`}>
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/* SymbioteDivider: the previous section's colour drips over the section top  */
/* -------------------------------------------------------------------------- */

// [x position, half width, length] in a 1440×90 viewBox
const DRIPS: [number, number, number][] = [
  [90, 22, 30],
  [260, 34, 58],
  [430, 18, 24],
  [610, 28, 46],
  [800, 40, 70],
  [985, 20, 32],
  [1150, 30, 52],
  [1330, 24, 38],
];
const BASE = 14;

function dripPath() {
  let d = `M0,0 V${BASE}`;
  for (const [x, w, len] of DRIPS) {
    const neck = w * 0.42;
    const r = w * 0.5;
    const bulbY = BASE + len - r;
    d += ` L${x - w},${BASE}`;
    d += ` C${x - w * 0.35},${BASE} ${x - neck},${bulbY - len * 0.35} ${x - neck},${bulbY}`;
    d += ` A${r} ${r} 0 1 0 ${x + neck},${bulbY}`;
    d += ` C${x + neck},${bulbY - len * 0.35} ${x + w * 0.35},${BASE} ${x + w},${BASE}`;
  }
  return `${d} L1440,${BASE} V0 Z`;
}

const DRIP_PATH = dripPath();

// Drips that release a falling droplet: [x, length, delay in s]
const DROPS: [number, number, number][] = [
  [260, 58, 0],
  [800, 70, 2.2],
  [1150, 52, 4.1],
];

export function SymbioteDivider({ from }: { from: "deep" | "surface" }) {
  const fill = from === "deep" ? "var(--bg-deep)" : "var(--bg-surface)";
  return (
    <svg
      aria-hidden="true"
      className="symbiote-divider absolute top-0 inset-x-0 w-full h-12 md:h-[90px] pointer-events-none z-[1]"
      viewBox="0 0 1440 90"
      preserveAspectRatio="xMidYMin slice"
    >
      <path d={DRIP_PATH} fill={fill} />
      {DROPS.map(([x, len, delay]) => (
        <circle
          key={x}
          className="symbiote-drop"
          cx={x}
          cy={BASE + len}
          r={5}
          fill={fill}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* SymbioteBlob: gooey black blobs that slowly merge and split                 */
/* -------------------------------------------------------------------------- */

export function SymbioteBlob({ className = "" }: { className?: string }) {
  const filterId = `goo-${useId().replace(/:/g, "")}`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={`symbiote-blob pointer-events-none ${className}`}
    >
      <defs>
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} fill="var(--symbiote)">
        <circle className="blob-a" cx="200" cy="200" r="80" />
        <circle className="blob-b" cx="150" cy="170" r="55" />
        <circle className="blob-c" cx="255" cy="235" r="48" />
        <circle className="blob-d" cx="215" cy="125" r="34" />
      </g>
    </svg>
  );
}
