"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { canOptimize } from "@/lib/content/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CtaCapsule, FloatingStats, InlineStats, SocialDock } from "./HeroWidgets";
import { useSiteContent } from "./SiteContentProvider";
import { whatsappUrl } from "@/lib/content/merge";

const PARTICLES_COUNT = 40;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const COLORS = ["#DBD8E3", "#5C5470", "#352F44"];

// Glitch timing (ms): keep GLITCH_DURATION in sync with the CSS animations in globals.css
const GLITCH_DURATION = 750;
const GLITCH_MIN_GAP = 2500;
const GLITCH_RANDOM_GAP = 3000;

export default function Hero() {
  const { general, hero, about, contact } = useSiteContent();
  const roles = useMemo(
    () => (hero.roles.length ? hero.roles : [general.role]),
    [hero.roles, general.role]
  );
  const heroStats = about.stats.slice(0, 3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  const [displayText, setDisplayText] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter animation
  useEffect(() => {
    const currentRole = roles[typeIndex % roles.length];
    const speed = isDeleting ? 35 : 80;

    // Pause on the fully typed word before deleting it
    const fullyTyped = !isDeleting && displayText.length === currentRole.length;
    const timer = setTimeout(() => {
      if (fullyTyped) {
        setIsDeleting(true);
      } else if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTypeIndex((i) => i + 1);
        }
      }
    }, fullyTyped ? 2400 : speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typeIndex, roles]);

  // Glitch blink: every few seconds the portrait glitches into the reveal image.
  // Toggles a class on the stage so no React re-render is needed.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !hero.revealImage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        stage.classList.add("is-glitching");
        timer = setTimeout(() => {
          stage.classList.remove("is-glitching");
          schedule();
        }, GLITCH_DURATION);
      }, GLITCH_MIN_GAP + Math.random() * GLITCH_RANDOM_GAP);
    };
    schedule();

    return () => {
      clearTimeout(timer);
      stage.classList.remove("is-glitching");
    };
  }, [hero.revealImage, hero.showVisual]);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: PARTICLES_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.35 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let pAnimId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(92, 84, 112, ${0.12 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      pAnimId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(pAnimId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const { showVisual, showContent } = hero;
  if (!showVisual && !showContent) return null;
  // Image alone on a phone: show it twice as wide (sides cropped) instead of a tiny strip
  const mobileWide = showContent ? "" : " max-sm:w-[200%] max-sm:max-w-none";

  return (
    <section
      id="home"
      className="relative w-full min-h-[100svh] md:min-h-[100svh] flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden bg-[var(--bg-deep)] pb-12 md:pb-0"
    >
      {/* Particle background canvas */}
      <canvas ref={canvasRef} id="particle-canvas" className="pointer-events-none absolute inset-0 z-0" />

      {/* Atmospheric ambient lighting backdrops */}
      <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[radial-gradient(circle,#352F44_0%,transparent_70%)] opacity-35 pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[radial-gradient(circle,#5C5470_0%,transparent_70%)] opacity-30 pointer-events-none" />

      {/* Watermark Typographic Branding */}
      {showVisual && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-display font-black text-[15vw] md:text-[14vw] uppercase tracking-tighter text-[var(--text-main)]/[0.03] leading-none whitespace-nowrap">
          {general.name.toUpperCase()}
        </span>
      </div>
      )}

      {/* =========================================================================
          HERO CONTENT — next to the image: mobile centred, desktop absolute left.
          Without the image: centred at every size.
          ========================================================================= */}
      {showContent && (
      <div
        className={
          showVisual
            ? `relative md:absolute md:left-8 lg:left-14 xl:left-24 md:top-28 z-30 w-full md:max-w-md lg:max-w-xl pointer-events-none
        flex flex-col items-center text-center md:items-start md:text-left
        min-h-[100svh] md:min-h-0 justify-center md:justify-start
        px-6 sm:px-10 md:px-0 pt-20 pb-10 md:pt-0 md:pb-0`
            : `relative z-30 w-full max-w-xl mx-auto pointer-events-none
        flex flex-col items-center text-center min-h-[100svh] justify-center
        px-6 sm:px-10 pt-24 pb-16`
        }
      >

        {/* Live Availability Status Pill */}
        {general.availableForWork && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] mb-4 pointer-events-auto shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[var(--text-main)]">
            {general.availabilityText} · {general.location}
          </span>
        </motion.div>
        )}

        {/* Main Name Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-2 text-[var(--text-main)] leading-tight"
        >
          <span>I&apos;m </span>
          <span className="gradient-text">{general.name}</span>
        </motion.h1>

        {/* Dynamic Typewriter Role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-8 sm:h-9 flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-lg sm:text-2xl font-display text-[var(--text-main)] mb-4 drop-shadow-md w-full"
        >
          <span className="text-[#857B9C] font-mono text-base sm:text-xl font-bold">&lt;</span>
          <span className="font-bold text-[var(--text-main)] tracking-wide truncate">{displayText}</span>
          <span className="w-0.5 h-5 sm:h-6 bg-[var(--text-main)] animate-pulse shrink-0" />
          <span className="text-[#857B9C] font-mono text-base sm:text-xl font-bold">&gt;</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[var(--text-muted)] text-sm sm:text-sm md:text-base leading-relaxed max-w-sm md:max-w-md mb-5 font-normal"
        >
          {hero.tagline}
        </motion.p>

        {/* Key Expertise Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 pointer-events-auto"
        >
          {hero.keySkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] sm:text-[11px] font-mono font-medium shadow-sm"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        {/* Call-to-action capsule */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="pointer-events-auto mb-5"
        >
          <CtaCapsule
            onExplore={scrollToPortfolio}
            onContact={scrollToContact}
            whatsappHref={
              contact.whatsappNumber ? whatsappUrl(contact.whatsappNumber, contact.whatsappMessage) : undefined
            }
          />
        </motion.div>

        {/* Compact stat cards — mobile / tablet (lg+ uses the floating cards) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="pointer-events-auto mb-5 w-full max-w-md"
        >
          <InlineStats stats={heroStats} />
        </motion.div>

        {/* Social profiles dock */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="pointer-events-auto"
        >
          <SocialDock />
        </motion.div>
      </div>
      )}

      {/* =========================================================================
          RIGHT FLOATING STAT CARDS — mini graphs, float and can be dragged
          ========================================================================= */}
      {showContent && <FloatingStats stats={heroStats} />}

      {/* =========================================================================
          IMAGE STAGE: AUTOMATIC GLITCH BLINK
          ========================================================================= */}
      {showVisual && (
      <div
        ref={stageRef}
        className={`glitch-stage relative w-full items-end justify-center select-none z-10 ${
          showContent ? "h-[65vh] sm:h-[68vh] md:h-screen hidden md:flex" : "h-[100svh] md:h-screen flex"
        }`}
      >
        {/* Mobile: subtle radial glow behind character */}
        <div className="absolute inset-0 pointer-events-none md:hidden z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(92,84,112,0.2)_0%,transparent_70%)]" />
        </div>

        {/* 1. Base portrait image */}
        <div className="glitch-base absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-10">
          <div className={`relative w-full sm:w-[88%] md:w-[90%] h-[100%] sm:h-[92%] max-w-[1550px] shrink-0${mobileWide}`}>
            {hero.portraitImage && (
            <Image
              src={hero.portraitImage}
              unoptimized={!canOptimize(hero.portraitImage)}
              alt={`${general.name} - ${general.role}`}
              fill
              priority
              className="object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1550px"
            />
            )}
          </div>
        </div>

        {/* 2. Reveal image — flashes in during the glitch, with RGB-split ghosts */}
        {hero.revealImage &&
          (["glitch-main", "glitch-red", "glitch-cyan"] as const).map((layer) => (
            <div
              key={layer}
              aria-hidden={layer !== "glitch-main"}
              className={`glitch-layer ${layer} absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-20`}
            >
              <div className={`relative w-full sm:w-[88%] md:w-[90%] h-[100%] sm:h-[92%] max-w-[1550px] shrink-0${mobileWide}`}>
                <Image
                  src={hero.revealImage}
                  unoptimized={!canOptimize(hero.revealImage)}
                  alt={layer === "glitch-main" ? `${general.name} - Alternate Portrait` : ""}
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1550px"
                />
              </div>
            </div>
          ))}

        {/* Scanlines shown only while glitching */}
        <div className="glitch-scanlines absolute inset-0 pointer-events-none z-30" />

        {/* Mobile: bottom fade blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--bg-deep)] to-transparent pointer-events-none z-25 md:hidden" />

      </div>
      )}

      {/* Bottom Center Animated Scroll Indicator */}
      <motion.button
        onClick={scrollToAbout}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer pointer-events-auto"
        aria-label="Scroll to About Section"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest">Scroll</span>
        <ChevronDown size={15} />
      </motion.button>
    </section>
  );
}
