"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Logo from "./Logo";

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="shrink-0">
    <path d="M2.5 1.5c-.5 0-1 .5-1 1 0 5.5 4.5 10 10 10 .5 0 1-.5 1-1v-2.5l-2.5-.5-1 1.5C7.5 9 5 6.5 4.5 4.5l1.5-1L5.5 1H2.5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="shrink-0 mt-0.5">
    <path d="M7 1C4.8 1 3 2.8 3 5c0 3.2 4 8 4 8s4-4.8 4-8c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="shrink-0">
    <rect x="1" y="3" width="12" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M1 3.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="shrink-0">
    <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Contact() {
  const t = useTranslations("contact");
  const ft = useTranslations("footer");
  const locale = useLocale();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="contact" className="bg-navy-deep">
      {/* Main contact block */}
      <div className="grid lg:grid-cols-2 min-h-[480px]">
        {/* Left — info */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative px-10 py-20 flex flex-col justify-center overflow-hidden"
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-8"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80')" }}
          />
          <div className="absolute inset-0 bg-navy-deep/80" />

          <div className="relative z-10">
            <p className="section-label mb-4">{t("section_label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-8">{t("title")}</h2>
            <div className="w-10 h-px bg-gold/40 mb-10" />

            {/* Contact details with icons */}
            <div className="space-y-5 mb-10">
              <a href={`tel:${t("phone").replace(/\s/g, "")}`} className="flex items-center gap-4 text-white/60 hover:text-gold transition-colors group">
                <span className="text-gold/70 group-hover:text-gold transition-colors"><PhoneIcon /></span>
                <span className="text-sm font-light tracking-wide">{t("phone")}</span>
              </a>
              <div className="flex items-start gap-4 text-white/60">
                <span className="text-gold/70"><MapPinIcon /></span>
                <span className="text-sm font-light tracking-wide leading-relaxed">{t("address")}</span>
              </div>
              <a href={`mailto:${t("email")}`} className="flex items-center gap-4 text-white/60 hover:text-gold transition-colors group">
                <span className="text-gold/70 group-hover:text-gold transition-colors"><EmailIcon /></span>
                <span className="text-sm font-light tracking-wide">{t("email")}</span>
              </a>
              <div className="flex items-start gap-4 text-white/60">
                <span className="text-gold/70 mt-0.5"><ClockIcon /></span>
                <div>
                  <p className="text-sm font-light">{t("hours")} · {t("lunch")} | {t("dinner")}</p>
                  <p className="text-burgundy/70 text-xs tracking-wide mt-1">{t("closed")}</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-white/30 text-[10px] tracking-ultra uppercase mb-4">
                {locale === "vi" ? "Theo Dõi Chúng Tôi" : "Follow Us"}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/40 hover:text-gold transition-colors p-2 border border-white/10 hover:border-gold/40">
                  <InstagramIcon />
                </a>
                <a href="#" className="text-white/40 hover:text-gold transition-colors p-2 border border-white/10 hover:border-gold/40">
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — Google Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative min-h-[400px] lg:min-h-0"
          style={{ filter: "grayscale(0.4) contrast(1.1)" }}
        >
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=105.845%2C21.027%2C105.853%2C21.035&layer=mapnik&marker=21.031%2C105.849"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "400px", display: "block" }}
            title="La Passion location"
          />
          {/* Overlay pin label */}
          <div className="absolute top-4 left-4 bg-navy-deep/90 backdrop-blur-sm px-4 py-2 border border-gold/30">
            <p className="font-serif text-sm text-gold font-light">La Passion</p>
            <p className="text-white/50 text-[10px] tracking-wide">24 Hàng Bè, Hoàn Kiếm</p>
          </div>
        </motion.div>
      </div>

      {/* Footer strip */}
      <div className="px-10 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Logo size={28} />
          <p className="text-white/25 text-[10px] tracking-widest uppercase">{ft("tagline")}</p>
        </div>
        <p className="text-white/20 text-[10px]">{ft("rights")}</p>
      </div>
    </section>
  );
}
