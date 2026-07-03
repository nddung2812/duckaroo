export const metadata = {
  title: "Common Aquarium Diseases | Identification & Treatment Guide | Duckaroo",
  description:
    "Complete guide to 30 common aquarium diseases affecting freshwater and marine fish in Australia. Symptoms, treatments, and Australian medications for every disease.",
  keywords:
    "aquarium diseases, fish diseases Australia, freshwater fish diseases, marine fish diseases, aquarium disease treatment, fish health guide, aquarium ich, fin rot, velvet disease",
  metadataBase: new URL("https://aquaticswandesign.com.au"),
  alternates: {
    canonical: "https://aquaticswandesign.com.au/common-aquarium-diseases",
  },
  openGraph: {
    title: "Common Aquarium Diseases | Identification & Treatment Guide | Duckaroo",
    description:
      "Identify and treat 30 common aquarium diseases. Symptoms, Australian medications, and expert advice from Brisbane's aquarium specialists.",
    url: "https://aquaticswandesign.com.au/common-aquarium-diseases",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        width: 1200,
        height: 630,
        alt: "Common Aquarium Diseases Guide - Duckaroo",
      },
    ],
    type: "website",
    siteName: "Duckaroo",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Common Aquarium Diseases | Identification & Treatment Guide",
    description:
      "Identify and treat 30 common aquarium diseases affecting freshwater and marine fish in Australia.",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        alt: "Common Aquarium Diseases Guide",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DiseasesLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://aquaticswandesign.com.au/common-aquarium-diseases",
    url: "https://aquaticswandesign.com.au/common-aquarium-diseases",
    name: "Common Aquarium Diseases | Identification & Treatment Guide | Duckaroo",
    description:
      "Complete guide to 30 common aquarium diseases affecting freshwater and marine fish in Australia. Symptoms, treatments, and Australian medications.",
    publisher: {
      "@type": "Organization",
      "@id": "https://aquaticswandesign.com.au/#organization",
      name: "Duckaroo",
    },
    inLanguage: "en-AU",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aquaticswandesign.com.au" },
        { "@type": "ListItem", position: 2, name: "Aquarium Diseases", item: "https://aquaticswandesign.com.au/common-aquarium-diseases" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
