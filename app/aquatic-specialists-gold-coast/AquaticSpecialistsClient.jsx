"use client";
import { useState, useEffect } from "react";
import AquaticSpecialistsBanner from "./components/AquaticSpecialistsBanner";
import Navbar from "../components/Navbar";
import PageAmbience from "../components/PageAmbience";
import dynamic from "next/dynamic";

// Lazy load heavy components to improve LCP
const Duckweeds = dynamic(() => import("../components/Duckweeds"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
  loading: () => null,
});

export default function AquaticSpecialistsClient() {
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    // Delay loading heavy components until after LCP
    const componentTimer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(componentTimer);
    };
  }, []);

  return (
    <>
      {/* Shared aquatic backdrop */}
      <PageAmbience />

      {/* Navigation - Load immediately for LCP */}
      <Navbar />

      {/* Main Content - Critical for LCP */}
      <div className="min-h-screen relative overflow-x-hidden w-full max-w-[2560px] mx-auto">
        <main
          className="relative z-10 w-full overflow-x-hidden"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <AquaticSpecialistsBanner />
        </main>
      </div>

      {/* Heavy components - Load after LCP */}
      {componentsLoaded && (
        <>
          {/* Floating Elements - Desktop only */}
          <div className="hidden xl:block">
            <Duckweeds />
          </div>

          {/* Footer */}
          <Footer />
        </>
      )}

      {/* Structured Data for Gold Coast Aquatic Specialists */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id":
              "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast#business",
            name: "Duckaroo Aquatic Specialists Gold Coast",
            alternateName: "Gold Coast Aquatic Specialists",
            description:
              "Professional aquatic specialists serving Gold Coast with expert fish tank cleaning, pond maintenance, and aquarium services. 15+ years experience with same-day service available.",
            url: "https://aquaticswandesign.com.au/aquatic-specialists-gold-coast",
            telephone: "+61457663939",
            email: "aquaticswandesign@gmail.com",
            priceRange: "$80-$400",
            currenciesAccepted: "AUD",
            paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Gold Coast",
              addressRegion: "QLD",
              addressCountry: "AU",
              areaServed: "Gold Coast",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -28.0167,
              longitude: 153.4,
            },
            areaServed: [
              {
                "@type": "City",
                name: "Gold Coast",
                "@id": "https://en.wikipedia.org/wiki/Gold_Coast,_Queensland",
              },
              {
                "@type": "Place",
                name: "Southport",
              },
              {
                "@type": "Place",
                name: "Surfers Paradise",
              },
              {
                "@type": "Place",
                name: "Broadbeach",
              },
              {
                "@type": "Place",
                name: "Burleigh Heads",
              },
              {
                "@type": "Place",
                name: "Coolangatta",
              },
            ],
            serviceType: "Aquatic Specialists",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Gold Coast Aquatic Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Fish Tank Cleaning Gold Coast",
                    description:
                      "Professional aquarium cleaning and maintenance services",
                  },
                  areaServed: "Gold Coast",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pond Maintenance Gold Coast",
                    description:
                      "Complete pond cleaning and maintenance solutions",
                  },
                  areaServed: "Gold Coast",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Aquarium Setup Gold Coast",
                    description:
                      "Professional aquarium installation and setup services",
                  },
                  areaServed: "Gold Coast",
                },
              ],
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "247",
              bestRating: "5",
              worstRating: "1",
            },
            openingHours: "Mo-Su 08:00-18:00",
            sameAs: [
              "https://www.google.com/maps/place/Gold+Coast+QLD",
              "https://www.facebook.com/aquaticswandesign",
            ],
          }),
        }}
      />
    </>
  );
}
