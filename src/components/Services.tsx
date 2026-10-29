"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "./SiteContentProvider";
import { getServiceIcon } from "@/lib/content/service-icons";
import { GlitchHeading, SymbioteDivider } from "./Symbiote";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Services() {
  const { services } = useSiteContent();

  return (
    <section id="services" className="py-20 md:py-28 bg-[var(--bg-surface)] relative overflow-hidden">
      <SymbioteDivider from="deep" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,#2A2438_0%,transparent_70%)] opacity-30" />
      <div className="absolute top-20 right-10 w-60 h-60 rounded-full bg-[radial-gradient(circle,#5C5470_0%,transparent_70%)] opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-[var(--text-muted)] text-xs tracking-[0.3em] uppercase font-medium mb-3">
            {services.eyebrow}
          </p>
          <GlitchHeading className="font-display text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">{services.heading}</GlitchHeading>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto text-sm md:text-base">
            {services.subheading}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {services.items.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-dark rounded-2xl p-6 flex flex-col gap-4 cursor-default border border-[var(--border-subtle)] hover:border-[#5C5470] transition-all duration-300 bg-[var(--bg-deep)]/40 shadow-sm"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-main)] group-hover:bg-[#5C5470] group-hover:text-white transition-colors duration-300">
                <Icon size={28} />
              </div>

              <h3 className="font-display text-base font-semibold text-[var(--text-main)] leading-snug">
                {service.title}
              </h3>

              <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text-main)] group-hover:border-[#5C5470] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
