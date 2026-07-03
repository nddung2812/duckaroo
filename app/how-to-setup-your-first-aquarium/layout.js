export const metadata = {
  title:
    "How to Setup Your First Aquarium | Complete Beginner's Guide | Duckaroo Brisbane",
  description:
    "The ultimate beginner's guide to setting up your first aquarium. Learn about the nitrogen cycle, equipment selection, fish selection, and step-by-step setup instructions from aquarium experts in Brisbane.",
  keywords: [
    "how to setup aquarium",
    "first aquarium guide",
    "beginner aquarium setup",
    "aquarium nitrogen cycle",
    "fish tank setup guide",
    "aquarium equipment guide",
    "Brisbane aquarium setup",
    "beginner fish keeping",
    "aquarium cycling guide",
    "fish tank maintenance",
    "aquarium plants guide",
    "aquarium filter guide",
  ].join(", "),
  openGraph: {
    title:
      "How to Setup Your First Aquarium | Complete Beginner's Guide | Duckaroo Brisbane",
    description:
      "The ultimate step-by-step guide for beginners setting up their first aquarium. Expert advice on equipment, fish selection, and maintenance.",
    url: "https://aquaticswandesign.com.au/how-to-setup-your-first-aquarium",
    type: "article",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757335537/bucephalandra_bush_oyiznj",
        width: 1200,
        height: 630,
        alt: "Complete Beginner's Guide to Setting Up Your First Aquarium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Setup Your First Aquarium | Complete Beginner's Guide",
    description:
      "The ultimate step-by-step guide for beginners setting up their first aquarium. Expert advice from Brisbane aquarium specialists.",
  },
  alternates: {
    canonical:
      "https://aquaticswandesign.com.au/how-to-setup-your-first-aquarium",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AquariumGuideLayout({ children }) {
  return (
    <>
      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "The Ultimate Beginner's Guide to Your First Aquarium",
            description:
              "Complete step-by-step guide for setting up your first aquarium, covering equipment selection, fish selection, nitrogen cycle, and maintenance.",
            image:
              "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757335537/bucephalandra_bush_oyiznj",
            author: {
              "@type": "Organization",
              "@id": "https://aquaticswandesign.com.au/#organization",
              name: "Duckaroo",
              url: "https://aquaticswandesign.com.au",
            },
            publisher: {
              "@type": "Organization",
              "@id": "https://aquaticswandesign.com.au/#organization",
              name: "Duckaroo",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
              },
            },
            datePublished: "2024-01-15",
            dateModified: "2025-06-01",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://aquaticswandesign.com.au/how-to-setup-your-first-aquarium",
            },
            articleSection: "Aquarium Guides",
            keywords: [
              "aquarium setup",
              "beginner guide",
              "fish keeping",
              "aquarium equipment",
            ],
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
                name: "What size aquarium should a beginner start with?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Beginners should start with a minimum of 10 gallons, though larger tanks (20+ gallons) are actually easier to maintain due to more stable water parameters. Larger water volumes are less prone to dangerous fluctuations.",
                },
              },
              {
                "@type": "Question",
                name: "How long does it take to cycle a new aquarium?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A fishless cycle typically takes 4-8 weeks when starting from scratch. However, using established filter media from another tank can reduce this to just a few days to one week.",
                },
              },
              {
                "@type": "Question",
                name: "What is the nitrogen cycle in aquariums?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The nitrogen cycle is when beneficial bacteria convert toxic ammonia (from fish waste) into nitrite, then into relatively harmless nitrate. This bacterial colony primarily lives in your filter and is essential for fish health.",
                },
              },
              {
                "@type": "Question",
                name: "Should beginners start with live plants?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Live plants can benefit beginners by consuming excess nutrients and encouraging natural fish behavior. Start with easy epiphyte plants like Anubias and Java Fern that attach to decorations rather than requiring special substrates.",
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
