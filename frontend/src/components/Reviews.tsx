"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const REVIEWS = [
  {
    name: "Nguyễn Thu Hà",
    date_vi: "Tháng 4, 2026", date_en: "April 2026",
    rating: 5,
    text_vi: "Trải nghiệm ẩm thực tuyệt vời nhất mà tôi từng có tại Hà Nội. Duck Confit tan chảy trong miệng, không gian ấm cúng và cực kỳ sang trọng. Chef Minh Tú đích thân ra chào khách — điều đó rất ý nghĩa.",
    text_en: "The finest dining experience I've had in Hanoi. Duck Confit melted in the mouth, the ambiance warm and incredibly refined. Chef Minh Tú personally greeted us — that meant everything.",
    occasion_vi: "Kỷ niệm ngày cưới", occasion_en: "Wedding Anniversary",
  },
  {
    name: "David Mercer",
    date_vi: "Tháng 3, 2026", date_en: "March 2026",
    rating: 5,
    text_vi: "Tôi đã ăn tại nhiều nhà hàng fine dining khắp châu Á, nhưng La Passion có điều gì đó rất riêng — sự giao thoa giữa kỹ thuật Pháp và nguyên liệu Việt Nam tạo nên một trải nghiệm không thể tìm thấy ở nơi nào khác.",
    text_en: "I've dined at fine restaurants across Asia, but La Passion has something uniquely its own — the fusion of French technique with Vietnamese ingredients creates something you can't find anywhere else.",
    occasion_vi: "Công tác tại Hà Nội", occasion_en: "Business trip to Hanoi",
  },
  {
    name: "Trần Minh Khoa",
    date_vi: "Tháng 2, 2026", date_en: "February 2026",
    rating: 5,
    text_vi: "Chef's Table 7 món là trải nghiệm đáng tiền nhất tôi từng chi. Từng món được giải thích tỉ mỉ, nguyên liệu rõ nguồn gốc. Không gian phố cổ vào ban đêm thêm phần huyền ảo.",
    text_en: "The 7-course Chef's Table was the most worthwhile splurge of my life. Each course explained in detail, ingredients fully traceable. The Old Quarter setting at night added something magical.",
    occasion_vi: "Sinh nhật 30 tuổi", occasion_en: "30th Birthday",
  },
  {
    name: "Sophie Laurent",
    date_vi: "Tháng 1, 2026", date_en: "January 2026",
    rating: 5,
    text_vi: "Là người Pháp, tôi rất khắt khe với ẩm thực Pháp tại nước ngoài. La Passion không chỉ đạt — họ còn vượt qua. Foie gras và Crème Brûlée hoàn hảo. Tôi sẽ quay lại mỗi lần có mặt ở Hà Nội.",
    text_en: "As a French person, I'm extremely particular about French cuisine abroad. La Passion doesn't just meet the bar — they exceed it. Foie gras and Crème Brûlée were perfect. I'll return every time I'm in Hanoi.",
    occasion_vi: "Du lịch Việt Nam", occasion_en: "Vietnam holiday",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 12 12" fill={i < rating ? "#C9A84C" : "rgba(255,255,255,0.1)"}>
          <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const locale = useLocale();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  return (
    <section className="bg-black py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">
            {locale === "vi" ? "Khách Hàng Nói Gì" : "Guest Reviews"}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-4">
            {locale === "vi" ? "Những Khoảnh Khắc Được Kể Lại" : "Moments Worth Sharing"}
          </h2>
          <div className="w-12 h-px bg-gold/40 mx-auto" />
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className="relative p-6 cursor-pointer transition-all duration-400 group"
              style={{
                background: active === i
                  ? "rgba(13,31,60,0.95)"
                  : "rgba(13,31,60,0.5)",
                boxShadow: active === i
                  ? "0 0 0 1px rgba(201,168,76,0.4), 0 16px 40px rgba(0,0,0,0.5)"
                  : "0 0 0 1px rgba(255,255,255,0.05)",
                transform: active === i ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              {/* Quote mark */}
              <span className="absolute top-4 right-5 font-serif text-4xl leading-none"
                style={{ color: active === i ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.05)" }}>
                "
              </span>

              <StarRating rating={r.rating} />

              <p className="text-white/65 text-xs font-light leading-relaxed mt-4 mb-6 line-clamp-4 group-hover:text-white/80 transition-colors">
                {locale === "vi" ? r.text_vi : r.text_en}
              </p>

              <div className="border-t border-white/5 pt-4">
                <p className="text-white text-sm font-light">{r.name}</p>
                <p className="text-gold/60 text-[10px] tracking-widest uppercase mt-1">
                  {locale === "vi" ? r.occasion_vi : r.occasion_en}
                </p>
                <p className="text-white/25 text-[10px] mt-1">
                  {locale === "vi" ? r.date_vi : r.date_en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{
                width: active === i ? "24px" : "6px",
                height: "6px",
                background: active === i ? "#C9A84C" : "rgba(255,255,255,0.15)",
                borderRadius: "3px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
