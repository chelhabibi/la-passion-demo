import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy-deep flex flex-col items-center justify-center text-center px-6">
      <p className="section-label mb-6">404</p>
      <h1 className="font-serif text-5xl text-white font-light mb-4">Page Not Found</h1>
      <div className="w-12 h-px bg-gold/40 mx-auto mb-8" />
      <Link href="/vi" className="btn-ghost">
        <span>← Return Home</span>
      </Link>
    </main>
  );
}
