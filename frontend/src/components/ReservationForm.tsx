"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  guests: z.coerce.number().min(1).max(20),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SPECIAL_OPTIONS = [
  { id: "cake",      vi: "Viết tên lên bánh",  en: "Custom cake inscription" },
  { id: "smoke",     vi: "Đĩa khói",            en: "Smoke plate effect" },
  { id: "nameplate", vi: "Bảng tên",             en: "Name plate" },
  { id: "balloon",   vi: "Bóng bay",             en: "Balloons" },
  { id: "candle",    vi: "Nến",                  en: "Candles" },
  { id: "flower",    vi: "Hoa tươi",             en: "Fresh flowers" },
];

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed bottom-8 right-8 z-50 flex items-start gap-4
                 bg-navy border border-gold/30 p-6 max-w-sm shadow-2xl"
    >
      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-gold text-sm">✓</span>
      </div>
      <div>
        <p className="text-white font-serif text-lg font-light">
          {useTranslations("reservation")("success.title")}
        </p>
        <p className="text-white/50 text-xs mt-1">{message}</p>
      </div>
      <button onClick={onClose} className="text-white/30 hover:text-white ml-2 text-lg leading-none">
        ×
      </button>
    </motion.div>
  );
}

export default function ReservationForm() {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      const extrasLabels = selectedExtras.map(id => {
        const opt = SPECIAL_OPTIONS.find(o => o.id === id);
        return opt ? (locale === "vi" ? opt.vi : opt.en) : id;
      });
      const notesWithExtras = [
        extrasLabels.length ? `[${locale === "vi" ? "Yêu cầu đặc biệt" : "Special additions"}: ${extrasLabels.join(", ")}]` : "",
        data.notes || "",
      ].filter(Boolean).join(" | ");

      const res = await fetch(`${apiUrl}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, notes: notesWithExtras }),
      });
      if (!res.ok) throw new Error();
      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch {
      setSubmitError(t("errors.submit_failed"));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const timeSlots = [
    "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  ];

  return (
    <>
      <div className="grid lg:grid-cols-5 gap-16">
        {/* Left: info */}
        <div className="lg:col-span-2">
          <p className="section-label mb-6">{t("section_label")}</p>
          <h2 className="section-title mb-6">{t("title")}</h2>
          <div className="w-12 h-px bg-gold/40 mb-8" />
          <p className="text-white/50 text-sm font-light leading-relaxed">{t("subtitle")}</p>

          <div className="mt-16 space-y-6">
            {[
              { icon: "📍", label: locale === "vi" ? "Địa Chỉ" : "Address", value: "24 Hàng Bè, Hoàn Kiếm, Hà Nội" },
              { icon: "📞", label: locale === "vi" ? "Điện Thoại" : "Phone", value: "+84 24 3826 1234" },
              { icon: "🕐", label: locale === "vi" ? "Giờ Mở Cửa" : "Hours", value: locale === "vi" ? "T3–CN: 11:30–14:30 | 18:00–22:30" : "Tue–Sun: 11:30–14:30 | 18:00–22:30" },
            ].map((info) => (
              <div key={info.label} className="flex gap-4">
                <span className="text-lg">{info.icon}</span>
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">{info.label}</p>
                  <p className="text-white/70 text-sm font-light">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.name")}</label>
                <input
                  {...register("name")}
                  placeholder={t("form.name_placeholder")}
                  className="input-field"
                />
                {errors.name && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.name_required")}</p>
                )}
              </div>
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.email")}</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder={t("form.email_placeholder")}
                  className="input-field"
                />
                {errors.email && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.email_invalid")}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.phone")}</label>
                <input
                  {...register("phone")}
                  placeholder={t("form.phone_placeholder")}
                  className="input-field"
                />
                {errors.phone && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.phone_required")}</p>
                )}
              </div>
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.guests")}</label>
                <input
                  {...register("guests")}
                  type="number"
                  min={1}
                  max={20}
                  placeholder={t("form.guests_placeholder")}
                  className="input-field"
                />
                {errors.guests && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.guests_required")}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.date")}</label>
                <input
                  {...register("date")}
                  type="date"
                  min={today}
                  className="input-field [color-scheme:dark]"
                />
                {errors.date && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.date_required")}</p>
                )}
              </div>
              <div>
                <label className="section-label text-[9px] block mb-3">{t("form.time")}</label>
                <select {...register("time")} className="input-field">
                  <option value="" className="bg-navy">{t("form.time")}</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-navy">
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-burgundy-light text-[10px] mt-2">{t("errors.time_required")}</p>
                )}
              </div>
            </div>

            <div>
              <label className="section-label text-[9px] block mb-3">{t("form.notes")}</label>
              <textarea
                {...register("notes")}
                placeholder={t("form.notes_placeholder")}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {submitError && (
              <p className="text-burgundy-light text-xs">{submitError}</p>
            )}

            {/* Special additions */}
            <div>
              <label className="section-label text-[9px] block mb-4">
                {locale === "vi" ? "Trang Trí Đặc Biệt (tuỳ chọn)" : "Special Additions (optional)"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SPECIAL_OPTIONS.map((opt) => {
                  const checked = selectedExtras.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleExtra(opt.id)}
                      className="flex items-center gap-2 px-3 py-2.5 border text-left transition-all duration-300 text-[11px] font-light tracking-wide"
                      style={{
                        borderColor: checked ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.1)",
                        background: checked ? "rgba(201,168,76,0.08)" : "transparent",
                        color: checked ? "#D4AF6A" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <span
                        className="w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          borderColor: checked ? "#C9A84C" : "rgba(255,255,255,0.2)",
                          background: checked ? "rgba(201,168,76,0.15)" : "transparent",
                        }}
                      >
                        {checked && <span className="text-gold text-[9px]">✓</span>}
                      </span>
                      {locale === "vi" ? opt.vi : opt.en}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? t("form.submitting") : t("form.submit")}</span>
              {!isSubmitting && <span>→</span>}
            </button>
          </form>
        </div>
      </div>

      {/* Success popup */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessToast
            message={t("success.message")}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
