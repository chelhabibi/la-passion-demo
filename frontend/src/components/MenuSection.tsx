"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  id: number;
  name_vi: string;
  name_en: string;
  description_vi: string;
  description_en: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

const CATEGORIES = ["all", "starter", "main", "dessert", "drink"] as const;

function MenuCard({ item, locale }: { item: MenuItem; locale: string }) {
  const [hovered, setHovered] = useState(false);
  const name = locale === "vi" ? item.name_vi : item.name_en;
  const desc = locale === "vi" ? item.description_vi : item.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="menu-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image_url}
          alt={name}
          fill
          className={`object-cover transition-all duration-700 ${
            hovered ? "scale-110 brightness-90" : "scale-100 brightness-[0.65] contrast-125"
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
            hovered ? "from-black/90 via-black/40 to-transparent" : "from-navy-deep/60 to-transparent"
          }`}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="section-label text-[8px] bg-black/50 backdrop-blur-sm px-2 py-1">
            {item.category}
          </span>
        </div>

        {/* Hover: description overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-end p-5"
            >
              <p className="text-white/70 text-xs font-light leading-relaxed tracking-wide">{desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card info */}
      <div className="bg-navy/80 backdrop-blur-sm border border-white/5 p-5 flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="font-serif text-lg text-white font-light leading-snug">{name}</h3>
          {!hovered && (
            <p className="text-white/40 text-xs mt-1 line-clamp-1 font-light">{desc}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-gold font-light text-sm tracking-wide">
            {Number(item.price).toLocaleString("vi-VN")}
            <span className="text-[10px] text-white/30 ml-1">đ</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuSection({ preview = false }: { preview?: boolean }) {
  const t = useTranslations("menu");
  const locale = useLocale();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/menu`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUrl]);

  const filtered = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

  const displayed = preview ? filtered.slice(0, 6) : filtered;

  return (
    <section id="menu" className="bg-black py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">{t("section_label")}</p>
          <h2 className="section-title mb-4">{t("title")}</h2>
          <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
          <p className="text-white/40 text-sm font-light tracking-wide max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-[10px] tracking-widest uppercase font-sans border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-burgundy border-burgundy text-white"
                  : "border-white/10 text-white/40 hover:border-gold/40 hover:text-gold"
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-navy/50 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayed.map((item) => (
                <MenuCard key={item.id} item={item} locale={locale} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View all CTA (only in preview mode) */}
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
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
