import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Passion — Fine Dining Hà Nội",
  description:
    "Trải nghiệm ẩm thực Pháp-Việt tại lòng phố cổ Hà Nội. Fine dining, seasonal menu, đặt bàn online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
