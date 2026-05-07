export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import Contact from "@/components/Contact";

export default function MenuPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <div className="relative h-64 flex items-end pb-12 px-6 overflow-hidden bg-navy-deep">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep to-transparent" />
        <div className="relative max-w-7xl mx-auto w-full">
          <p className="section-label mb-3">Seasonal Menu</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">Thực Đơn</h1>
        </div>
      </div>

      <MenuSection />
      <Contact />
    </main>
  );
}
