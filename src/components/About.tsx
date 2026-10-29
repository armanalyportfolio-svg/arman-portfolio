"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import Image from "next/image";
import { canOptimize } from "@/lib/content/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { GlitchHeading, SymbioteBlob } from "./Symbiote";

// Renders **bold** segments typed in the admin panel as highlighted text.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[var(--text-main)] font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function About() {
  const { general, about } = useSiteContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-20 md:py-28 bg-[var(--bg-deep)] relative overflow-hidden">
      <SymbioteBlob className="absolute -top-16 -right-28 w-[420px] opacity-60 z-0" />
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,#352F44_0%,transparent_70%)] opacity-25 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,#5C5470_0%,transparent_70%)] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-[var(--text-muted)] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            {about.eyebrow}
          </p>
          <GlitchHeading className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">{about.heading}</GlitchHeading>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base">
            {about.subheading}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column — Image & Metrics (5 Cols) */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Profile Portrait Card */}
            <motion.div variants={itemVariants} className="relative group">
              <div
                className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#352F44]/60 to-[#2A2438] border border-[var(--border-subtle)] transition-all duration-500 group-hover:border-[#5C5470]/60"
                style={{
                  aspectRatio: "4/5",
                  boxShadow: "0 20px 50px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(92, 84, 112, 0.15)",
                }}
              >
                {/* Active Availability Badge (Clean Dot, No Emoji) */}
                {general.availableForWork && (
                <div className="absolute top-4 left-4 z-20 glass px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] flex items-center gap-2 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-[var(--text-main)]">
                    {general.availabilityText}
                  </span>
                </div>
                )}

                {/* Base Portrait Image */}
                {about.image && (
                <Image
                  src={about.image}
                  unoptimized={!canOptimize(about.image)}
                  alt={`${general.name} – ${general.role}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-top filter contrast-[1.03] transition-transform duration-700 group-hover:scale-[1.02]"
                />
                )}

                {/* Subtle gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent opacity-85" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 inset-x-5 z-20 glass p-4 rounded-2xl border border-[var(--border-subtle)] backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-base font-bold text-[var(--text-main)]">
                        {general.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {about.cardSubtitle}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#fff] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {about.cardBadge}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative background framing accent */}
              <div className="absolute -inset-3 rounded-3xl border border-[#5C5470]/20 pointer-events-none -z-10" />
            </motion.div>

            {/* Stats Grid (2x2) */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {about.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl p-4 md:p-5 text-center bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] shadow-md hover:border-[#5C5470]/50 transition-all duration-300"
                >
                  <div className="font-display text-2xl md:text-3xl font-black text-[var(--text-main)] mb-1 tracking-tight">
                    {isInView ? (
                      <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                    ) : (
                      "0" + stat.suffix
                    )}
                  </div>
                  <div className="text-[var(--text-main)] text-xs font-semibold mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[var(--text-muted)] text-[10px] hidden sm:block">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column — Narrative, Highlights & Skills (7 Cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Bio Story */}
            <motion.div variants={itemVariants}>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-5">
                Hi, I&apos;m <span className="gradient-text">{general.name}</span>
              </h3>
              <div className="space-y-4 text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
                {about.bio.map((paragraph, i) => (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Key Information Badges (Clean, Minimalist, No Emojis) */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
              {about.highlights.map((item) => (
                <div
                  key={item}
                  className="glass px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] border border-[var(--border-subtle)] flex items-center gap-2 hover:border-[#5C5470] transition-colors"
                >
                  <CheckCircle2 size={13} className="text-[#9F97AD] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Technical Skills & Proficiency */}
            <motion.div ref={skillsRef} variants={itemVariants} className="pt-2">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-display text-lg font-semibold text-[var(--text-main)]">
                  {about.skillsHeading}
                </h4>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Industry Standards
                </span>
              </div>

              <div className="space-y-4">
                {about.skills.map((skill, i) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[var(--text-main)] text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">
                          {skill.tag}
                        </span>
                      </div>
                      <span className="text-[var(--text-muted)] text-xs font-mono font-medium group-hover:text-[var(--text-main)] transition-colors">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-subtle)] p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={skillsInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                          duration: 1.1,
                          delay: i * 0.08,
                          ease: [0.25, 0.46, 0.45, 0.94] as const,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-[#5C5470] via-[#857B9C] to-[#DBD8E3]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-3">
              <motion.a
                href="#resume"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] text-xs md:text-sm font-bold shadow-lg hover:shadow-[0_0_25px_rgba(219,216,227,0.3)] transition-all cursor-pointer"
              >
                <span>View Full Resume</span>
                <ArrowRight size={15} />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 glass border border-[var(--border-subtle)] rounded-full text-[var(--text-main)] text-xs md:text-sm font-medium hover:border-[#5C5470] hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
              >
                <span>Get in Touch</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}