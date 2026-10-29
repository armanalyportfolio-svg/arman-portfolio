"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { GlitchHeading, SymbioteDivider } from "./Symbiote";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default function Testimonials() {
  const { testimonials: section } = useSiteContent();
  const testimonials = section.items;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80 }),
  };

  if (testimonials.length === 0) return null;
  const t = testimonials[current % testimonials.length];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[var(--bg-deep)] relative overflow-hidden">
      <SymbioteDivider from="surface" />
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#352F44] opacity-25 blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[var(--text-muted)] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            {section.eyebrow}
          </p>
          <GlitchHeading className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">{section.heading}</GlitchHeading>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="glass rounded-3xl p-6 sm:p-8 md:p-12 relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl"
            >
              {/* Quote icon */}
              <Quote
                size={40}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#5C5470] opacity-20"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: Math.max(0, Math.min(5, t.rating)) }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-[var(--text-main)] text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#5C5470] flex items-center justify-center text-white font-bold font-display shadow-md text-sm sm:text-base shrink-0">
                  {initials(t.name)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-main)] text-sm sm:text-base">{t.name}</p>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-[var(--text-main)] hover:bg-[#5C5470] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === current
                      ? "w-8 h-2 bg-[#5C5470]"
                      : "w-2 h-2 bg-[#5C5470]/40 hover:bg-[#5C5470]"
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-[var(--text-main)] hover:bg-[#5C5470] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
