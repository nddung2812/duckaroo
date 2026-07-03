import { blogs } from "@/data/blogs";

const BASE = "https://aquaticswandesign.com.au";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${BASE}/blogs`,
      url: `${BASE}/blogs`,
      name: "Aquarium Care Blog | Expert Fish Tank Tips & Guides | Duckaroo",
      description:
        "Expert aquarium care guides, fish tank maintenance tips, plant care advice, and aquascaping inspiration from Duckaroo — Brisbane and Gold Coast's professional aquarium service.",
      publisher: {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "Duckaroo",
      },
      inLanguage: "en-AU",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: blogs.length,
        itemListElement: blogs.map((blog, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE}/blogs/${blog.slug}`,
          name: blog.title,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${BASE}/blogs`,
        },
      ],
    },
  ],
};

export const metadata = {
  title:
    "Aquarium Care Blog | Expert Fish Tank Tips & Guides | Duckaroo Brisbane",
  description:
    "Expert aquarium care guides, fish tank maintenance tips, plant care advice, and aquascaping inspiration from Duckaroo — Brisbane and Gold Coast's professional aquarium service.",
  keywords:
    "aquarium care blog, fish tank maintenance tips, aquascaping guides, aquarium plant care, Brisbane aquarium experts, fish health guides",
  metadataBase: new URL(BASE),
  alternates: {
    canonical: `${BASE}/blogs`,
  },
  openGraph: {
    title: "Aquarium Care Blog | Expert Fish Tank Tips & Guides | Duckaroo",
    description:
      "Expert aquarium care guides, fish health tips, plant care, and aquascaping advice from Brisbane's professional aquarium service specialists.",
    url: `${BASE}/blogs`,
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        width: 1200,
        height: 630,
        alt: "Duckaroo Aquarium Care Blog - Expert Tips and Guides",
      },
    ],
    type: "website",
    siteName: "Duckaroo",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquarium Care Blog | Expert Fish Tank Tips & Guides | Duckaroo",
    description:
      "Expert aquarium care guides, fish health tips, and aquascaping advice from Brisbane's professional aquarium service.",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        alt: "Duckaroo Aquarium Care Blog - Expert Tips and Guides",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogsLayout({ children }) {
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
