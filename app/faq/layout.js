import { faqItems } from "./faqData";

const SITE_URL = "https://duckaroo.com.au";

export const metadata = {
  title:
    "Frequently Asked Questions | Fish Tank Cleaning & Aquarium Service Brisbane & Gold Coast | Duckaroo",
  description:
    "Answers to the most common questions about Duckaroo's fish tank cleaning, aquarium maintenance, pond services, and setup across Brisbane & Gold Coast. Learn about pricing, service frequency, what's included, fish health & how to book.",
  keywords: [
    "fish tank cleaning FAQ",
    "aquarium maintenance questions",
    "fish tank cleaning Brisbane FAQ",
    "aquarium service Gold Coast FAQ",
    "how often clean fish tank",
    "fish tank cleaning cost Brisbane",
    "aquarium setup service",
    "pond cleaning Brisbane",
    "fish disease help Brisbane",
    "aquarium maintenance frequency",
    "Duckaroo FAQ",
  ].join(", "),
  openGraph: {
    title:
      "Frequently Asked Questions | Fish Tank Cleaning & Aquarium Service | Duckaroo",
    description:
      "Everything you need to know about Duckaroo's fish tank cleaning, aquarium maintenance, pond services, pricing, and booking across Brisbane & Gold Coast.",
    url: `${SITE_URL}/faq`,
    siteName: "Duckaroo",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712678/duckaroo-service-brisbane.jpg",
        width: 1200,
        height: 630,
        alt: "Duckaroo Fish Tank Cleaning Service FAQ - Brisbane & Gold Coast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Frequently Asked Questions | Fish Tank Cleaning & Aquarium Service | Duckaroo",
    description:
      "Answers to common questions about fish tank cleaning, aquarium maintenance, pricing, and booking across Brisbane & Gold Coast.",
  },
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251",
    ICBM: "-27.4698, 153.0251",
  },
};

export default function FAQLayout({ children }) {
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    url: `${SITE_URL}/faq`,
    name: "Frequently Asked Questions | Duckaroo Fish Tank Cleaning Service",
    description:
      "Common questions about Duckaroo's fish tank cleaning, aquarium maintenance, pond services, and setup across Brisbane & Gold Coast.",
    inLanguage: "en-AU",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: `${SITE_URL}/faq`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
