"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const NavIcons = {
  home: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="opacity-60">
      <path d="M6 1.2L1 5.2V11h3.5V8H7.5v3H11V5.2L6 1.2z" />
    </svg>
  ),
  menu: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="opacity-60">
      <path d="M3.5 1v3.5c0 .8.5 1.2.5 1.2V11h1V5.7s.5-.4.5-1.2V1h-1v2.5h-.5V1h-.5zm5 0c-.8 1.5-.8 3 0 4V11h1V1h-1z" />
    </svg>
  ),
  about: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="opacity-60">
      <path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm.5 7.5h-1v-4h1v4zm0-5h-1v-1h1v1z" />
    </svg>
  ),
  reservation: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-60">
      <rect x="1" y="2.5" width="10" height="8.5" rx="0.5" />
      <line x1="1" y1="5.5" x2="11" y2="5.5" />
      <line x1="3.5" y1="1" x2="3.5" y2="3.5" />
      <line x1="8.5" y1="1" x2="8.5" y2="3.5" />
    </svg>
  ),
  contact: (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="opacity-60">
      <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5 2.5 7.25 6 11 6 11s3.5-3.75 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  ),
};

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === "vi" ? "en" : "vi";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home"), icon: NavIcons.home },
    { href: `/${locale}/menu`, label: t("menu"), icon: NavIcons.menu },
    { href: `/${locale}/about`, label: t("about"), icon: NavIcons.about },
    { href: `/${locale}#contact`, label: t("contact"), icon: NavIcons.contact },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-navy-deep/95 backdrop-blur-md border-b border-gold/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <Logo size={44} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden md:block">
              <span className="block font-serif text-lg tracking-widest text-gold">LA PASSION</span>
              <span className="block text-white/40 text-[9px] tracking-ultra uppercase">
                Fine Dining · Hà Nội
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link flex items-center gap-1.5 group"
              >
                <span className="group-hover:text-gold transition-colors duration-300">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language + CTA */}
          <div className="flex items-center gap-4">
            {/* Language toggle — shows CURRENT language */}
            <button
              onClick={switchLocale}
              title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
              className="relative text-white/70 text-xs tracking-widest uppercase font-sans
                         transition-all duration-300 hover:text-gold
                         border border-white/20 hover:border-gold/50 px-3 py-1.5
                         flex items-center gap-1.5"
            >
              {/* Dot indicator showing current locale */}
              <span className="w-1.5 h-1.5 rounded-full bg-gold/80 inline-block" />
              {locale.toUpperCase()}
            </button>

            <Link
              href={`/${locale}/reservation`}
              className="hidden md:inline-flex btn-primary text-[10px] px-5 py-2.5"
            >
              {t("reservation")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1 p-2"
            >
              <span className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-navy-deep flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 font-serif text-2xl text-white hover:text-gold transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
