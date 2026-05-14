import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://frontend-production-01ff.up.railway.app";
const OG_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La Passion — Fine Dining Pháp-Việt | Hà Nội",
    template: "%s | La Passion",
  },
  description:
    "Trải nghiệm fine dining Pháp-Việt tại lòng phố cổ Hà Nội. Thực đơn theo mùa, không gian sang trọng, đặt bàn online dễ dàng tại La Passion.",
  keywords: [
    "nhà hàng fine dining Hà Nội",
    "ẩm thực Pháp-Việt",
    "đặt bàn online",
    "La Passion",
    "fine dining Hanoi",
    "French Vietnamese restaurant",
  ],
  openGraph: {
    title: "La Passion — Fine Dining Pháp-Việt | Hà Nội",
    description:
      "Khám phá hành trình ẩm thực Pháp-Việt tại La Passion — fine dining giữa lòng phố cổ Hà Nội. Thực đơn mùa, không gian ấm cúng, đặt bàn online chỉ trong 30 giây.",
    url: SITE_URL,
    siteName: "La Passion",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "La Passion — Fine Dining Hà Nội" }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Passion — Fine Dining Pháp-Việt | Hà Nội",
    description:
      "Khám phá hành trình ẩm thực Pháp-Việt tại La Passion — fine dining giữa lòng phố cổ Hà Nội. Đặt bàn online dễ dàng.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: { "vi-VN": `${SITE_URL}/vi`, "en-US": `${SITE_URL}/en` },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
