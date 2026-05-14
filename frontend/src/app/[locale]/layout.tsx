import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

export const dynamic = "force-dynamic";

const locales = ["vi", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "La Passion",
  "description": "Fine dining Pháp-Việt tại lòng phố cổ Hà Nội — thực đơn theo mùa, không gian sang trọng, đặt bàn online.",
  "url": "https://frontend-production-01ff.up.railway.app",
  "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  "telephone": "+84-24-3826-1234",
  "priceRange": "$$$",
  "servesCuisine": ["French", "Vietnamese"],
  "acceptsReservations": "True",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "18 Hàng Buồm",
    "addressLocality": "Hoàn Kiếm",
    "addressRegion": "Hà Nội",
    "postalCode": "100000",
    "addressCountry": "VN",
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "11:30",
      "closes": "14:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "18:00",
      "closes": "22:30",
    },
  ],
  "sameAs": [],
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
      />
      {children}
      <ChatWidget />
    </NextIntlClientProvider>
  );
}
