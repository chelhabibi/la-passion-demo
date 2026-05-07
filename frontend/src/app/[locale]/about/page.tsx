"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  const stats = [
    { number: t("stat1_number"), label: t("stat1_label") },
    { number: t("stat2_number"), label: t("stat2_label") },
    { number: t("stat3_number"), label: t("stat3_label") },
  ];

  const pillars = [
    {
      num: "01",
      label: t("philosophy_label"),
      text: t("philosophy"),
      color: "#D4AF6A",
    },
    {
      num: "02",
      label: t("ingredient_label"),
      text: t("ingredient"),
      color: "#A82038",
    },
    {
      num: "03",
      label: locale === "vi" ? "Không Gian" : "Ambiance",
      text:
        locale === "vi"
          ? "Không gian tôn vinh kiến trúc phố cổ Hà Nội — ấm áp, riêng tư, và đầy tinh tế."
          : "A space that honours Hanoi's old-quarter architecture — warm, intimate, and refined.",
      color: "#6B7280",
    },
  ];

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {/* ── PAGE BANNER ── */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=80"
          alt="La Passion"
          fill
          className="object-cover"
          style={{ filter: "brightness(0.4) contrast(1.15)" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end px-10 lg:px-24 pb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="section-label mb-4"
            >
              {t("section_label")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif text-4xl md:text-6xl font-light text-white leading-tight"
            >
              {t("title")}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="w-16 h-px bg-gold/50 origin-left mt-5"
            />
          </div>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <FadeIn>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
              {t("body1")}
            </p>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              {t("body2")}
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="relative">
            <div className="relative overflow-hidden aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
                alt="La Passion kitchen"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.7) contrast(1.1)" }}
              />
              <div className="absolute inset-0 border border-white/6" />
            </div>
            {/* Quote overlay */}
            <div className="absolute -bottom-4 -left-4 bg-navy-deep border border-white/8 px-5 py-4 max-w-[220px]">
              <p className="font-serif text-xs text-white/70 italic leading-relaxed">
                "{locale === "vi"
                  ? "Nấu ăn là cách chúng tôi nói yêu thương."
                  : "Cooking is how we say love."}"
              </p>
              <p className="text-gold/50 text-[9px] tracking-widest uppercase mt-2">— Chef Minh Tú</p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-white/6" />
      </div>

      {/* ── PILLARS ── */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <FadeIn className="mb-14">
          <p className="section-label mb-2">
            {locale === "vi" ? "Giá Trị Cốt Lõi" : "Core Values"}
          </p>
          <div className="w-8 h-px bg-gold/30" />
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <FadeIn key={p.num} delay={i * 0.1}>
              <div className="border-t border-white/8 pt-6">
                <p className="font-serif text-3xl font-light mb-4"
                  style={{ color: "rgba(255,255,255,0.07)" }}>
                  {p.num}
                </p>
                <div className="w-5 h-px mb-4" style={{ background: p.color, opacity: 0.6 }} />
                <p className="text-[10px] tracking-ultra uppercase mb-3" style={{ color: p.color }}>
                  {p.label}
                </p>
                <p className="text-white/50 text-sm font-light leading-relaxed">{p.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-navy-deep border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 divide-x divide-white/6">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1} className="text-center py-4">
                <p className="font-serif text-5xl text-gold font-light mb-2">{s.number}</p>
                <p className="text-white/35 text-[9px] tracking-ultra uppercase">{s.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5 bg-white/4">
        {[
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80",
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=80",
        ].map((src, i) => (
          <FadeIn key={i} delay={i * 0.08} className="relative overflow-hidden aspect-square">
            <Image
              src={src}
              alt={`La Passion ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              style={{ filter: "brightness(0.65) contrast(1.05)" }}
            />
          </FadeIn>
        ))}
      </div>

      {/* ── SIMPLE FOOTER ── */}
      <div className="bg-black py-12 text-center">
        <p className="font-serif text-gold/60 text-sm font-light tracking-widest">La Passion</p>
        <p className="text-white/20 text-[9px] tracking-ultra uppercase mt-2">
          24 Hàng Bè · Hoàn Kiếm · Hà Nội
        </p>
      </div>
    </main>
  );
}
