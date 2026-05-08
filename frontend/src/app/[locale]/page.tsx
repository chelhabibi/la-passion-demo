import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import dynamic from "next/dynamic";
import Chef from "@/components/Chef";
import Ticker from "@/components/Ticker";

const MenuSection = dynamic(() => import("@/components/MenuSection"), { ssr: false });
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <About />
      <Chef />
      <Ticker />
      <MenuSection preview />

      {/* Reservation CTA banner */}
      <section className="relative bg-navy py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550966871-3ed3cfd1b8a9?w=1200&q=80')" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="section-label mb-6">Reservations</p>
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light mb-6 leading-tight">
            An Evening at <br />
            <span className="italic text-gold-gradient">La Passion</span>
          </h2>
          <div className="w-12 h-px bg-gold/40 mx-auto mb-8" />
          <p className="text-white/50 text-sm mb-12 font-light max-w-md mx-auto">
            Only 12 tables. Reserve yours and let us prepare a moment that lingers long after the last bite.
          </p>
          <Link href="./reservation" className="btn-primary inline-flex mx-auto">
            <span>Reserve a Table</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      <Reviews />
      <Contact />
    </main>
  );
}
