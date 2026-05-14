import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ReservationForm from "@/components/ReservationForm";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Đặt Bàn",
  description:
    "Đặt bàn online tại La Passion — chọn ngày giờ, số khách và yêu cầu đặc biệt. Xác nhận tự động qua email. Nhà hàng fine dining hàng đầu Hà Nội.",
  openGraph: {
    title: "Đặt Bàn | La Passion",
    description:
      "Đặt bàn online tại La Passion — chọn ngày giờ, số khách và yêu cầu đặc biệt. Xác nhận tự động qua email.",
  },
};

export default function ReservationPage() {
  return (
    <main className="bg-black">
      <Navbar />
      {/* Page header */}
      <div className="relative h-64 flex items-end pb-12 px-6 overflow-hidden bg-navy-deep">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep to-transparent" />
        <div className="relative max-w-7xl mx-auto w-full">
          <p className="section-label mb-3">Reservations</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">Đặt Bàn</h1>
        </div>
      </div>

      <section className="bg-navy py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ReservationForm />
        </div>
      </section>

      <Contact />
    </main>
  );
}
