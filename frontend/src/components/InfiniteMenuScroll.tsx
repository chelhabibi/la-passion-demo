"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getCurrentSeason } from "@/lib/season";

interface MenuItem {
  id: number;
  name_vi: string; name_en: string;
  description_vi: string; description_en: string;
  price: number; category: string; image_url: string;
}

const GAP = 16;

function ScrollCard({
  item, locale, season, isGlobalDragging,
}: {
  item: MenuItem; locale: string; season: string; isGlobalDragging: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const name = locale === "vi" ? item.name_vi : item.name_en;
  const desc = locale === "vi" ? item.description_vi : item.description_en;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPar({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  return (
    <div
      data-card=""
      className="flex-shrink-0"
      style={{
        width: "calc(100% / 3.5 - 14px)",
        scrollSnapAlign: "center",
        transform: hovered ? "translateY(-14px)" : "translateY(0px)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(201,168,76,0.65), 0 28px 56px rgba(0,0,0,0.8), 0 0 36px rgba(201,168,76,0.2)"
          : "0 0 0 1px rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.4)",
        transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease",
      }}
      onMouseEnter={() => { if (!isGlobalDragging) setHovered(true); }}
      onMouseLeave={() => { setHovered(false); setPar({ x: 0, y: 0 }); }}
      onMouseMove={(e) => { if (!isGlobalDragging) onMove(e); }}
    >
      {/* Portrait image — frosted strip always visible at bottom */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Image
          src={item.image_url}
          alt={name}
          fill
          className="object-cover"
          draggable={false}
          style={{
            transform: hovered
              ? `scale(1.2) translate(${-par.x * 10}px, ${-par.y * 7}px)`
              : "scale(1)",
            filter: hovered
              ? "brightness(1.0) contrast(1.1) saturate(1.2) grayscale(0)"
              : "brightness(0.65) contrast(1.05) grayscale(0.25)",
            transition: hovered
              ? "transform 0.12s ease, filter 0.4s ease"
              : "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease",
          }}
        />
        {/* Subtle top vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 28%)" }} />

        {/* Category chip */}
        <div className="absolute top-4 left-4 z-10">
          <span className="section-label text-[8px] bg-black/55 backdrop-blur-sm px-2 py-1">
            {item.category}
          </span>
        </div>

        {/* Frosted glass info strip — always visible */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            background: hovered ? "rgba(9,18,35,0.92)" : "rgba(9,18,35,0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderTop: hovered ? "1px solid rgba(201,168,76,0.45)" : "1px solid rgba(255,255,255,0.07)",
            transition: "background 0.35s ease, border-color 0.35s ease",
            padding: "12px 14px 14px",
          }}
        >
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/65 text-[10px] font-light leading-relaxed italic overflow-hidden"
              >
                {desc}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm font-light leading-snug truncate transition-colors duration-300"
                style={{ color: hovered ? "#D4AF6A" : "#ffffff" }}>
                {name}
              </h3>
              <AnimatePresence>
                {hovered && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-white/35 text-[8px] tracking-widest uppercase mt-1 overflow-hidden"
                  >
                    {item.category} · {locale === "vi" ? `Mùa ${season}` : season}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="font-light text-xs transition-colors duration-300 shrink-0"
              style={{ color: hovered ? "#C9A84C" : "rgba(212,175,106,0.9)" }}>
              {Number(item.price).toLocaleString("vi-VN")}
              <span className="text-[9px] text-white/30 ml-0.5">đ</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfiniteMenuScroll({ items, locale }: { items: MenuItem[]; locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const hasDragged = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const season = getCurrentSeason(locale);

  const tripled = useMemo(() => [...items, ...items, ...items], [items]);

  // Init: scroll to middle set
  useEffect(() => {
    const el = containerRef.current;
    if (!el || items.length === 0) return;
    const id = requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth / 3; });
    return () => cancelAnimationFrame(id);
  }, [items.length]);

  // Preemptive wrap: jump to equivalent middle-set position BEFORE smooth scroll starts
  // This prevents mid-animation jumps that cause stutter
  const scroll = useCallback((dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const cardEl = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = cardEl ? cardEl.offsetWidth + GAP : 300;
    const oneSet = el.scrollWidth / 3;
    const predicted = el.scrollLeft + (dir === "right" ? amount : -amount);

    const doScroll = (d: "left" | "right") =>
      el.scrollBy({ left: d === "right" ? amount : -amount, behavior: "smooth" });

    if (predicted >= oneSet * 2) {
      el.scrollLeft -= oneSet;            // instant teleport to same visual position in middle set
      requestAnimationFrame(() => doScroll("right"));
    } else if (predicted < oneSet) {
      el.scrollLeft += oneSet;
      requestAnimationFrame(() => doScroll("left"));
    } else {
      doScroll(dir);
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    setIsDraggingState(true);
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = containerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 4) hasDragged.current = true;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    hasDragged.current = false;
    setIsDraggingState(false);
    const el = containerRef.current;
    if (!el) return;
    el.style.cursor = "grab";
    // Post-drag wrap back to middle set
    const oneSet = el.scrollWidth / 3;
    if (el.scrollLeft >= oneSet * 2) el.scrollLeft -= oneSet;
    else if (el.scrollLeft < oneSet) el.scrollLeft += oneSet;
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to right, #0A0A0A 20%, transparent 100%)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to left, #0A0A0A 20%, transparent 100%)" }} />

      <button onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center
                   text-xl leading-none border border-gold/25 text-gold/50
                   hover:text-gold hover:border-gold/60 hover:bg-navy-deep/90
                   transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous">‹</button>
      <button onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center
                   text-xl leading-none border border-gold/25 text-gold/50
                   hover:text-gold hover:border-gold/60 hover:bg-navy-deep/90
                   transition-all duration-300 backdrop-blur-sm"
        aria-label="Next">›</button>

      <div
        ref={containerRef}
        className="flex overflow-x-scroll scroll-no-bar select-none"
        style={{
          gap: `${GAP}px`,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          cursor: "grab",
          paddingBottom: "16px",
          paddingTop: "8px",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {tripled.map((item, i) => (
          <ScrollCard
            key={`${item.id}-${i}`}
            item={item}
            locale={locale}
            season={season}
            isGlobalDragging={isDraggingState}
          />
        ))}
      </div>
    </div>
  );
}
