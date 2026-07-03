"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import HomeBanner from "./components/HomeBanner";
import ServiceBookingSection from "./components/ServiceBookingSection";
import Navbar from "./components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, MapPin, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getFavorites } from "./utils/favorites";
import { projects } from "./customer-stories/clientdata";
import { getThumbUrl } from "./customer-stories/mediaUtils";
import { partners } from "../data/partners";

// Thumbnails rendered inline per card; the rest open in the lightbox.
const MAX_THUMBS = 4;

// Lazy load heavy components to improve LCP

const Duckweeds = dynamic(() => import("./components/Duckweeds"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("./components/Footer"), {
  ssr: false,
  loading: () => null,
});

// Only loaded when the user opens them
const MediaLightbox = dynamic(() => import("./customer-stories/MediaLightbox"), {
  ssr: false,
  loading: () => null,
});

const FavoritesPopup = dynamic(() => import("./components/FavoritesPopup"), {
  ssr: false,
  loading: () => null,
});

const Home = ({ featuredProducts = [] }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { project, index }

  const videoRef = useRef(null);

  const openLightbox = (project, mediaIndex) => {
    setLightbox({ project, index: mediaIndex });
  };

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      timeZone: "Australia/Brisbane",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
    // Use requestIdleCallback for non-critical component loading
    const componentTimer = window.requestIdleCallback
      ? window.requestIdleCallback(
          () => {
            setComponentsLoaded(true);
          },
          { timeout: 1000 }
        )
      : setTimeout(() => {
          setComponentsLoaded(true);
        }, 500);

    // Check for favorites and show popup after components load
    const favoritesTimer = setTimeout(() => {
      window.requestIdleCallback
        ? window.requestIdleCallback(
            () => {
              const favorites = getFavorites();
              if (favorites.length > 0) {
                setShowFavoritesPopup(true);
              }
            },
            { timeout: 2000 }
          )
        : setTimeout(() => {
            const favorites = getFavorites();
            if (favorites.length > 0) {
              setShowFavoritesPopup(true);
            }
          }, 100);
    }, 3000);

    // Start the background video only once the browser is idle so it never
    // competes with LCP-critical resources for bandwidth.
    const startVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          setShowPlayButton(true);
        });
      }
    };
    const videoTimer = window.requestIdleCallback
      ? window.requestIdleCallback(startVideo, { timeout: 2500 })
      : setTimeout(startVideo, 1500);

    return () => {
      if (window.requestIdleCallback) {
        window.cancelIdleCallback(componentTimer);
        window.cancelIdleCallback(videoTimer);
      } else {
        clearTimeout(componentTimer);
        clearTimeout(videoTimer);
      }
      clearTimeout(favoritesTimer);
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
          muted
          playsInline
          loop
          preload="none"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23334155'/%3E%3C/svg%3E"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setShowPlayButton(true)}
        >
          <source src="https://res.cloudinary.com/dhvj8x2nq/video/upload/f_auto,q_auto:eco,w_960/v1739712678/koifish_feh63y.mp4" />
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
        <main className="relative z-10 w-full overflow-x-hidden">
          <HomeBanner featuredProducts={featuredProducts} />
          <ServiceBookingSection />

          {/* Partners Section */}
          {partners.length > 0 && (
            <section className="w-full px-4 py-16 relative">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Our Regular Customers
                  </h2>
                  <p className="text-white/60 max-w-xl mx-auto text-sm">
                    Trusted businesses we regularly service across Brisbane &
                    Gold Coast.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                  {partners.map((partner) => (
                    <a
                      key={partner.id}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-emerald-400/50 transition-all duration-300"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logo.replace(
                            "/upload/",
                            "/upload/f_auto,q_auto,w_160,h_160,c_fit/"
                          )}
                          alt={`${partner.name} logo`}
                          width={96}
                          height={96}
                          loading="lazy"
                          className="object-contain w-full h-full filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <span className="inline-flex items-center justify-center w-full text-white/80 group-hover:text-white text-xs font-semibold px-2 py-1.5 text-center transition-colors duration-300 min-h-[2rem]">
                        {partner.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Customer Success Stories Section */}
          <section
            id="customer-success-stories"
            className="w-full px-4 py-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Customer Success Stories
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Browse our portfolio of successful aquarium projects across
                  Brisbane & Gold Coast. Each project showcases our commitment
                  to excellence in fish tank cleaning and maintenance.
                </p>
              </div>

              {/* Projects Grid - Show first 5 projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.slice(0, 5).map((project) => (
                  <Card
                    key={project.id}
                    className="group bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-emerald-400/60 transition-all duration-300 overflow-hidden shadow-xl"
                  >
                    <CardContent className="p-0">
                      {/* Project Header */}
                      <div className="p-6 pb-4">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                              {project.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(project.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {project.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(project.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <span className="text-white/70 text-sm ml-2">
                                {project.client}
                              </span>
                            </div>
                          </div>

                          <Badge className="bg-blue-500/20 border-blue-400 text-blue-200">
                            {project.type}
                          </Badge>
                        </div>

                        <p className="text-white/80 text-sm mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-white/20 text-white/70 hover:border-emerald-400/50 hover:text-emerald-300 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Image Gallery */}
                      <div className="p-6 pt-0">
                        {/* Hero Image - Full Width Landscape */}
                        <div className="mb-3">
                          <div
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => openLightbox(project, 0)}
                          >
                            <div className="relative aspect-[16/9] w-full">
                              <Image
                                src={getThumbUrl(project.media[0])}
                                alt={`${project.name} - Main Image`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                              {/* Video Play Button Overlay */}
                              {project.media[0].type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 group-hover:bg-black/80 transition-all duration-300">
                                    <Play className="w-12 h-12 text-white fill-white" />
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                <Eye
                                  className={
                                    project.media[0].type === "video"
                                      ? "w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                      : "w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  }
                                />
                              </div>
                              {/* Main Image Badge */}
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-black/50 backdrop-blur-sm border-white/20 text-white text-xs">
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Media Grid - capped; the rest open in the lightbox */}
                        {project.media.length > 1 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {project.media
                              .slice(1, 1 + MAX_THUMBS)
                              .map((media, mediaIndex) => {
                                const absoluteIndex = mediaIndex + 1;
                                const hiddenCount =
                                  project.media.length - 1 - MAX_THUMBS;
                                const showMoreOverlay =
                                  mediaIndex === MAX_THUMBS - 1 &&
                                  hiddenCount > 0;
                                return (
                                  <div key={absoluteIndex} className="relative">
                                    <div
                                      className="relative aspect-square w-full group cursor-pointer overflow-hidden rounded-lg"
                                      onClick={() =>
                                        openLightbox(project, absoluteIndex)
                                      }
                                    >
                                      <Image
                                        src={getThumbUrl(media)}
                                        alt={`${project.name} - Media ${
                                          absoluteIndex + 1
                                        }`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 16vw, 12vw"
                                      />

                                      {/* Video Play Button Overlay */}
                                      {media.type === "video" &&
                                        !showMoreOverlay && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 group-hover:bg-black/80 transition-all duration-300">
                                              <Play className="w-6 h-6 text-white fill-white" />
                                            </div>
                                          </div>
                                        )}

                                      {showMoreOverlay ? (
                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center">
                                          <span className="text-white text-lg font-semibold">
                                            +{hiddenCount} more
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                          <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
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

      {/* Favorites Popup */}
      {showFavoritesPopup && (
        <FavoritesPopup
          isOpen={showFavoritesPopup}
          onClose={() => setShowFavoritesPopup(false)}
        />
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <MediaLightbox
          project={lightbox.project}
          startIndex={lightbox.index}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default Home;
