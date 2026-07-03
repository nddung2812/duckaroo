"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, Eye, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "./clientdata";
import MediaLightbox from "./MediaLightbox";
import { getThumbUrl } from "./mediaUtils";

// Thumbnails rendered inline per card; the rest open in the lightbox.
const MAX_THUMBS = 4;

export default function AquariumProjectsClient() {
  const [lightbox, setLightbox] = useState(null); // { project, index }
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

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
    // Try to play video immediately
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setShowPlayButton(true);
      });
    }
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
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
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

      {/* Video Play Button Overlay - Shows if autoplay fails */}
      {showPlayButton && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm">
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

      <div className="min-h-screen relative">
        {/* Hero Section */}
        <section className="relative pt-28 pb-12 md:py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-teal-900/20"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-500/30 border-emerald-400 text-emerald-100">
              Real Results From Brisbane & Gold Coast&apos;s #1 Fish Tank
              Service
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Customer Success Stories
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              See the stunning transformations and professional results from our
              expert
              <strong className="text-emerald-300">
                {" "}
                fish tank cleaning service
              </strong>{" "}
              across Brisbane. From emergency rescues to luxury installations,
              discover why customers trust
              <strong className="text-emerald-300">
                {" "}
                Duckaroo&apos;s professional aquarium maintenance
              </strong>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3"
              >
                <Link href="/service">Get Your Free Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              >
                <Link href="/contact">Contact Our Experts</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Projects Gallery */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Success Stories
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Browse our portfolio of successful aquarium projects across
                Brisbane. Each project showcases our commitment to excellence in
                fish tank cleaning and maintenance.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-emerald-400/50 transition-all duration-300 overflow-hidden"
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

                    {/* Image Gallery - Dynamic Grid Layout */}
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
                                className={`${
                                  project.media[0].type === "video"
                                    ? "w-5 h-5"
                                    : "w-6 h-6"
                                } text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
                                mediaIndex === MAX_THUMBS - 1 && hiddenCount > 0;
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

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Aquarium?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of satisfied Brisbane & Gold Coast customers who
              trust our professional fish tank cleaning and maintenance
              services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3"
              >
                <Link href="/service">Book Your Service</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              >
                <Link href="/contact">Call (04) 5766 3939</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightbox && (
          <MediaLightbox
            project={lightbox.project}
            startIndex={lightbox.index}
            onClose={closeLightbox}
          />
        )}
      </div>
    </>
  );
}
