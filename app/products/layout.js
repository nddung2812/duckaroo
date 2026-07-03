export const metadata = {
  title:
    "Rare Aquatic Plants Brisbane | Bucephalandra, Anubias & Live Plants | Duckaroo",
  description:
    "Australia Wide Shipping Aquatic Rare Bucephalandra & Other Rarer Plants • Live Arrival Guarantee • 100% Customer Satisfaction Guarantee. Premium aquarium plants, equipment & accessories shipped nationwide from Brisbane.",
  keywords:
    "bucephalandra Brisbane, anubias plants Australia, rare aquatic plants, aquarium plants online, live aquatic plants, aquascaping plants, freshwater plants, planted aquarium, aquarium equipment Brisbane",
  authors: [{ name: "Duckaroo Brisbane" }],
  creator: "Duckaroo Brisbane",
  publisher: "Duckaroo Brisbane",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aquaticswandesign.com.au"),
  alternates: {
    canonical: "https://aquaticswandesign.com.au/products",
  },
  openGraph: {
    title:
      "Rare Aquatic Plants Brisbane | Bucephalandra, Anubias & Live Plants | Duckaroo",
    description:
      "Australia Wide Shipping Aquatic Rare Bucephalandra & Other Rarer Plants • Live Arrival Guarantee • 100% Customer Satisfaction Guarantee. Premium aquarium plants, equipment & accessories.",
    url: "https://aquaticswandesign.com.au/products",
    siteName: "Duckaroo Brisbane",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1749469954/best-place-to-buy-bucephalandra-kedagang-v0-5fhaw341fkjc1_ujrt6m",
        width: 1200,
        height: 630,
        alt: "Premium Bucephalandra and Anubias Plants - Duckaroo Brisbane",
      },
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1755522754/Anu_nana_1_nrkqxt.webp",
        width: 1200,
        height: 630,
        alt: "Rare Aquatic Plants and Aquascaping Supplies Australia",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Rare Aquatic Plants Brisbane | Bucephalandra, Anubias & Live Plants | Duckaroo",
    description:
      "Australia Wide Shipping Aquatic Rare Bucephalandra & Other Rarer Plants • Live Arrival Guarantee • 100% Customer Satisfaction Guarantee.",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1749469954/best-place-to-buy-bucephalandra-kedagang-v0-5fhaw341fkjc1_ujrt6m",
        alt: "Premium Bucephalandra and Anubias Plants - Duckaroo Brisbane",
      },
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
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251",
    ICBM: "-27.4698, 153.0251",
    "product:availability": "in stock",
    "product:condition": "new",
    "product:retailer": "Duckaroo Brisbane",
  },
  category: "Ecommerce",
  classification: "Aquarium Plants & Equipment",
  coverage: "Australia",
  distribution: "global",
  rating: "general",
};

export default function ProductsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "@id": "https://aquaticswandesign.com.au/products#store",
            name: "Duckaroo Aquatic Plant Store",
            description:
              "Australia's premier online store for rare aquatic plants including Bucephalandra, Anubias, and aquascaping supplies with live arrival guarantee.",
            url: "https://aquaticswandesign.com.au/products",
            image:
              "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1749469954/best-place-to-buy-bucephalandra-kedagang-v0-5fhaw341fkjc1_ujrt6m",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Brisbane",
              addressRegion: "QLD",
              addressCountry: "AU",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -27.4698,
              longitude: 153.0251,
            },
            telephone: "+61457663939",
            email: "aquaticswandesign@gmail.com",
            areaServed: {
              "@type": "Country",
              name: "Australia",
            },
            currenciesAccepted: "AUD",
            paymentAccepted: ["Credit Card", "PayPal", "Bank Transfer"],
            priceRange: "$5-$400",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Aquatic Plants & Equipment",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Buce Kegadang",
                    category: "Aquatic Plants",
                    description:
                      "Bucephalandra Kegadang is an easy plant, perfect for beginners",
                    sku: "1",
                  },
                  price: "24.99",
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                  url: "https://aquaticswandesign.com.au/products/buce-kegadang",
                  priceValidUntil: "2026-12-31",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.7",
                    reviewCount: "23",
                  },
                  shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingRate: {
                      "@type": "MonetaryAmount",
                      value: "0",
                      currency: "AUD",
                    },
                    deliveryTime: {
                      "@type": "ShippingDeliveryTime",
                      handlingTime: {
                        "@type": "QuantitativeValue",
                        minValue: 1,
                        maxValue: 2,
                        unitCode: "DAY",
                      },
                      transitTime: {
                        "@type": "QuantitativeValue",
                        minValue: 2,
                        maxValue: 7,
                        unitCode: "DAY",
                      },
                    },
                    shippingDestination: {
                      "@type": "DefinedRegion",
                      addressCountry: "AU",
                    },
                  },
                  warranty: {
                    "@type": "WarrantyPromise",
                    durationOfWarranty: {
                      "@type": "QuantitativeValue",
                      value: 30,
                      unitCode: "DAY",
                    },
                    warrantyScope: "Live Arrival Guarantee",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Anubias Nana",
                    category: "Aquatic Plants",
                    description:
                      "Classic Anubias Nana - extremely easy plant to grow",
                    sku: "3",
                  },
                  price: "15.00",
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                  url: "https://aquaticswandesign.com.au/products/anubias-nana",
                  priceValidUntil: "2026-12-31",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    reviewCount: "67",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Amazon Frogbit X 5",
                    category: "Aquatic Plants",
                    description:
                      "Fast-growing floating plant perfect for new aquariums",
                    sku: "2",
                  },
                  price: "5.50",
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                  url: "https://aquaticswandesign.com.au/products/amazon-frogbit",
                  priceValidUntil: "2026-12-31",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "42",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Rotala Rotundifolia Pink Baby Tears",
                    category: "Aquatic Plants",
                    description:
                      "Beautiful pink coloration stem plant for aquascaping",
                    sku: "4",
                  },
                  price: "8.50",
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                  url: "https://aquaticswandesign.com.au/products/rotala-rotundifolia",
                  priceValidUntil: "2026-12-31",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.6",
                    reviewCount: "18",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Product",
                    name: "Albino Blue Topaz Guppy PAIR",
                    category: "Livestock",
                    description:
                      "Beautiful breeding pair with blue-orange coloration",
                    sku: "5",
                  },
                  price: "89.00",
                  priceCurrency: "AUD",
                  availability: "https://schema.org/InStock",
                  url: "https://aquaticswandesign.com.au/products/albino-blue-topaz-guppy-sold-as-a-pair-male-and-female",
                  priceValidUntil: "2026-12-31",
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.5",
                    reviewCount: "8",
                  },
                },
              ],
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://aquaticswandesign.com.au/products?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://aquaticswandesign.com.au/products#shipping-service",
            serviceType: "Plant Shipping Service",
            name: "Australia Wide Plant Shipping",
            description:
              "Nationwide shipping of live aquatic plants with arrival guarantee",
            provider: {
              "@type": "Organization",
              name: "Duckaroo Brisbane",
            },
            areaServed: {
              "@type": "Country",
              name: "Australia",
            },
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: "https://aquaticswandesign.com.au/products",
              servicePhone: "+61457663939",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Shipping Guarantees",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Live Arrival Guarantee",
                    description:
                      "100% guarantee that plants arrive alive and healthy",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Customer Satisfaction Guarantee",
                    description:
                      "100% customer satisfaction guarantee on all products",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Australia Wide Shipping",
                    description:
                      "Nationwide shipping coverage across all Australian states",
                  },
                },
              ],
            },
          }),
        }}
      />

      {children}
    </>
  );
}
