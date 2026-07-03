"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import analytics components only when needed
const GoogleTagManager = dynamic(
  () =>
    import("@next/third-parties/google").then((mod) => mod.GoogleTagManager),
  { ssr: false }
);

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

export default function LazyAnalytics() {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);

  useEffect(() => {
    let timeoutId;
    let hasInteracted = false;

    // Load analytics after user interaction (scroll, click, touch)
    const handleUserInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        setShouldLoadAnalytics(true);
        cleanup();
      }
    };

    // Load analytics after critical rendering is complete (fallback)
    const loadAfterDelay = () => {
      timeoutId = setTimeout(() => {
        if (!hasInteracted) {
          setShouldLoadAnalytics(true);
        }
      }, 3000); // 3 seconds delay for mobile optimization
    };

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleUserInteraction, {
        passive: true,
      });
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    // Add event listeners for user interaction
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    // Start the delay timer
    loadAfterDelay();

    return cleanup;
  }, []);

  // Only render analytics components after trigger conditions are met
  if (!shouldLoadAnalytics) {
    return null;
  }

  return (
    <>
      <GoogleTagManager gtmId="GTM-NQQBXXPZ" />
      <GoogleAnalytics gaId="G-DMVQ6Y0D0S" />
    </>
  );
}
