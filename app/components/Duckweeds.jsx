"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const duckweedsm2 =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/duckweedsmall2_kpmuqa";
const duckweedmd =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/duckweedmedium_qozes9";
const duckweedsm =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/duckweedsmall_b6zyy2";

const Duckweeds = () => {
  const [duckweeds, setDuckweeds] = useState([]);

  // Generate random duckweeds on mount
  useEffect(() => {
    const generateDuckweeds = () => {
      const images = [duckweedsm, duckweedmd, duckweedsm2];
      const sizes = [
        { w: "w-4", h: "h-8" },
        { w: "w-5", h: "h-10" },
        { w: "w-6", h: "h-12" },
        { w: "w-7", h: "h-14" },
        { w: "w-8", h: "h-16" },
        { w: "w-10", h: "h-20" },
        { w: "w-12", h: "h-24" },
      ];

      const newDuckweeds = [];

      // Generate 8 random duckweeds
      for (let i = 0; i < 8; i++) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const startX = Math.random() * 100; // Random X position (0-100vw)
        const startY = Math.random() * 100; // Random Y position (0-100vh)
        const animationDuration = 80 + Math.random() * 40; // 80-120 seconds (slower but still visible)
        const animationDelay = Math.random() * 10; // 0-10 seconds delay
        const opacity = 0.85 + Math.random() * 0.15; // 0.85-1.0 opacity (increased from 0.7-1.0)
        const rotation = Math.random() * 360; // Random initial rotation

        newDuckweeds.push({
          id: i,
          src: randomImage,
          size: randomSize,
          startX,
          startY,
          duration: animationDuration,
          delay: animationDelay,
          opacity,
          rotation,
          animationType: Math.random() > 0.5 ? "float-random" : "drift-gentle",
        });
      }

      setDuckweeds(newDuckweeds);
    };

    generateDuckweeds();
  }, []);

  return (
    <>
      {/* Dynamically generated duckweeds */}
      {duckweeds.map((duckweed) => (
        <Image
          key={duckweed.id}
          className={`absolute ${duckweed.size.w} ${duckweed.size.h} object-contain z-10 pointer-events-none duckweed-glow`}
          alt="floating aquatic element"
          src={duckweed.src}
          width={300}
          height={300}
          style={{
            left: `${duckweed.startX}vw`,
            top: `${duckweed.startY}vh`,
            opacity: duckweed.opacity,
            transform: `rotate(${duckweed.rotation}deg)`,
            animation: `${duckweed.animationType} ${duckweed.duration}s linear infinite ${duckweed.delay}s`,
          }}
        />
      ))}

      {/* Enhanced static elements for guaranteed visibility */}
      <Image
        className="absolute top-[10vh] left-[5vw] w-8 h-16 object-contain z-10 opacity-95 duckweed-glow pointer-events-none"
        alt="floating aquatic element"
        src={duckweedmd}
        width={300}
        height={300}
        style={{
          animation: "float-showcase 90s ease-in-out infinite",
        }}
      />

      <Image
        className="absolute top-[20vh] right-[10vw] w-6 h-12 object-contain z-10 opacity-90 duckweed-glow pointer-events-none"
        alt="floating aquatic element"
        src={duckweedsm}
        width={300}
        height={300}
        style={{
          animation: "drift-diagonal 100s linear infinite 2s",
        }}
      />

      <Image
        className="absolute bottom-[20vh] left-[15vw] w-10 h-20 object-contain z-10 opacity-95 duckweed-glow pointer-events-none"
        alt="floating aquatic element"
        src={duckweedmd}
        width={300}
        height={300}
        style={{
          animation: "float-upward 110s ease-in-out infinite 1s",
        }}
      />

      <Image
        className="absolute top-[60vh] right-[25vw] w-5 h-10 object-contain z-10 opacity-92 duckweed-glow pointer-events-none"
        alt="floating aquatic element"
        src={duckweedsm2}
        width={300}
        height={300}
        style={{
          animation: "spin-float 95s linear infinite 3s",
        }}
      />

      <style jsx>{`
        @keyframes float-random {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
          }
          20% {
            transform: translateX(-30vw) translateY(15vh) rotate(72deg)
              scale(1.1);
          }
          40% {
            transform: translateX(40vw) translateY(-20vh) rotate(144deg)
              scale(0.9);
          }
          60% {
            transform: translateX(-20vw) translateY(25vh) rotate(216deg)
              scale(1.2);
          }
          80% {
            transform: translateX(60vw) translateY(-10vh) rotate(288deg)
              scale(0.8);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(360deg) scale(1);
          }
        }

        @keyframes drift-gentle {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(25vw) translateY(20vh) rotate(90deg);
          }
          50% {
            transform: translateX(-15vw) translateY(40vh) rotate(180deg);
          }
          75% {
            transform: translateX(35vw) translateY(60vh) rotate(270deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(360deg);
          }
        }

        @keyframes float-showcase {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          33% {
            transform: translateX(70vw) translateY(30vh) rotate(120deg);
          }
          66% {
            transform: translateX(20vw) translateY(60vh) rotate(240deg);
          }
        }

        @keyframes drift-diagonal {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          50% {
            transform: translateX(-80vw) translateY(50vh) rotate(180deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(360deg);
          }
        }

        @keyframes float-upward {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateX(30vw) translateY(-40vh) rotate(90deg)
              scale(1.1);
          }
          50% {
            transform: translateX(60vw) translateY(-20vh) rotate(180deg)
              scale(0.9);
          }
          75% {
            transform: translateX(90vw) translateY(-60vh) rotate(270deg)
              scale(1.2);
          }
        }

        @keyframes spin-float {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          100% {
            transform: translateX(-100vw) translateY(-30vh) rotate(720deg);
          }
        }

        /* Add a subtle glow effect to make them more visible */
        .duckweed-glow {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
        }
      `}</style>
    </>
  );
};

export default Duckweeds;
