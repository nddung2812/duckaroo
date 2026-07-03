export const metadata = {
  title:
    "About Duckaroo | Professional Fish Tank Cleaning Service Brisbane & Gold Coast",
  description:
    "Duckaroo is Brisbane and Gold Coast's professional fish tank cleaning and aquarium maintenance service. 1000+ satisfied customers, 15+ years experience across Brisbane, Gold Coast, and Queensland.",
  keywords: [
    "about duckaroo",
    "fish tank cleaning Brisbane",
    "aquarium maintenance Brisbane",
    "fish tank cleaning Gold Coast",
    "aquarium cleaning service Brisbane",
    "pond cleaning Brisbane",
    "aquarium specialists Queensland",
  ],

  openGraph: {
    title:
      "About Duckaroo | Professional Fish Tank Cleaning Service Brisbane & Gold Coast",
    description:
      "Duckaroo provides professional fish tank cleaning and aquarium maintenance across Brisbane and Gold Coast. 1000+ customers, 15+ years experience, 4.9-star rated.",
    url: "https://aquaticswandesign.com.au/about-us",
    siteName: "Duckaroo",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
        width: 1200,
        height: 630,
        alt: "Duckaroo - Brisbane's Professional Aquarium Service",
      },
    ],
    locale: "en_AU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Duckaroo | Fish Tank Cleaning Service Brisbane & Gold Coast",
    description:
      "Professional fish tank cleaning and aquarium maintenance. 15+ years experience across Brisbane, Gold Coast & QLD. 1000+ happy customers.",
    images: [
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
    ],
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
    canonical: "https://aquaticswandesign.com.au/about-us",
  },

  category: "Aquarium Services",
  classification: "Business",

  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251",
    ICBM: "-27.4698, 153.0251",
    "business:contact_data:locality": "Brisbane",
    "business:contact_data:region": "Queensland",
    "business:contact_data:country_name": "Australia",
    "business:contact_data:postal_code": "4000",
    "business:contact_data:phone_number": "+61457663939",
    "business:contact_data:website": "https://aquaticswandesign.com.au",
  },
};

export default function AboutUsLayout({ children }) {
  return (
    <>
      {/* About Us specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": "https://aquaticswandesign.com.au/about-us",
            mainEntity: {
              "@type": "LocalBusiness",
              "@id": "https://aquaticswandesign.com.au/#organization",
              name: "Duckaroo",
              alternateName: "Duckaroo Fish Tank Cleaning Service",
              description:
                "Duckaroo is Brisbane and Gold Coast's professional fish tank cleaning and aquarium maintenance service, serving residential and commercial clients across Brisbane, Gold Coast, Logan, and Ipswich, Queensland.",
              url: "https://aquaticswandesign.com.au",
              telephone: "+61457663939",
              email: "aquaticswandesign@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Brisbane",
                addressRegion: "QLD",
                postalCode: "4000",
                addressCountry: "AU",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -27.4698,
                longitude: 153.0251,
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Brisbane",
                  sameAs: "https://en.wikipedia.org/wiki/Brisbane",
                },
                {
                  "@type": "City",
                  name: "Gold Coast",
                  sameAs:
                    "https://en.wikipedia.org/wiki/Gold_Coast,_Queensland",
                },
                {
                  "@type": "City",
                  name: "Logan",
                },
                {
                  "@type": "City",
                  name: "Ipswich",
                },
                {
                  "@type": "State",
                  name: "Queensland",
                  sameAs: "https://en.wikipedia.org/wiki/Queensland",
                },
              ],
              serviceType: [
                "Fish Tank Cleaning",
                "Aquarium Maintenance",
                "Pond Cleaning",
                "Tank Removal",
                "Aquarium Setup",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "247",
                bestRating: "5",
                worstRating: "1",
              },
              review: [
                {
                  "@type": "Review",
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                  },
                  author: {
                    "@type": "Person",
                    name: "Sarah Mitchell",
                  },
                  reviewBody:
                    "Absolutely fantastic service! The team cleaned our office aquarium and it looks incredible. Professional, punctual, and the fish are so much happier.",
                  datePublished: "2024-01-15",
                },
                {
                  "@type": "Review",
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5",
                  },
                  author: {
                    "@type": "Person",
                    name: "David Chen",
                  },
                  reviewBody:
                    "Best aquarium service in Brisbane! They set up our new 200L tank perfectly and provided excellent ongoing maintenance advice.",
                  datePublished: "2024-01-01",
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Aquarium Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Fish Tank Cleaning",
                      description:
                        "Professional fish tank cleaning and aquarium maintenance across Brisbane and Gold Coast",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Aquarium Maintenance",
                      description:
                        "Regular aquarium maintenance and water quality management",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Pond Cleaning",
                      description:
                        "Professional pond cleaning and maintenance services",
                    },
                  },
                ],
              },
              openingHours: "Mo-Su 08:00-18:00",
              priceRange: "$$",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              currenciesAccepted: "AUD",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
