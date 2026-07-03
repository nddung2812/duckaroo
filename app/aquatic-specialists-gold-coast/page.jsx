import AquaticSpecialistsClient from "./AquaticSpecialistsClient";

export const metadata = {
  title:
    "Aquatic Specialists Gold Coast - Expert Fish Tank & Pond Services | Duckaroo",
  description:
    "Gold Coast's premier aquatic specialists for fish tank cleaning, pond maintenance & aquarium services. 15+ years experience, same-day service, free quotes. Call (04) 5766 3939 today!",
  keywords:
    "aquatic specialists gold coast, fish tank cleaning gold coast, aquarium maintenance gold coast, pond cleaning gold coast, aquatic services gold coast, aquarium specialists gold coast, fish tank services gold coast",
  openGraph: {
    title: "Aquatic Specialists Gold Coast - Expert Fish Tank & Pond Services",
    description:
      "Gold Coast's most trusted aquatic specialists. Professional fish tank cleaning, pond maintenance & aquarium services. Free quotes, same-day service available.",
    url: "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast",
    siteName: "Duckaroo",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
        width: 1200,
        height: 630,
        alt: "Aquatic Specialists Gold Coast - Professional Fish Tank Services",
      },
    ],
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquatic Specialists Gold Coast - Expert Fish Tank & Pond Services",
    description:
      "Gold Coast's premier aquatic specialists. Professional fish tank cleaning, pond maintenance & aquarium services with 15+ years experience.",
    images: [
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
    ],
    creator: "@AquaticSwanDesign",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical:
      "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast",
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Gold Coast",
    "geo.position": "-28.0167;153.4000",
    ICBM: "-28.0167, 153.4000",
    "service:type": "Aquatic Specialists",
    "service:area": "Gold Coast, Queensland",
    "business:contact_data:street_address": "Gold Coast",
    "business:contact_data:locality": "Gold Coast",
    "business:contact_data:region": "QLD",
    "business:contact_data:postal_code": "4000-4999",
    "business:contact_data:country_name": "Australia",
  },
  category: "Professional Services",
  classification: "Aquatic Specialists & Fish Tank Services",
  coverage: "Gold Coast, Queensland",
  distribution: "local",
  rating: "general",
};

export default function AquaticSpecialistsGoldCoastPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast#business",
    name: "Duckaroo Aquatic Specialists Gold Coast",
    url: "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast",
    telephone: "+61457663939",
    email: "aquaticswandesign@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gold Coast",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -28.0167,
      longitude: 153.4,
    },
    areaServed: {
      "@type": "City",
      name: "Gold Coast",
      sameAs: "https://en.wikipedia.org/wiki/Gold_Coast,_Queensland",
    },
    serviceType: ["Fish Tank Cleaning", "Aquarium Maintenance", "Pond Cleaning", "Aquarium Setup"],
    parentOrganization: {
      "@id": "https://aquaticswandesign.com.au/#organization",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "247",
      bestRating: "5",
      worstRating: "1",
    },
    openingHours: "Mo-Su 08:00-18:00",
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <AquaticSpecialistsClient />
    </>
  );
}
