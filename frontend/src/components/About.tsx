"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { number: t("stat1_number"), label: t("stat1_label") },
    { number: t("stat2_number"), label: t("stat2_label") },
    { number: t("stat3_number"), label: t("stat3_label") },
  ];

  return (
    <section id="about" className="bg-navy py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text content */}
          <div>
            <FadeIn>
              <p className="section-label mb-6">{t("section_label")}</p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="section-title mb-8">{t("title")}</h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="w-16 h-px bg-gold/40 mb-8" />
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-white/60 text-sm leading-relaxed font-light mb-6">{t("body1")}</p>
              <p className="text-white/60 text-sm leading-relaxed font-light mb-12">{t("body2")}</p>
            </FadeIn>

            {/* Philosophy + Ingredients */}
            <div className="grid sm:grid-cols-2 gap-8">
              <FadeIn delay={0.4}>
                <div className="border-l border-gold/30 pl-6">
                  <p className="section-label mb-3">{t("philosophy_label")}</p>
                  <p className="text-white/50 text-xs leading-relaxed font-light">{t("philosophy")}</p>
                </div>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="border-l border-burgundy/40 pl-6">
                  <p className="section-label mb-3" style={{ color: "#A82038" }}>
                    {t("ingredient_label")}
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed font-light italic">
                    {t("ingredient")}
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Stats */}
            <FadeIn delay={0.6}>
              <div className="flex gap-12 mt-16 pt-10 border-t border-white/5">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-3xl text-gold font-light">{s.number}</p>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Images */}
          <FadeIn delay={0.2}>
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80"
                  alt="La Passion interior"
                  fill
                  className="object-cover brightness-75 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              </div>

              {/* Floating accent image */}
              <div className="absolute -bottom-8 -left-8 w-48 h-56 overflow-hidden border-4 border-navy hidden lg:block">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
                  alt="La Passion dining"
                  fill
                  className="object-cover brightness-75 contrast-110"
                />
              </div>

              {/* Gold border accent */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-gold/30 hidden lg:block" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
