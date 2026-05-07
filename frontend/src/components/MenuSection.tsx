"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getSeasonMenuLabel, getCurrentSeason } from "@/lib/season";

interface MenuItem {
  id: number;
  name_vi: string; name_en: string;
  description_vi: string; description_en: string;
  price: number; category: string;
  image_url: string; is_available: boolean;
}

const CATEGORIES = ["all", "combo", "starter", "main", "dessert", "drink"] as const;

function MenuCard({ item, locale }: { item: MenuItem; locale: string }) {
  const [hovered, setHovered] = useState(false);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const name = locale === "vi" ? item.name_vi : item.name_en;
  const desc = locale === "vi" ? item.description_vi : item.description_en;
  const season = getCurrentSeason(locale);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPar({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPar({ x: 0, y: 0 }); }}
      onMouseMove={onMove}
      style={{
        transform: hovered ? "translateY(-14px)" : "translateY(0px)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(201,168,76,0.65), 0 28px 56px rgba(0,0,0,0.8), 0 0 36px rgba(201,168,76,0.2)"
          : "0 0 0 1px rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.4)",
        transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease",
      }}
      className="menu-card"
    >
      {/* Full image — no separate bar below, frosted strip overlaid inside */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={item.image_url} alt={name} fill className="object-cover"
          style={{
            transform: hovered
              ? `scale(1.18) translate(${-par.x * 12}px, ${-par.y * 8}px)`
              : "scale(1)",
            filter: hovered
              ? "brightness(1.0) contrast(1.1) saturate(1.2) grayscale(0)"
              : "brightness(0.65) contrast(1.05) grayscale(0.25)",
            transition: hovered
              ? "transform 0.12s ease, filter 0.4s ease"
              : "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease",
          }}
        />
        {/* Subtle top vignette only */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%)" }} />

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
            padding: "12px 16px 14px",
          }}
        >
          {/* Description expands into strip on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/65 text-[10px] font-light leading-relaxed italic overflow-hidden"
              >
                {desc}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base font-light leading-snug truncate transition-colors duration-300"
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
                    className="text-white/38 text-[9px] tracking-widest uppercase mt-1 overflow-hidden"
                  >
                    {item.category} · {locale === "vi" ? `Mùa ${season}` : season}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="font-light text-sm transition-colors duration-300 shrink-0"
              style={{ color: hovered ? "#C9A84C" : "rgba(212,175,106,0.9)" }}>
              {Number(item.price).toLocaleString("vi-VN")}
              <span className="text-[10px] text-white/30 ml-0.5">đ</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ComboCard({ item, locale, isFirst }: { item: MenuItem; locale: string; isFirst?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [par, setPar] = useState({ x: 0 });
  const name = locale === "vi" ? item.name_vi : item.name_en;
  const desc = locale === "vi" ? item.description_vi : item.description_en;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPar({ x: (e.clientX - rect.left) / rect.width - 0.5 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPar({ x: 0 }); }}
      onMouseMove={onMove}
      style={{
        transform: hovered ? "translateY(-12px)" : "translateY(0px)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(201,168,76,0.8), 0 32px 64px rgba(0,0,0,0.85), 0 0 60px rgba(201,168,76,0.25)"
          : "0 0 0 1px rgba(201,168,76,0.2), 0 8px 24px rgba(0,0,0,0.5)",
        transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease",
      }}
      className="relative overflow-hidden"
    >
      {/* Best seller badge */}
      {isFirst && (
        <div className="absolute top-0 right-0 z-10 bg-burgundy text-white text-[8px] tracking-widest uppercase px-3 py-1.5">
          Best Seller
        </div>
      )}

      {/* Gold shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="shimmer"
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-y-0 w-28"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.28), transparent)",
                transform: "skewX(-18deg)",
              }}
              initial={{ left: "-30%" }}
              animate={{ left: "130%" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <Image src={item.image_url} alt={name} fill className="object-cover"
          style={{
            transform: hovered
              ? `scale(1.12) translateX(${-par.x * 14}px)`
              : "scale(1)",
            filter: hovered
              ? "brightness(0.85) contrast(1.2) saturate(1.1) grayscale(0)"
              : "brightness(0.52) contrast(1.1) grayscale(0.2)",
            transition: hovered
              ? "transform 0.12s ease, filter 0.45s ease"
              : "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease",
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: hovered
              ? "linear-gradient(to right, rgba(9,22,41,0.75) 0%, rgba(9,22,41,0.35) 60%, transparent 100%)"
              : "linear-gradient(to right, rgba(9,22,41,0.95) 0%, rgba(9,22,41,0.7) 50%, rgba(9,22,41,0.3) 100%)",
          }}
        />

        <div className="absolute top-5 left-5">
          <span className="text-[9px] tracking-ultra uppercase font-sans px-3 py-1 border border-gold/60 text-gold bg-black/40 backdrop-blur-sm">
            Signature
          </span>
        </div>
        <div
          className="absolute top-5 right-5 text-right transition-all duration-400"
          style={{ opacity: hovered ? 1 : 0.5, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
        >
          <p className="font-serif text-xl text-gold font-light">
            {Number(item.price).toLocaleString("vi-VN")}
            <span className="text-xs text-white/40 ml-1">đ</span>
          </p>
          <p className="text-white/30 text-[9px] tracking-widest uppercase mt-0.5">
            {locale === "vi" ? "/ người" : "/ person"}
          </p>
        </div>
      </div>

      {/* Content with stagger */}
      <div
        className="p-7"
        style={{
          background: hovered ? "rgba(13,31,60,0.98)" : "rgba(13,31,60,0.92)",
          transition: "background 0.4s ease",
        }}
      >
        {/* Name staggered */}
        <h3
          className="font-serif text-2xl font-light mb-3"
          style={{
            color: hovered ? "#D4AF6A" : "rgba(255,255,255,0.9)",
            transform: hovered ? "translateY(0)" : "translateY(5px)",
            transition: "color 0.35s ease, transform 0.35s ease",
          }}
        >
          {name}
        </h3>

        {/* Expanding divider */}
        <div
          className="h-px mb-4"
          style={{
            width: hovered ? "100%" : "32px",
            background: hovered
              ? "linear-gradient(to right, rgba(201,168,76,0.8), rgba(201,168,76,0.2))"
              : "rgba(201,168,76,0.35)",
            transition: "width 0.45s cubic-bezier(0.25,0.46,0.45,0.94) 0.05s, background 0.3s ease",
          }}
        />

        {/* Description staggered */}
        <p
          className="text-xs font-light leading-relaxed tracking-wide"
          style={{
            color: hovered ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.55)",
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "color 0.35s ease 0.1s, transform 0.35s ease 0.1s",
          }}
        >
          {desc}
        </p>

        {/* CTA staggered */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="mt-5 flex items-center gap-2"
            >
              <span className="text-gold text-[10px] tracking-widest uppercase font-sans">
                {locale === "vi" ? "Đặt bàn để trải nghiệm" : "Reserve to experience"}
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="text-gold/70 text-xs"
              >
                →
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-shimmer relative aspect-[4/3] overflow-hidden">
      {/* Category chip placeholder */}
      <div className="absolute top-4 left-4 w-14 h-5 bg-white/6" />
      {/* Frosted strip placeholder */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 py-3"
        style={{
          background: "rgba(9,18,35,0.72)",
          backdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="h-4 bg-white/10 flex-1 rounded-sm" />
          <div className="h-3 bg-gold/15 w-20 rounded-sm shrink-0" />
        </div>
      </div>
    </div>
  );
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-dc32.up.railway.app";

export default function MenuSection({ preview = false, initialItems }: { preview?: boolean; initialItems?: MenuItem[] }) {
  const t = useTranslations("menu");
  const locale = useLocale();
  const [items, setItems] = useState<MenuItem[]>(initialItems ?? []);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(!initialItems || initialItems.length === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const seasonLabel = getSeasonMenuLabel(locale);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) return;
    fetch(`${BACKEND}/menu`)
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);
  const displayed = preview ? filtered.slice(0, 6) : filtered;

  return (
    <section id="menu" className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header — with real season name */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="section-label mb-4">{seasonLabel}</p>
          <h2 className="section-title mb-4">{t("title")}</h2>
          <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
          <p className="text-white/40 text-sm font-light tracking-wide max-w-lg mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Category filter */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-wrap justify-center gap-2 mb-14">
          {CATEGORIES.map((cat) => {
            const isCombo = cat === "combo";
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[10px] tracking-widest uppercase font-sans border transition-all duration-300 ${
                  isActive && !isCombo ? "bg-burgundy border-burgundy text-white" : ""
                } ${isCombo ? (isActive ? "combo-tab-active text-gold" : "combo-tab-inactive") : (!isActive ? "border-white/10 text-white/40 hover:border-gold/40 hover:text-gold" : "")}`}>
                {t(`categories.${cat}`)}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}>
              {/* === SET MENU SECTION === */}
              {(activeCategory === "all" || activeCategory === "combo") && (() => {
                const combos = displayed.filter(i => i.category === "combo");
                if (!combos.length) return null;
                const firstId = Math.min(...combos.map(c => c.id));
                return (
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-px h-8 bg-gold/40" />
                      <p className="section-label text-gold">Signature Set Menu</p>
                      <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {combos.map(item => (
                        <ComboCard key={item.id} item={item} locale={locale} isFirst={item.id === firstId} />
                      ))}
                    </div>
                    {activeCategory === "all" && <div className="border-b border-white/5 mt-16 mb-2" />}
                  </div>
                );
              })()}

              {/* === À LA CARTE — infinite scroll for "all", grid for filtered === */}
              {activeCategory !== "combo" && (() => {
                const regular = displayed.filter(i => i.category !== "combo" && i.category !== "drink");
                const drinks = displayed.filter(i => i.category === "drink");

                if (!regular.length && !drinks.length) return null;

                return (
                  <>
                    {activeCategory === "all" && regular.length > 0 && (
                      <>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-px h-8 bg-white/20" />
                          <p className="section-label">À La Carte</p>
                          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                          {regular.map(item => <MenuCard key={item.id} item={item} locale={locale} />)}
                        </div>
                        {drinks.length > 0 && (
                          <>
                            <div className="flex items-center gap-4 mb-8 mt-4">
                              <div className="w-px h-8 bg-white/20" />
                              <p className="section-label">{locale === "vi" ? "Đồ Uống" : "Drinks"}</p>
                              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {drinks.map(item => <MenuCard key={item.id} item={item} locale={locale} />)}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {activeCategory !== "all" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...regular, ...drinks].map(item => <MenuCard key={item.id} item={item} locale={locale} />)}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        )}

        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }} className="text-center mt-16">
            <Link href={`/${locale}/menu`} className="btn-primary">
              <span>{locale === "vi" ? "Xem Toàn Bộ Thực Đơn" : "View Full Menu"}</span>
              <span>→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
