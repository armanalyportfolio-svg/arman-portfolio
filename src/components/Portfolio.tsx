"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { canOptimize } from "@/lib/content/image";
import {
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  Columns3,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import type { PortfolioItem } from "@/lib/content/types";
import { GlitchHeading, SymbioteDivider } from "./Symbiote";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export default function Portfolio() {
  const { portfolio } = useSiteContent();
  const portfolioItems = portfolio.items;
  const categories = useMemo(
    () => [{ id: "all", label: "All Work" }, ...portfolio.categories],
    [portfolio.categories]
  );
  const categoryLabel = (id: string) =>
    portfolio.categories.find((c) => c.id === id)?.label ?? id.replace(/-/g, " ");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [layoutMode, setLayoutMode] = useState<"bento" | "grid">("bento");

  // Filter items based on active category
  const filtered = useMemo(() => {
    return activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, portfolioItems]);

  // Compute item count per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: portfolioItems.length };
    portfolioItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [portfolioItems]);

  // Modal navigation index
  const currentIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filtered.findIndex((it) => it.id === selectedItem.id);
  }, [selectedItem, filtered]);

  const openLightbox = useCallback((item: PortfolioItem) => {
    setSelectedItem(item);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedItem(null);
    document.body.style.overflow = "";
  }, []);

  const nextItem = useCallback(() => {
    if (currentIndex === -1 || filtered.length === 0) return;
    const nextIdx = (currentIndex + 1) % filtered.length;
    setSelectedItem(filtered[nextIdx]);
  }, [currentIndex, filtered]);

  const prevItem = useCallback(() => {
    if (currentIndex === -1 || filtered.length === 0) return;
    const prevIdx = (currentIndex - 1 + filtered.length) % filtered.length;
    setSelectedItem(filtered[prevIdx]);
  }, [currentIndex, filtered]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, closeLightbox, nextItem, prevItem]);

  return (
    <section id="portfolio" className="py-28 bg-[var(--bg-deep)] relative overflow-hidden">
      <SymbioteDivider from="surface" />
      {/* Animated Floating Ambient Background Mesh */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 50, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-20 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,#352F44_0%,transparent_70%)] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.12, 0.25, 0.12],
          y: [0, -60, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,#5C5470_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-[var(--border-subtle)] mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
            <Sparkles size={13} className="text-[#DBD8E3]" />
            <span>{portfolio.eyebrow}</span>
          </div>

          <GlitchHeading className="font-display text-4xl md:text-5xl font-black gradient-text mb-4 tracking-tight">{portfolio.heading}</GlitchHeading>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {portfolio.subheading}
          </p>
        </motion.div>

        {/* Animated Infinite Marquee Banner */}
        {portfolio.marquee.length > 0 && (
        <div className="relative w-full overflow-hidden mb-12 py-3 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 backdrop-blur-sm">
          <motion.div
            className="flex gap-8 whitespace-nowrap will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
          >
            {[...portfolio.marquee, ...portfolio.marquee].map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]"
              >
                <span>{skill}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C5470]" />
              </div>
            ))}
          </motion.div>
        </div>
        )}

        {/* Filter Controls & Layout Mode Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-14">
          {/* Category Filter Tabs with Sliding Animated Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center items-center gap-2"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {/* Framer Motion LayoutId Sliding Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#5C5470] to-[#352F44] rounded-full border border-[#DBD8E3]/30 shadow-[0_0_20px_rgba(92,84,112,0.45)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10">{cat.label}</span>
                  <span
                    className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Grid Layout Switcher (Bento vs Uniform Grid) */}
          <div className="flex items-center gap-1.5 glass p-1.5 rounded-full border border-[var(--border-subtle)] self-center md:self-auto shrink-0">
            <button
              onClick={() => setLayoutMode("bento")}
              aria-label="Bento Showcase View"
              title="Bento Editorial Layout"
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === "bento"
                  ? "bg-[#5C5470] text-white shadow-md font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Bento View</span>
            </button>
            <button
              onClick={() => setLayoutMode("grid")}
              aria-label="Equal Grid View"
              title="Equal Grid Layout"
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === "grid"
                  ? "bg-[#5C5470] text-white shadow-md font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              <Columns3 size={14} />
              <span className="hidden sm:inline">Grid View</span>
            </button>
          </div>
        </div>

        {/* Modern Bento & Dynamic Grid Layout */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${activeCategory}-${layoutMode}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              layoutMode === "bento" && activeCategory === "all"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            }
          >
            {filtered.map((item) => {
              // In Bento mode (when all are displayed), spotlight specific featured items to span 2 columns
              const isSpotlight =
                layoutMode === "bento" &&
                activeCategory === "all" &&
                item.spotlight;

              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  layout
                  onClick={() => openLightbox(item)}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-[#1D1826] border border-[#5C5470]/40 hover:border-[#DBD8E3]/70 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(92,84,112,0.4)] flex flex-col justify-end ${
                    isSpotlight
                      ? "md:col-span-2 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]"
                      : "col-span-1 aspect-[4/5]"
                  }`}
                >
                  {/* Project Showcase Image */}
                  <Image
                    src={item.image || "/images/creative-designer.png"}
                    unoptimized={!canOptimize(item.image || "/images/creative-designer.png")}
                    alt={item.title}
                    fill
                    sizes={
                      isSpotlight
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    className="portfolio-glitch object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Guaranteed High-Contrast Dark Gradient Backing (Ensures 100% Readability) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Header Floating Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                    {/* Category Pill with Solid Dark Backing */}
                    <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 shadow-md">
                      {categoryLabel(item.category)}
                    </div>

                    {/* Featured Star Badge */}
                    {item.featured && (
                      <div className="bg-amber-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase flex items-center gap-1.5 shadow-lg">
                        <Sparkles size={11} className="fill-black" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Center Opaque Expand Preview Button (High-Contrast, Visible Everywhere!) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 pointer-events-none z-30">
                    <div className="bg-[#120F18] text-white border-2 border-white/40 px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
                      <Eye size={16} className="text-[#DBD8E3]" />
                      <span className="text-xs font-bold tracking-wider uppercase text-white">
                        Expand Preview
                      </span>
                    </div>
                  </div>

                  {/* Bottom Information Card (High Contrast, Crisp & Fully Readable) */}
                  <div className="relative z-20 p-5 sm:p-6 bg-gradient-to-t from-black/90 to-transparent">
                    {/* Title */}
                    <h3
                      className={`font-display font-extrabold text-white mb-2 tracking-tight drop-shadow-md ${
                        isSpotlight ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Subtext / Description — Crisp & High Contrast */}
                    <p className="text-[#E6E4EE] text-xs sm:text-sm line-clamp-2 mb-3.5 leading-relaxed font-normal drop-shadow">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-black/60 text-[#DBD8E3] border border-white/20 shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal with Animated Carousel Controls */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
          >
            {/* Modal Wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-y-auto overflow-x-hidden bg-[#1D1826] border border-[#5C5470]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[#120F18]/95 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs text-[var(--text-muted)] font-bold">
                    {String(currentIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                  <div className="text-xs uppercase tracking-wider font-bold text-white">
                    {categoryLabel(selectedItem.category)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Item Button */}
                  <button
                    onClick={prevItem}
                    aria-label="Previous Project"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Next Item Button */}
                  <button
                    onClick={nextItem}
                    aria-label="Next Project"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Close Modal Button */}
                  <button
                    onClick={closeLightbox}
                    aria-label="Close"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer ml-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Main Image Display */}
              <div className="relative flex-1 min-h-[35vh] sm:min-h-[45vh] md:min-h-[58vh] bg-black/60 flex items-center justify-center p-3 sm:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full min-h-[32vh] sm:min-h-[42vh] md:min-h-[55vh]"
                  >
                    <Image
                      src={selectedItem.image || "/images/creative-designer.png"}
                      unoptimized={!canOptimize(selectedItem.image || "/images/creative-designer.png")}
                      alt={selectedItem.title}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 90vw, 850px"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal Bottom Metadata */}
              <div className="p-6 bg-[#16121E] border-t border-[var(--border-subtle)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1.5">
                      {selectedItem.title}
                    </h3>
                    <p className="text-[#E6E4EE] text-sm max-w-xl leading-relaxed">
                      {selectedItem.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full border border-white/20 text-[#DBD8E3] bg-black/40 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <a
                    href="#contact"
                    onClick={closeLightbox}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#DBD8E3] to-[#B0ABC0] text-[#1D1826] text-xs font-black shadow-lg hover:shadow-xl transition-all shrink-0 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Request Similar Project</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}