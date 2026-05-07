"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

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
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/menu`, label: t("menu") },
    { href: `/${locale}#about`, label: t("about") },
    { href: `/${locale}/reservation`, label: t("reservation") },
    { href: `/${locale}#contact`, label: t("contact") },
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
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language + CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={switchLocale}
              className="text-white/50 text-xs tracking-widest uppercase font-sans
                         transition-colors duration-300 hover:text-gold
                         border border-white/10 hover:border-gold/40 px-3 py-1.5"
            >
              {locale === "vi" ? "EN" : "VI"}
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
              <span
                className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
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
                className="font-serif text-2xl text-white hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
