"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const PHONE = "+84243826123";
const ZALO_URL = "#";       // thay bằng link Zalo thật
const FB_URL = "#";         // thay bằng link Messenger thật

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
    <path d="M3 1.5C2.5 1.5 2 2 2 2.5 2 8.5 6.5 13 12.5 13c.5 0 1-.5 1-1v-2l-3-.5-1 1.5C8 10.5 5.5 8 5 6.5L6.5 5.5 6 2.5H3z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="1.5" y="3" width="12" height="10.5" rx="0.5" />
    <line x1="1.5" y1="6.5" x2="13.5" y2="6.5" />
    <line x1="4.5" y1="1.5" x2="4.5" y2="4.5" />
    <line x1="10.5" y1="1.5" x2="10.5" y2="4.5" />
  </svg>
);

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const ZaloIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <rect width="24" height="24" rx="4" fill="#0068FF" />
    <text x="4" y="17" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="white">Za</text>
  </svg>
);

const FBIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  const options = [
    {
      icon: <CalendarIcon />,
      label: locale === "vi" ? "Đặt bàn online" : "Book a table",
      sub: locale === "vi" ? "Xác nhận ngay lập tức" : "Instant confirmation",
      href: `/${locale}/reservation`,
      internal: true,
      color: "gold",
    },
    {
      icon: <PhoneIcon />,
      label: locale === "vi" ? "Gọi điện đặt bàn" : "Call to reserve",
      sub: "+84 24 3826 1234",
      href: `tel:${PHONE}`,
      internal: false,
      color: "white",
    },
    {
      icon: <ZaloIcon />,
      label: "Zalo",
      sub: locale === "vi" ? "Nhắn tin nhanh qua Zalo" : "Quick message via Zalo",
      href: ZALO_URL,
      internal: false,
      color: "blue",
    },
    {
      icon: <FBIcon />,
      label: "Facebook Messenger",
      sub: locale === "vi" ? "Chat trên Facebook" : "Chat on Facebook",
      href: FB_URL,
      internal: false,
      color: "indigo",
    },
  ];

  const borderColor: Record<string, string> = {
    gold: "rgba(201,168,76,0.5)",
    white: "rgba(255,255,255,0.15)",
    blue: "rgba(0,104,255,0.4)",
    indigo: "rgba(99,102,241,0.4)",
  };
  const hoverBg: Record<string, string> = {
    gold: "rgba(201,168,76,0.08)",
    white: "rgba(255,255,255,0.04)",
    blue: "rgba(0,104,255,0.08)",
    indigo: "rgba(99,102,241,0.08)",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="bg-navy-deep border border-white/10 shadow-2xl w-72 overflow-hidden"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/6"
              style={{ background: "linear-gradient(135deg, rgba(13,31,60,0.9), rgba(9,18,35,0.95))" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="font-serif text-gold text-base font-light tracking-wide">La Passion</p>
              </div>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mt-1.5">
                {locale === "vi" ? "Chúng tôi có thể giúp gì?" : "How can we help?"}
              </p>
            </div>

            {/* Options */}
            <div className="p-3 space-y-1.5">
              {options.map((opt) => {
                const content = (
                  <div className="flex items-center gap-3 px-3 py-3 transition-all duration-200 cursor-pointer"
                    style={{
                      border: `1px solid ${borderColor[opt.color]}`,
                      borderRadius: "2px",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = hoverBg[opt.color]; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span className="text-white/60 shrink-0">{opt.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white/85 text-xs font-light">{opt.label}</p>
                      <p className="text-white/35 text-[9px] tracking-wide mt-0.5 truncate">{opt.sub}</p>
                    </div>
                  </div>
                );

                return opt.internal ? (
                  <Link key={opt.label} href={opt.href} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <a key={opt.label} href={opt.href} target={opt.href !== "#" ? "_blank" : undefined} rel="noopener noreferrer">
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Footer hours */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gold/60" />
              <p className="text-white/25 text-[9px] tracking-widest uppercase">
                {locale === "vi" ? "T3 – CN · 11:30 – 22:30" : "Tue – Sun · 11:30 – 22:30"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 flex items-center justify-center text-white transition-colors duration-300"
        style={{
          background: open ? "#6B1422" : "#8B1A2F",
          boxShadow: "0 0 30px rgba(139,26,47,0.45), 0 6px 20px rgba(0,0,0,0.5)",
        }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {/* Pulse ring — only when closed */}
        {!open && (
          <>
            <span className="absolute inset-0 animate-ping opacity-20"
              style={{ background: "#8B1A2F" }} />
            <span className="absolute inset-[-4px] border border-burgundy/30 animate-pulse" />
          </>
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.18 }}
              className="text-2xl font-light leading-none">×</motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.18 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
