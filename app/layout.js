import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import LazyAnalytics from "./components/LazyAnalytics";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata = {
  title:
    "Fish Tank Cleaning Service Brisbane & Gold Coast | Professional Aquarium Maintenance | Duckaroo",
  description:
    "Duckaroo provides professional fish tank cleaning, aquarium maintenance, pond cleaning, and tank setup across Brisbane and Gold Coast, Queensland. Same-day service available. Call (04) 5766 3939.",
  keywords:
    "fish tank cleaning service, aquarium maintenance Brisbane, fish tank cleaning Brisbane, aquarium cleaning Gold Coast, pond cleaning Brisbane, tank setup Brisbane, aquarium specialists Queensland",
  authors: [{ name: "Duckaroo Brisbane" }],
  creator: "Duckaroo",
  publisher: "Duckaroo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aquaticswandesign.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Fish Tank Cleaning Service Brisbane & Gold Coast | Duckaroo",
    description:
      "Professional fish tank cleaning, aquarium maintenance, pond cleaning and tank setup across Brisbane & Gold Coast. Same-day service available.",
    url: "https://aquaticswandesign.com.au",
    siteName: "Duckaroo",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg?v=2",
        width: 1200,
        height: 630,
        alt: "Duckaroo - Professional Fish Tank Cleaning Service Brisbane & Gold Coast",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fish Tank Cleaning Service Brisbane & Gold Coast | Duckaroo",
    description:
      "Professional fish tank cleaning, aquarium maintenance, and pond services across Brisbane & Gold Coast. Same-day service available.",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg?v=2",
        alt: "Duckaroo - Professional Fish Tank Cleaning Service Brisbane & Gold Coast",
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
  category: "business",
  classification: "Aquarium Services",
  coverage: "Brisbane, Gold Coast, Queensland, Australia",
  distribution: "global",
  rating: "general",
  referrer: "origin-when-cross-origin",
  "apple-mobile-web-app-capable": "yes",
  "apple-mobile-web-app-status-bar-style": "default",
  "apple-mobile-web-app-title": "Duckaroo",
  "application-name": "Duckaroo",
  "msapplication-TileColor": "#0f172a",
  "theme-color": "#0f172a",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  // Merged geo + business contact meta (duplicate "other" key bug fixed)
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251",
    ICBM: "-27.4698, 153.0251",
    "business:contact_data:street_address": "Brisbane, QLD",
    "business:contact_data:locality": "Brisbane",
    "business:contact_data:region": "Queensland",
    "business:contact_data:postal_code": "4000",
    "business:contact_data:country_name": "Australia",
    "business:contact_data:email": "aquaticswandesign@gmail.com",
    "business:contact_data:phone_number": "+61457663939",
    "business:contact_data:website": "https://aquaticswandesign.com.au",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <head>
        {/* Critical resource hints for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Font optimization handled by Next.js font system */}

        {/* WebSite Schema with SearchAction for Sitelinks Searchbox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://aquaticswandesign.com.au/#website",
              url: "https://aquaticswandesign.com.au",
              name: "Duckaroo",
              description:
                "Professional fish tank cleaning, aquarium maintenance, and pond services across Brisbane and Gold Coast, Queensland.",
              publisher: {
                "@id": "https://aquaticswandesign.com.au/#organization",
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
              inLanguage: "en-AU",
            }),
          }}
        />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://aquaticswandesign.com.au/#organization",
              name: "Duckaroo",
              alternateName: "Duckaroo Fish Tank Cleaning Service",
              description:
                "Duckaroo is Brisbane and Gold Coast's professional fish tank cleaning and aquarium maintenance service. We serve residential and commercial clients across Brisbane, Gold Coast, Logan, and Ipswich, Queensland.",
              url: "https://aquaticswandesign.com.au",
              telephone: "+61457663939",
              email: "aquaticswandesign@gmail.com",
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
              ],
              serviceType: [
                "Fish Tank Cleaning",
                "Aquarium Maintenance",
                "Pond Cleaning",
                "Tank Removal",
                "Aquarium Setup",
              ],
              priceRange: "$$",
              currenciesAccepted: "AUD",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              openingHours: "Mo-Su 08:00-18:00",
              image: [
                "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg?v=2",
              ],
              sameAs: [
                "https://www.facebook.com/aquaticswandesign",
                "https://www.instagram.com/aquatic_swan_design/",
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
                    name: "Sarah M.",
                  },
                  reviewBody:
                    "Excellent service! They transformed our tank completely. Professional, reliable, and great value.",
                },
              ],
            }),
          }}
        />

        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Fish Tank Cleaning Service",
              provider: {
                "@type": "LocalBusiness",
                "@id": "https://aquaticswandesign.com.au/#organization",
              },
              areaServed: {
                "@type": "State",
                name: "Queensland",
                containsPlace: [
                  {
                    "@type": "City",
                    name: "Brisbane",
                  },
                  {
                    "@type": "City",
                    name: "Gold Coast",
                  },
                  {
                    "@type": "City",
                    name: "Logan",
                  },
                  {
                    "@type": "City",
                    name: "Ipswich",
                  },
                ],
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Aquarium & Fish Tank Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Fish Tank Cleaning",
                      description:
                        "Professional fish tank cleaning and aquarium maintenance for residential and commercial clients in Brisbane and Gold Coast",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Tank Removal",
                      description:
                        "Safe and professional aquarium tank removal service in Brisbane and Gold Coast",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Pond Cleaning",
                      description:
                        "Expert pond cleaning and maintenance service",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Aquarium Setup",
                      description:
                        "Complete aquarium setup and installation service",
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* Additional Meta Tags */}
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />

      </head>
      <body className={`${jost.className} ${jost.variable} ${cormorant.variable}`}>
        <LazyAnalytics />
        {children}
      </body>
    </html>
  );
}
