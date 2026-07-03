export const metadata = {
  title:
    "Fish Tank Cleaning Service Brisbane & Gold Coast | Professional Aquarium Maintenance | Duckaroo",
  description:
    "★★★★★ Premium fish tank cleaning service in Brisbane & Gold Coast. Expert aquarium maintenance, pond cleaning & setup services. Professional technicians, same-day service across all Brisbane & Gold Coast areas. Book your fish tank cleaning service today!",
  keywords: [
    "fish tank cleaning service",
    "fish tank cleaning service Brisbane",
    "fish tank cleaning service Gold Coast",
    "professional fish tank cleaning service",
    "aquarium cleaning service Brisbane",
    "aquarium cleaning service Gold Coast",
    "Brisbane fish tank cleaning service",
    "Gold Coast fish tank cleaning service",
    "fish tank maintenance Brisbane",
    "fish tank maintenance Gold Coast",
    "aquarium maintenance service Brisbane",
    "aquarium maintenance service Gold Coast",
    "pond cleaning Brisbane",
    "pond cleaning Gold Coast",
    "fish tank setup Brisbane",
    "fish tank setup Gold Coast",
    "emergency fish tank cleaning service Brisbane",
    "emergency fish tank cleaning service Gold Coast",
    "same day fish tank cleaning service",
    "certified fish tank cleaning Brisbane",
    "certified fish tank cleaning Gold Coast",
    "residential fish tank cleaning service",
    "commercial fish tank cleaning service",
    "affordable fish tank cleaning service Brisbane",
    "affordable fish tank cleaning service Gold Coast",
  ].join(", "),
  openGraph: {
    title:
      "Fish Tank Cleaning Service Brisbane & Gold Coast | Professional Aquarium Maintenance | Duckaroo",
    description:
      "★★★★★ Premium fish tank cleaning service in Brisbane & Gold Coast. Expert aquarium maintenance, pond cleaning & setup services across all Brisbane & Gold Coast areas.",
    url: "https://aquaticswandesign.com.au/service",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712678/duckaroo-service-brisbane.jpg",
        width: 1200,
        height: 630,
        alt: "Fish Tank Cleaning Service Brisbane - Professional Aquarium Maintenance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fish Tank Cleaning Service Brisbane & Gold Coast | Professional Aquarium Maintenance | Duckaroo",
    description:
      "★★★★★ Premium fish tank cleaning service in Brisbane & Gold Coast. Professional technicians, same-day service available.",
  },
  alternates: {
    canonical: "https://aquaticswandesign.com.au/service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServiceLayout({ children }) {
  return (
    <>
      {/* Service-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Duckaroo Fish Tank Cleaning Service Brisbane & Gold Coast",
            description:
              "Premium fish tank cleaning service, aquarium maintenance, and pond services across all Brisbane & Gold Coast areas, Queensland",
            url: "https://aquaticswandesign.com.au/service",
            telephone: "+61457663939",
            email: "aquaticswandesign@gmail.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Brisbane",
              addressRegion: "QLD",
              addressCountry: "AU",
            },
            serviceArea: {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: -27.4698,
                longitude: 153.0251,
              },
              geoRadius: "100000",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Aquarium & Fish Tank Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Fish Tank Cleaning Service Brisbane & Gold Coast",
                    description:
                      "Premium fish tank cleaning service for residential and commercial aquariums across all Brisbane & Gold Coast areas",
                  },
                  priceRange: "$$",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Aquarium Maintenance Brisbane & Gold Coast",
                    description:
                      "Regular aquarium maintenance and water quality management services",
                  },
                  priceRange: "$$",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pond Cleaning Brisbane & Gold Coast",
                    description:
                      "Professional pond cleaning and maintenance services for outdoor water features",
                  },
                  priceRange: "$$",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Emergency Tank Service",
                    description:
                      "24/7 emergency fish tank cleaning and repair services across Brisbane & Gold Coast",
                  },
                  priceRange: "$$$",
                  availability: "https://schema.org/InStock",
                },
              ],
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "247",
              bestRating: "5",
            },
          }),
        }}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How often should I have my fish tank professionally cleaned?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For most residential aquariums, professional cleaning every 4-6 weeks is ideal. Heavily stocked tanks, larger aquariums, or tanks with live plants may benefit from monthly service. Duckaroo offers customised maintenance schedules based on your tank's specific needs.",
                },
              },
              {
                "@type": "Question",
                name: "Do you offer fish tank cleaning services in Gold Coast?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! Duckaroo provides professional fish tank cleaning and aquarium maintenance across all Gold Coast areas including Surfers Paradise, Southport, Robina, Coomera, and Tweed Heads. Same-day service is available in most areas.",
                },
              },
              {
                "@type": "Question",
                name: "What is included in your fish tank cleaning service?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our standard fish tank cleaning service includes water testing and parameter adjustment, glass/acrylic cleaning, gravel vacuuming, filter maintenance, partial water change, algae removal, and plant trimming. We bring all equipment and products — you don't need to provide anything.",
                },
              },
              {
                "@type": "Question",
                name: "How much does fish tank cleaning cost in Brisbane?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Pricing depends on tank size, condition, and service frequency. Duckaroo offers competitive rates for both one-off cleans and regular maintenance contracts. Contact us for a personalised quote — we service Brisbane, Gold Coast, Logan, and Ipswich areas.",
                },
              },
              {
                "@type": "Question",
                name: "Can you set up a new aquarium from scratch?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. Duckaroo offers complete aquarium setup services including tank placement, equipment installation, substrate and hardscape design, planting, and initial cycling guidance. We handle everything from a bare tank to a fully planted, cycled aquarium ready for fish.",
                },
              },
            ],
          }),
        }}
      />

      {children}
    </>
  );
}
