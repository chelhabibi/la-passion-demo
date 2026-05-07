"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { number: t("stat1_number"), label: t("stat1_label") },
    { number: t("stat2_number"), label: t("stat2_label") },
    { number: t("stat3_number"), label: t("stat3_label") },
  ];

  return (
    <section id="about" className="bg-black">
      <div className="grid lg:grid-cols-2 min-h-[600px]">

        {/* Image */}
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=80"
            alt="La Passion interior"
            fill
            className="object-cover"
            style={{ filter: "brightness(0.6) contrast(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Text */}
        <div ref={ref} className="bg-black flex items-center px-10 lg:px-20 py-20">
          <div className="max-w-lg">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="section-label mb-5"
            >
              {t("section_label")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl text-white font-light leading-snug mb-6"
            >
              {t("title")}
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="w-12 h-px bg-gold/40 origin-left mb-7"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/55 text-sm font-light leading-relaxed mb-8"
            >
              {t("body1")}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-0 border-t border-white/8 pt-8 mb-10"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-serif text-2xl text-gold font-light mb-1">{s.number}</p>
                  <p className="text-white/30 text-[9px] tracking-widest uppercase leading-tight">{s.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <Link
                href={`/${locale}/about`}
                className="btn-ghost text-[10px]"
              >
                <span>{locale === "vi" ? "Khám Phá Câu Chuyện Của Chúng Tôi" : "Discover Our Story"}</span>
                <span>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
