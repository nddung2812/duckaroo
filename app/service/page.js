"use client";
import { useState, useEffect } from "react";
import ServiceBanner from "./serviceComponents/banner";
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

export default function Service() {
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
      {/* Shared fixed backdrop */}
      <PageAmbience />

      {/* Navigation - Load immediately for LCP */}
      <Navbar />

      {/* Main Content - Critical for LCP */}
      <div className="min-h-screen relative overflow-x-hidden w-full max-w-[2560px] mx-auto">
        <main
          className="relative z-10 w-full overflow-x-hidden"
          itemScope
          itemType="https://schema.org/ProfessionalService"
        >
          <ServiceBanner />
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
    </>
  );
}
