import { notFound } from "next/navigation";
import { getStockItemBySlug, getAllStockItems, getRelatedStockItems } from "@/lib/stock";
import ProductPageContent from "./ProductPageContent";

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
};

const getOptimizedTitle = (product) => {
  if (product.category === "plants") {
    if (
      product.name.toLowerCase().includes("bucephalandra") ||
      product.name.toLowerCase().includes("buce")
    ) {
      return `${product.name} Brisbane | Rare Bucephalandra Aquatic Plants Australia | Duckaroo`;
    } else if (product.name.toLowerCase().includes("anubias")) {
      return `${product.name} Brisbane | Premium Anubias Aquarium Plants Australia | Duckaroo`;
    } else {
      return `${product.name} Brisbane | Live Aquatic Plants Australia Wide Shipping | Duckaroo`;
    }
  } else if (product.category === "equipment") {
    return `${product.name} Brisbane | Professional Aquarium Equipment Australia | Duckaroo`;
  } else {
    return `${product.name} Brisbane | Aquarium ${product.category} Australia Wide | Duckaroo`;
  }
};

const getOptimizedDescription = (product) => {
  const plainDesc = stripHtml(product.description);
  const shippingText =
    "Australia Wide Shipping • Live Arrival Guarantee • 100% Customer Satisfaction";
  if (product.category === "plants") {
    if (
      product.name.toLowerCase().includes("bucephalandra") ||
      product.name.toLowerCase().includes("buce")
    ) {
      return `${plainDesc} ${shippingText}. Premium Bucephalandra shipped from Brisbane to all Australian states. Price: $${product.price} AUD.`;
    } else if (product.name.toLowerCase().includes("anubias")) {
      return `${plainDesc} ${shippingText}. Hardy Anubias aquarium plants shipped from Brisbane Australia wide. Price: $${product.price} AUD.`;
    } else {
      return `${plainDesc} ${shippingText}. Live aquatic plants shipped safely from Brisbane to all Australian states. Price: $${product.price} AUD.`;
    }
  } else {
    return `${plainDesc} ${shippingText}. Professional aquarium ${product.category} shipped from Brisbane Australia wide. Price: $${product.price} AUD.`;
  }
};

// Generate metadata for SEO using product data
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getStockItemBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Duckaroo Brisbane",
      description:
        "The requested product could not be found. Browse our collection of premium aquatic plants, equipment and accessories.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquaticswandesign.com.au";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const firstImage = getImageSrc(product.images?.[0]);
  const title = getOptimizedTitle(product);
  const description = getOptimizedDescription(product);

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.category,
      "aquarium Brisbane",
      "aquatic plants Australia",
      "aquascaping",
      "aquarium supplies",
      "live arrival guarantee",
      "Australia wide shipping",
      "Brisbane aquarium store",
      ...(product.category === "plants"
        ? [
            "live aquatic plants",
            "aquascaping plants",
            "planted aquarium",
            ...(product.name.toLowerCase().includes("bucephalandra") ||
            product.name.toLowerCase().includes("buce")
              ? ["bucephalandra Australia", "rare bucephalandra", "bucephalandra Brisbane"]
              : []),
            ...(product.name.toLowerCase().includes("anubias")
              ? ["anubias Australia", "anubias plants", "hardy aquarium plants"]
              : []),
          ]
        : []),
      ...(product.features ?? []).map((f) => f.toLowerCase()),
    ].join(", "),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} Brisbane - $${product.price} AUD | Duckaroo`,
      description,
      url: productUrl,
      siteName: "Duckaroo Brisbane",
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
        ...(product.images ?? []).slice(1, 4).map((image, index) => ({
          url: getImageSrc(image),
          width: 1200,
          height: 1200,
          alt: `${product.name} - Image ${index + 2}`,
        })),
      ],
      type: "website",
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} Brisbane - $${product.price} AUD | Duckaroo`,
      description,
      images: [firstImage],
      creator: "@Duckaroo",
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
      "product:price:amount": product.price.toString(),
      "product:price:currency": "AUD",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": "Duckaroo Brisbane",
      "product:category": product.category,
      "geo.region": "AU-QLD",
      "geo.placename": "Brisbane",
      "geo.position": "-27.4698;153.0251",
      ICBM: "-27.4698, 153.0251",
    },
  };
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllStockItems();
  return products.map((p) => ({ slug: p.slug }));
}

function ProductStructuredData({ product }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://aquaticswandesign.com.au";

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${baseUrl}/products/${product.slug}#product`,
    name: product.name,
    image: (product.images ?? []).map(getImageSrc),
    description: product.description,
    sku: product.id.toString(),
    brand: {
      "@type": "Brand",
      name: "Duckaroo Brisbane",
      description:
        "Brisbane's premier aquatic plant and aquarium supply specialist",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Duckaroo Brisbane",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brisbane",
        addressRegion: "QLD",
        addressCountry: "AU",
      },
    },
    offers: {
      "@type": "Offer",
      "@id": `${baseUrl}/products/${product.slug}#offer`,
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "AUD",
      price: product.price.toString(),
      priceSpecification: {
        "@type": "PriceSpecification",
        price: product.price.toString(),
        priceCurrency: "AUD",
        valueAddedTaxIncluded: true,
      },
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      validFrom: "2024-01-01",
      priceValidUntil: "2026-12-31",
      acceptedPaymentMethod: [
        "http://purl.org/goodrelations/v1#PayPal",
        "http://purl.org/goodrelations/v1#ByBankTransferInAdvance",
        "http://purl.org/goodrelations/v1#ByInvoice",
      ],
      seller: {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "Duckaroo - Swan Design Aquatic Center",
        url: baseUrl,
        logo: `${baseUrl}/swan-favicon.png`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Brisbane",
          addressRegion: "QLD",
          addressCountry: "AU",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          areaServed: "AU",
        },
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "AUD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AU",
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
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "AU",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.reviews?.rating || "4.5",
      reviewCount: product.reviews?.count || "1",
      bestRating: "5",
      worstRating: "1",
    },
    review:
      product.reviews?.individual?.map((review, index) => ({
        "@type": "Review",
        "@id": `${baseUrl}/products/${product.slug}#review${index + 1}`,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating.toString(),
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewBody: review.text,
        datePublished: review.date,
      })) || [],
    category: product.category,
    ...(product.category === "plants" && {
      additionalType: "LivePlant",
      isLivingThing: true,
    }),
    additionalProperty: [
      ...Object.entries(product.specifications).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: key,
        value: value,
      })),
      {
        "@type": "PropertyValue",
        name: "Shipping Coverage",
        value: "Australia Wide",
      },
      {
        "@type": "PropertyValue",
        name: "Live Arrival Guarantee",
        value: "Yes",
      },
      {
        "@type": "PropertyValue",
        name: "Origin",
        value: "Brisbane, Queensland, Australia",
      },
    ],
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name:
          product.category.charAt(0).toUpperCase() + product.category.slice(1),
        item: `${baseUrl}/products?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${baseUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getStockItemBySlug(slug);

  if (!product) {
    notFound();
  }

  let relatedProducts = [];
  try {
    relatedProducts = await getRelatedStockItems(product.category, product.id, 3);
  } catch (error) {
    console.error("Failed to load related products:", error);
  }

  return (
    <>
      <ProductStructuredData product={product} />
      <ProductPageContent product={product} relatedProducts={relatedProducts} />
    </>
  );
}
