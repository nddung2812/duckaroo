"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getVideoUrl } from "./mediaUtils";

// Self-contained gallery lightbox shared by the homepage "Customer Success
// Stories" section and the /customer-stories page.
// - Instant navigation (no artificial transition lock)
// - Preloads neighbouring images so next/prev feels snappy
// - Fits the image to its natural aspect (no forced letterboxing)
export default function MediaLightbox({ project, startIndex = 0, onClose }) {
  const media = project.media;
  const count = media.length;

  const [currentMediaIndex, setCurrentMediaIndex] = useState(startIndex);
  const [direction, setDirection] = useState("next"); // drives slide direction
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseStart, setMouseStart] = useState(null);
  const [mouseEnd, setMouseEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const moveThrottle = useRef(0);

  // Sync when opened from a different thumbnail / project
  useEffect(() => {
    setCurrentMediaIndex(startIndex);
  }, [startIndex, project]);

  const nextMedia = useCallback(() => {
    setDirection("next");
    setCurrentMediaIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
  }, [count]);

  const prevMedia = useCallback(() => {
    setDirection("prev");
    setCurrentMediaIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  }, [count]);

  // Warm the cache for the adjacent slides
  useEffect(() => {
    if (count < 2) return;
    const neighbours = [
      media[(currentMediaIndex + 1) % count],
      media[(currentMediaIndex - 1 + count) % count],
    ];
    neighbours.forEach((m) => {
      const url = m?.type === "video" ? m.thumbnail : m?.url;
      if (!url) return;
      const img = new window.Image();
      img.src = url;
    });
  }, [currentMediaIndex, media, count]);

  // --- Touch (swipe) ---
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (e.timeStamp - moveThrottle.current < 16) return; // ~60fps
    moveThrottle.current = e.timeStamp;
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextMedia();
    else if (distance < -50) prevMedia();
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextMedia, prevMedia]);

  // --- Mouse (drag) ---
  const onMouseDown = useCallback((e) => {
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      if (e.timeStamp - moveThrottle.current < 16) return;
      moveThrottle.current = e.timeStamp;
      setMouseEnd(e.clientX);
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    if (!isDragging) return;
    if (mouseStart !== null && mouseEnd !== null) {
      const distance = mouseStart - mouseEnd;
      if (distance > 50) nextMedia();
      else if (distance < -50) prevMedia();
    }
    setIsDragging(false);
    setMouseStart(null);
    setMouseEnd(null);
  }, [isDragging, mouseStart, mouseEnd, nextMedia, prevMedia]);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
    setMouseStart(null);
    setMouseEnd(null);
  }, []);

  // --- Keyboard ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMedia();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMedia();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextMedia, prevMedia, onClose]);

  const current = media[currentMediaIndex];

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-cream hover:text-amber-glow transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation */}
        {count > 1 && (
          <>
            <button
              onClick={prevMedia}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-cream hover:text-amber-glow transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextMedia}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-cream hover:text-amber-glow transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Media */}
        <div
          className="flex items-center justify-center select-none overflow-hidden"
          style={{ minHeight: "40vh" }}
        >
          <div
            key={currentMediaIndex}
            className={`flex w-full items-center justify-center animate-in fade-in zoom-in-95 duration-300 ease-out ${
              direction === "prev"
                ? "slide-in-from-left-10"
                : "slide-in-from-right-10"
            }`}
          >
            {current.type === "video" ? (
              <video
                src={getVideoUrl(current.url)}
                controls
                autoPlay
                muted
                playsInline
                poster={current.thumbnail}
                className="w-auto h-auto max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={current.url}
                alt={`${project.name} - Media ${currentMediaIndex + 1}`}
                width={1600}
                height={1200}
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
                className="w-auto h-auto max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-b-2xl">
          <h3 className="font-display text-parchment font-medium text-lg">{project.name}</h3>
          <p className="text-cream/70">
            {current.type === "video" ? "📹 Video" : "📸 Image"}{" "}
            {currentMediaIndex + 1} of {count}
          </p>
          {count > 1 && (
            <p className="text-cream/50 text-xs mt-2">
              Swipe, drag, or use arrow keys to navigate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
