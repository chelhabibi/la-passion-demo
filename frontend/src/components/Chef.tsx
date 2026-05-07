"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const AWARDS = [
  { year: "2023", label_vi: "Được đề cử Michelin Guide Vietnam", label_en: "Michelin Guide Vietnam Recognition" },
  { year: "2022", label_vi: "Best Fine Dining Restaurant — Hà Nội Food Awards", label_en: "Best Fine Dining Restaurant — Hanoi Food Awards" },
  { year: "2020", label_vi: "Top 10 Chef Vietnam — Forbes Vietnam", label_en: "Top 10 Chef Vietnam — Forbes Vietnam" },
  { year: "2017", label_vi: "Best New Restaurant — Condé Nast Vietnam", label_en: "Best New Restaurant — Condé Nast Vietnam" },
];

export default function Chef() {
  const locale = useLocale();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-navy-deep py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image side */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden max-w-md">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
                alt="Chef Minh Tú"
                fill
                className="object-cover brightness-75 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
              {/* Chef name overlay */}
              <div className="absolute bottom-8 left-8">
                <p className="font-serif text-2xl text-white font-light">Chef Minh Tú</p>
                <p className="text-gold/70 text-xs tracking-widest uppercase mt-1">
                  {locale === "vi" ? "Bếp Trưởng & Sáng Lập" : "Head Chef & Founder"}
                </p>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gold/15 hidden lg:block" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border border-burgundy/20 hidden lg:block" />
          </motion.div>

          {/* Content side */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="section-label mb-6"
            >
              {locale === "vi" ? "Bếp Trưởng" : "The Chef"}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-4xl md:text-5xl text-white font-light leading-tight mb-8"
            >
              {locale === "vi" ? "Triết Lý Của Một\nTình Yêu" : "The Philosophy\nOf A Passion"}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-12 h-px bg-gold/40 mb-10"
            />

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mb-10"
            >
              <span className="absolute -top-4 -left-2 text-gold/20 font-serif text-6xl leading-none">"</span>
              <p className="font-serif text-xl md:text-2xl text-white/80 font-light italic leading-relaxed pl-6">
                {locale === "vi"
                  ? "Mỗi đĩa thức ăn là một bức thư tình tôi gửi đến Hà Nội — nơi đã nuôi dưỡng tôi trước khi Paris dạy tôi nấu ăn."
                  : "Every dish is a love letter I write to Hanoi — the city that nurtured me before Paris taught me to cook."}
              </p>
              <span className="absolute -bottom-6 right-0 text-gold/20 font-serif text-6xl leading-none">"</span>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-white/50 text-sm font-light leading-relaxed mb-12"
            >
              {locale === "vi"
                ? "Tốt nghiệp Le Cordon Bleu Paris, từng làm việc tại bếp của Alain Ducasse và Guy Savoy trước khi trở về Hà Nội năm 2015 để mở La Passion — nhà hàng mang ký ức hai thế giới vào một đĩa."
                : "Graduate of Le Cordon Bleu Paris, formerly of Alain Ducasse and Guy Savoy kitchens before returning to Hanoi in 2015 to open La Passion — a restaurant that brings the memory of two worlds onto one plate."}
            </motion.p>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <p className="section-label mb-6">
                {locale === "vi" ? "Giải Thưởng & Công Nhận" : "Awards & Recognition"}
              </p>
              <div className="space-y-4">
                {AWARDS.map((award) => (
                  <div key={award.year} className="flex items-start gap-5 group">
                    <span className="text-gold/50 text-xs font-light tracking-widest shrink-0 mt-0.5 group-hover:text-gold transition-colors">
                      {award.year}
                    </span>
                    <div className="w-px h-4 bg-white/10 mt-0.5 shrink-0" />
                    <p className="text-white/50 text-xs font-light leading-relaxed group-hover:text-white/70 transition-colors">
                      {locale === "vi" ? award.label_vi : award.label_en}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
