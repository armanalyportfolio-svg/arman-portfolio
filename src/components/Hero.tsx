"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { canOptimize } from "@/lib/content/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useSocialProfiles } from "./SocialIcons";
import { useSiteContent } from "./SiteContentProvider";
import { whatsappUrl } from "@/lib/content/merge";

const PARTICLES_COUNT = 40;
const REVEAL_RADIUS = 240;

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

export default function Hero() {
  const { general, hero, about, contact } = useSiteContent();
  const socialProfiles = useSocialProfiles();
  const roles = useMemo(
    () => (hero.roles.length ? hero.roles : [general.role]),
    [hero.roles, general.role]
  );
  const heroStats = about.stats.slice(0, 3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const venomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  // High-performance direct coordinates via requestAnimationFrame (Zero React re-render lag)
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const isInside = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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

  // Smooth 120fps Lerp animation loop for venom reveal mask and cursor reticle
  useEffect(() => {
    let animId: number;

    const updatePosition = () => {
      if (isInside.current) {
        const lerpFactor = 0.16;
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

        const x = Math.round(currentPos.current.x * 10) / 10;
        const y = Math.round(currentPos.current.y * 10) / 10;

        if (venomRef.current) {
          const mask = `radial-gradient(circle ${REVEAL_RADIUS}px at ${x}px ${y}px, black 0%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.3) 75%, transparent 100%)`;
          venomRef.current.style.maskImage = mask;
          venomRef.current.style.webkitMaskImage = mask;
        }

        if (glowRef.current) {
          glowRef.current.style.background = `radial-gradient(circle ${REVEAL_RADIUS + 70}px at ${x}px ${y}px, rgba(92, 84, 112, 0.45) 0%, rgba(53, 47, 68, 0.25) 50%, transparent 100%)`;
        }

        if (reticleRef.current) {
          reticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
      }
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, []);

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isInside.current) {
      isInside.current = true;
      currentPos.current = { x, y };
      if (!hasInteracted) setHasInteracted(true);
      if (venomRef.current) venomRef.current.style.opacity = "1";
      if (glowRef.current) glowRef.current.style.opacity = "1";
      if (reticleRef.current) reticleRef.current.style.opacity = "1";
    }

    targetPos.current = { x, y };
  };

  const handlePointerLeave = () => {
    isInside.current = false;
    if (venomRef.current) venomRef.current.style.opacity = "0";
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (reticleRef.current) reticleRef.current.style.opacity = "0";
  };

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[100svh] md:min-h-[100svh] flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden bg-[var(--bg-deep)] pb-12 md:pb-0"
    >
      {/* Particle background canvas */}
      <canvas ref={canvasRef} id="particle-canvas" className="pointer-events-none absolute inset-0 z-0" />

      {/* Atmospheric ambient lighting backdrops */}
      <div className="absolute top-1/4 -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[#352F44] opacity-35 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[#5C5470] opacity-30 blur-[160px] pointer-events-none" />

      {/* Watermark Typographic Branding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-display font-black text-[15vw] md:text-[14vw] uppercase tracking-tighter text-[var(--text-main)]/[0.03] leading-none whitespace-nowrap">
          {general.name.toUpperCase()}
        </span>
      </div>

      {/* =========================================================================
          LEFT HERO CONTENT — mobile: centered full-screen, desktop: absolute left
          ========================================================================= */}
      <div className="relative md:absolute md:left-8 lg:left-14 xl:left-24 md:top-28 z-30 w-full md:max-w-md lg:max-w-xl pointer-events-none
        flex flex-col items-center text-center md:items-start md:text-left
        min-h-[100svh] md:min-h-0 justify-center md:justify-start
        px-6 sm:px-10 md:px-0 pt-20 pb-10 md:pt-0 md:pb-0">

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

        {/* CTA Buttons — full width on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pointer-events-auto mb-6 w-full md:w-auto"
        >
          <motion.button
            onClick={scrollToPortfolio}
            whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(219,216,227,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer"
          >
            <span>Explore Works</span>
            <ArrowRight size={15} />
          </motion.button>

          <div className="flex gap-3 w-full sm:w-auto">
            <motion.a
              href={whatsappUrl(contact.whatsappNumber, contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 sm:flex-none px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-950/40 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </motion.a>

            <motion.button
              onClick={scrollToContact}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 sm:flex-none px-5 py-3.5 glass border border-[var(--border-subtle)] text-[var(--text-main)] rounded-2xl font-semibold text-sm tracking-wide hover:border-[#5C5470] transition-all duration-300 shadow-xl cursor-pointer"
            >
              Get In Touch
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Row — mobile only (lg+ uses floating cards on right) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex items-center gap-3 mb-6 pointer-events-auto lg:hidden w-full"
        >
          {heroStats.map((s, i) => (
            <div key={i} className="flex-1 glass rounded-2xl border border-[var(--border-subtle)] px-3 py-3 text-center">
              <div className="font-display text-xl font-black text-[var(--text-main)] leading-none">{s.value}{s.suffix}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Social Icons Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-3 pointer-events-auto"
        >
          <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
            Follow:
          </span>
          <div className="flex items-center gap-2">
            {socialProfiles.map((p) => {
              const Icon = p.icon;
              return (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  title={`${p.name} (${p.handle})`}
                  className={`w-9 h-9 glass rounded-full flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)] transition-all ${p.accent}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          RIGHT FLOATING STATS CARDS
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="absolute right-6 lg:right-12 xl:right-16 top-32 lg:top-36 z-30 hidden lg:flex flex-col gap-3 pointer-events-none text-right"
      >
        {heroStats.map((s, i) => (
          <div key={i} className="glass px-4 py-3 rounded-2xl border border-[var(--border-subtle)] backdrop-blur-md shadow-2xl bg-[var(--bg-surface)] text-right">
            <div className="font-display text-2xl font-black text-[var(--text-main)]">{s.value}{s.suffix}</div>
            <div className="text-[11px] text-[var(--text-main)] font-semibold">{s.label}</div>
            <div className="text-[9px] text-[var(--text-muted)] font-mono">{s.detail}</div>
          </div>
        ))}
      </motion.div>

      {/* =========================================================================
          IMAGE STAGE: INTERACTIVE HOVER VENOM REVEAL
          ========================================================================= */}
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-[65vh] sm:h-[68vh] md:h-screen hidden md:flex items-end justify-center select-none z-10"
      >
        {/* Mobile: subtle radial glow behind character */}
        <div className="absolute inset-0 pointer-events-none md:hidden z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[80%] rounded-full bg-[#5C5470]/20 blur-[80px]" />
        </div>

        {/* Cursor-Following Reticle (Sci-fi Targeting Lens) */}
        <div
          ref={reticleRef}
          className="absolute pointer-events-none z-30 w-12 h-12 rounded-full border-2 border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.7)] flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>

        {/* Ambient cursor-following glow effect */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-0"
        />

        {/* 1. Base portrait image */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-10">
          <div className="relative w-full sm:w-[88%] md:w-[90%] h-[100%] sm:h-[92%] max-w-[1550px]">
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

        {/* 2. Venom image — revealed via radial mask on hover */}
        {hero.revealImage && (
        <div
          ref={venomRef}
          style={{
            opacity: 0,
            transition: "opacity 0.35s ease-out",
          }}
          className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-20 will-change-[mask-image,opacity]"
        >
          <div className="relative w-full sm:w-[88%] md:w-[90%] h-[100%] sm:h-[92%] max-w-[1550px]">
            <Image
              src={hero.revealImage}
              unoptimized={!canOptimize(hero.revealImage)}
              alt={`${general.name} - Alternate Portrait`}
              fill
              className="object-contain object-bottom filter brightness-110 drop-shadow-[0_25px_60px_rgba(92,84,112,0.9)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1550px"
            />
          </div>
        </div>
        )}

        {/* Mobile: bottom fade blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--bg-deep)] to-transparent pointer-events-none z-25 md:hidden" />

        {/* Desktop Hover Hint */}
        {!hasInteracted && hero.revealImage && hero.revealHint && (
          <div className="absolute top-4 md:top-24 left-1/2 -translate-x-1/2 z-40 hidden lg:flex glass px-3.5 py-1.5 rounded-full text-xs text-[#DBD8E3] border border-[#5C5470]/40 items-center gap-2 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{hero.revealHint}</span>
          </div>
        )}
      </div>

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
