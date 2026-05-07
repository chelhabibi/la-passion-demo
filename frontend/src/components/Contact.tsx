"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Logo from "./Logo";

export default function Contact() {
  const t = useTranslations("contact");
  const ft = useTranslations("footer");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="contact" className="bg-navy-deep py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div className="flex items-center gap-6 mb-24">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
          <Logo size={36} />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-16 text-center"
        >
          <div>
            <p className="section-label mb-4">{t("section_label")}</p>
            <p className="font-serif text-xl text-white font-light mb-6">{t("title")}</p>
            <div className="space-y-2 text-white/50 text-sm font-light">
              <p>{t("address")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>

          <div>
            <p className="section-label mb-4">{t("hours_title")}</p>
            <p className="font-serif text-xl text-white font-light mb-6">{t("hours")}</p>
            <div className="space-y-2 text-white/50 text-sm font-light">
              <p>{t("lunch")}</p>
              <p>{t("dinner")}</p>
              <p className="text-burgundy/70 text-xs tracking-wide">{t("closed")}</p>
            </div>
          </div>

          <div>
            <p className="section-label mb-4">Follow Us</p>
            <p className="font-serif text-xl text-white font-light mb-6">@lapassion.hanoi</p>
            <div className="flex justify-center gap-4">
              {["Instagram", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-white/30 text-xs tracking-widest uppercase hover:text-gold transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/20 text-[10px] tracking-widest uppercase">{ft("tagline")}</p>
          <p className="text-white/20 text-[10px]">{ft("rights")}</p>
        </motion.div>
      </div>
    </section>
  );
}
