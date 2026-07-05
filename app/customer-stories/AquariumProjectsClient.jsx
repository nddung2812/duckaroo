"use client";
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, Eye, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "./clientdata";
import MediaLightbox from "./MediaLightbox";
import { getThumbUrl } from "./mediaUtils";
import PageAmbience from "../components/PageAmbience";

// Thumbnails rendered inline per card; the rest open in the lightbox.
const MAX_THUMBS = 4;

export default function AquariumProjectsClient() {
  const [lightbox, setLightbox] = useState(null); // { project, index }

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

  return (
    <>
      <PageAmbience />

      <div className="min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="relative pt-28 pb-12 md:py-20 px-4">
          <div className="relative max-w-7xl mx-auto text-center">
            <Badge className="mb-6 bg-moss/60 border-amber-glow/40 text-amber-glow">
              Real Results From Brisbane & Gold Coast&apos;s #1 Fish Tank
              Service
            </Badge>

            <h1 className="font-display text-4xl md:text-6xl font-medium text-parchment mb-6">
              Customer Success Stories
            </h1>

            <p className="text-xl text-cream/80 max-w-3xl mx-auto mb-8">
              See the stunning transformations and professional results from our
              expert
              <strong className="text-amber-glow">
                {" "}
                fish tank cleaning service
              </strong>{" "}
              across Brisbane. From emergency rescues to luxury installations,
              discover why customers trust
              <strong className="text-amber-glow">
                {" "}
                Duckaroo&apos;s professional aquarium maintenance
              </strong>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] px-8 py-3"
              >
                <Link href="/service">Get Your Free Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-cream/30 text-cream/90 rounded-full bg-transparent hover:border-cream/60 hover:bg-cream/5 text-[13px] uppercase tracking-[0.14em] px-8 py-3"
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
              <h2 className="font-display text-3xl md:text-4xl font-medium text-parchment mb-4">
                Our Success Stories
              </h2>
              <p className="text-cream/70 max-w-2xl mx-auto">
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
                  className="group bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:bg-cream/10 hover:border-amber-glow/50 transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Project Header */}
                    <div className="p-6 pb-4">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-display text-xl font-medium text-parchment mb-2 group-hover:text-amber-glow transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-cream/70 mb-2">
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
                            <span className="text-cream/70 text-sm ml-2">
                              {project.client}
                            </span>
                          </div>
                        </div>

                        <Badge className="bg-moss/60 border-amber-glow/40 text-amber-glow">
                          {project.type}
                        </Badge>
                      </div>

                      <p className="text-cream/80 text-sm mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-cream/20 text-cream/75 hover:border-amber-glow/50 hover:text-amber-glow transition-colors"
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
                              <Badge className="bg-black/50 backdrop-blur-sm border-cream/20 text-cream text-xs">
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
                                        <span className="text-cream text-lg font-semibold">
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
        <section className="py-16 px-4 bg-moss/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-medium text-parchment mb-6">
              Ready to Transform Your Aquarium?
            </h2>
            <p className="text-xl text-cream/80 mb-8">
              Join hundreds of satisfied Brisbane & Gold Coast customers who
              trust our professional fish tank cleaning and maintenance
              services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] px-8 py-3"
              >
                <Link href="/service">Book Your Service</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-cream/30 text-cream/90 rounded-full bg-transparent hover:border-cream/60 hover:bg-cream/5 text-[13px] uppercase tracking-[0.14em] px-8 py-3"
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
