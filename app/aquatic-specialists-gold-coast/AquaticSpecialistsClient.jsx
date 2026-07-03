"use client";
import { useState, useEffect, useRef } from "react";
import AquaticSpecialistsBanner from "./components/AquaticSpecialistsBanner";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  const videoRef = useRef(null);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setShowPlayButton(false);
        })
        .catch(() => {
          setShowPlayButton(true);
        });
    }
  };

  useEffect(() => {
    // Delay loading heavy components until after LCP
    const componentTimer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 2000);

    // Try to play video immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setShowPlayButton(true);
      });
    }

    return () => {
      clearTimeout(componentTimer);
    };
  }, []);

  return (
    <>
      {/* Fallback Dark Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-30"
        style={{ minWidth: "100vw", minHeight: "100vh" }}
      />

      {/* Background Video - Desktop Only for Performance */}
      <div className="hidden md:block">
        <video
          ref={videoRef}
          aria-hidden="true"
          className="fixed top-0 left-0 w-full h-full object-cover -z-20"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            minWidth: "100vw",
            minHeight: "100vh",
          }}
          autoPlay
          muted
          playsInline
          loop
          preload="none"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23334155'/%3E%3C/svg%3E"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setShowPlayButton(true)}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => setShowPlayButton(true));
            }
          }}
        >
          <source
            src="https://res.cloudinary.com/dhvj8x2nq/video/upload/q_auto:good,w_1280,h_720/v1739712678/koifish_feh63y.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Mobile Static Background - Blue Ocean Theme */}
      <div
        className="md:hidden fixed top-0 left-0 w-full h-full -z-20"
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0a1628 0%, #0c1f4a 25%, #1e3a8a 50%, #1e40af 75%, #1d4ed8 100%)",
        }}
      />

      {/* Video Play Button for Desktop Only */}
      {showPlayButton && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 hidden md:block">
          <Button
            onClick={handleVideoPlay}
            size="lg"
            aria-label="Play background video"
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white shadow-2xl"
          >
            <Play className="h-8 w-8 ml-1" aria-hidden="true" />
            <span className="sr-only">Play background video</span>
          </Button>
        </div>
      )}

      {/* Dark overlay for better text readability */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/30 -z-10"
        style={{ minWidth: "100vw", minHeight: "100vh" }}
      />

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
