"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function Resume() {
  const { resume } = useSiteContent();

  return (
    <section id="resume" className="py-20 md:py-28 bg-[var(--bg-surface)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#2A2438] opacity-30 blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[var(--text-muted)] text-sm tracking-[0.3em] uppercase font-medium mb-3">
            {resume.eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">
            {resume.heading}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-10 rounded-xl bg-[#5C5470]/30 flex items-center justify-center">
                <Briefcase size={20} className="text-[var(--text-main)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--text-main)]">Experience</h3>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 sm:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#5C5470] via-[#5C5470]/50 to-transparent" />

              <div className="space-y-8">
                {resume.experience.map((item, i) => (
                  <motion.div
                    key={`${item.company}-${i}`}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-9 sm:pl-14"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-2 sm:left-3.5 top-1.5 w-3 h-3 rounded-full bg-[#5C5470] border-2 border-[var(--text-main)] shadow-[0_0_10px_rgba(92,84,112,0.6)]" />

                    <div className="glass-dark rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] hover:border-[#5C5470]/50 transition-colors bg-[var(--bg-deep)]/40">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 mb-2">
                        <div>
                          <h4 className="font-display font-semibold text-[var(--text-main)] text-sm sm:text-base">{item.title}</h4>
                          <p className="text-[var(--text-muted)] text-xs sm:text-sm">{item.company}</p>
                        </div>
                        <span className="self-start sm:self-auto shrink-0 text-[11px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#5C5470]/20 text-[var(--text-muted)] border border-[var(--border-subtle)] font-mono">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-10 rounded-xl bg-[#5C5470]/30 flex items-center justify-center">
                <GraduationCap size={20} className="text-[var(--text-main)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--text-main)]">Education</h3>
            </motion.div>

            <div className="relative">
              <div className="absolute left-3.5 sm:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#5C5470] via-[#5C5470]/50 to-transparent" />

              <div className="space-y-8">
                {resume.education.map((item, i) => (
                  <motion.div
                    key={`${item.institution}-${i}`}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-9 sm:pl-14"
                  >
                    <div className="absolute left-2 sm:left-3.5 top-1.5 w-3 h-3 rounded-full bg-[#5C5470] border-2 border-[var(--text-main)] shadow-[0_0_10px_rgba(92,84,112,0.6)]" />

                    <div className="glass-dark rounded-2xl p-4 sm:p-5 border border-[var(--border-subtle)] hover:border-[#5C5470]/50 transition-colors bg-[var(--bg-deep)]/40">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 mb-1">
                        <h4 className="font-display font-semibold text-[var(--text-main)] text-sm leading-snug">
                          {item.title}
                        </h4>
                        {item.grade && (
                          <div className="flex items-center gap-1 self-start sm:self-auto shrink-0 px-2 py-0.5 rounded-md bg-[#5C5470]/20 border border-[var(--border-subtle)]">
                            <Award size={12} className="text-[var(--text-main)]" />
                            <span className="text-[11px] font-bold text-[var(--text-main)]">{item.grade}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[var(--text-muted)] text-xs mb-1 font-medium">{item.institution}</p>
                      <p className="text-[var(--text-muted)]/70 text-[11px] font-mono mb-2">{item.period}</p>
                      <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Download CTA */}
            {resume.cvUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 pl-9 sm:pl-14"
            >
              <motion.a
                href={resume.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(92,84,112,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#5C5470] text-white rounded-full font-medium hover:bg-[var(--bg-deep)] hover:text-[var(--text-main)] transition-colors border border-[#5C5470] cursor-pointer"
              >
                &nbsp;Download Full Resume
              </motion.a>
            </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
