"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./home.module.css";

const Footer = dynamic(() => import("./components/Footer"), {
  ssr: false,
  loading: () => null,
});

const LOGO =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl";
const ROCK_CENTER =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783253120/Rock-Center-HD_kzxg0g.png";
const ROCK_BOTTOM_LEFT =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783237487/Rock-bottom-left_diuj3o.png";
const ROCK_BOTTOM_RIGHT =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783253867/Rock-bottom-right_igegjy.png";
const ROCK_FLOATING =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783237486/floating-rock_zvbbxe.png";
const RHINO =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783241985/Rhino_nobg_wjxfsr.png";
const TREX =
  "https://res.cloudinary.com/dhvj8x2nq/image/upload/v1783241984/Trex_nobg_t0clwt.png";

const NAV_LINKS = [
  { href: "#worlds", label: "Worlds" },
  { href: "/products", label: "Products" },
  { href: "/service", label: "Service" },
  { href: "/customer-stories", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

const WORLDS = [
  {
    name: "Emerald Grove",
    meta: "Planted ecosystem · North Brisbane",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757335537/bucephalandra_bush_oyiznj",
    mask: styles.worldMask1,
  },
  {
    name: "The Guardian",
    meta: "Custom installation · Brisbane clinic",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1781524812/Guardian_after_crgvbp.jpg",
    mask: styles.worldMask2,
  },
  {
    name: "Hanging Gardens",
    meta: "Paludarium · Brisbane CBD",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757772271/IMG_1394_blvvzo.jpg",
    mask: styles.worldMask3,
  },
];

const RARE_LIFE = [
  {
    name: "Rainbow Guppy",
    size: 190,
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757336118/different-types-of-guppy-rainbow-fish_panpilai-paipa_Shutterstock-3-1_rvoint",
  },
  {
    name: "Bucephalandra Kedagang",
    size: 160,
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1749469954/best-place-to-buy-bucephalandra-kedagang-v0-5fhaw341fkjc1_ujrt6m",
  },
  {
    name: "Anubias Nana Petite",
    size: 220,
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1755522754/Anu_nana_1_nrkqxt.webp",
  },
];

// Shown only if the featured-products fetch returned nothing.
const FALLBACK_ARTEFACTS = [
  {
    name: "Complete worlds, built for you",
    sub: "Tank setup · aquascaping · planted & cycled",
    href: "/service",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712678/duckaroo-service-brisbane.jpg",
  },
  {
    name: "Botanicals from the edge of the map",
    sub: "Bucephalandra · rare Anubias · tissue-culture lines",
    href: "/products",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757335537/bucephalandra_bush_oyiznj",
  },
  {
    name: "Kept alive by the atelier",
    sub: "Cleaning · maintenance · rescue across SE Queensland",
    href: "/service",
    image:
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1781527151/REgular_rfci71.jpg",
  },
];

// Rising bubble columns: [left, scale, duration s, delay s]
// Negative delays start each bubble mid-rise, so the streams are visible on first load.
const HERO_BUBBLES = [
  ["4%", 0.275, 19, -6],
  ["16%", 0.12, 14, -10],
  ["34%", 0.08, 16, -3],
  ["58%", 0.15, 15, -12],
  ["74%", 0.225, 21, -15],
  ["89%", 0.1, 13, -5],
  ["10%", 0.09, 17, -13],
  ["25%", 0.16, 15, -2],
  ["44%", 0.11, 18, -8],
  ["52%", 0.07, 14, -16],
  ["66%", 0.19, 20, -4],
  ["82%", 0.13, 16, -9],
  ["95%", 0.08, 13, -1],
];

const BAND_BUBBLES = [
  ["10%", 0.16, 16, -7],
  ["50%", 0.09, 13, -4],
  ["84%", 0.2, 18, -11],
  ["28%", 0.12, 15, -9],
  ["66%", 0.1, 17, -2],
  ["92%", 0.08, 14, -13],
];

function Bubble({ left, scale, duration, delay }) {
  return (
    <div
      aria-hidden="true"
      className={styles.bubbleWrap}
      style={{
        left,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className={styles.bubbleScale} style={{ transform: `scale(${scale})` }}>
        <div className={styles.bubbleArt}>
          <i className={styles.bubbleGlint} />
          <i className={styles.bubbleGlintSmall} />
        </div>
      </div>
    </div>
  );
}

function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return null;
  return `from $${n % 1 === 0 ? n : n.toFixed(2)}`;
}

// Product descriptions are stored as rich HTML — reduce to plain text for the one-line sub.
function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const Home = ({ featuredProducts = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  // Parallax: hero layers drift at different depths; headline fades and lifts.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const layers = Array.from(root.querySelectorAll("[data-depth]"));
    const headline = root.querySelector("[data-hero-headline]");
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = Math.min(y / (window.innerHeight * 0.9), 1.4);
        for (const el of layers) {
          el.style.transform = `translate3d(0,${y * parseFloat(el.dataset.depth)}px,0)`;
        }
        if (headline) {
          headline.style.opacity = String(Math.max(1 - p * 1.15, 0));
          headline.style.transform = `translate3d(0,${y * -0.28}px,0)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveals: content is visible without JS; with JS it drifts up into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const reveals = Array.from(root.querySelectorAll("[data-reveal]"));
    for (const el of reveals) {
      el.style.opacity = "0";
      el.style.transform = "translate3d(0,54px,0)";
      el.style.transition =
        "opacity 1s cubic-bezier(.22,.61,.36,1), transform 1.1s cubic-bezier(.22,.61,.36,1)";
      el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translate3d(0,0,0)";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18 }
    );
    for (const el of reveals) io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const artefacts =
    featuredProducts.length > 0
      ? featuredProducts.map((p) => {
          const first = Array.isArray(p.images) ? p.images[0] : null;
          return {
            name: p.name,
            sub: stripHtml(p.description),
            href: `/products/${p.slug}`,
            image: typeof first === "string" ? first : first?.url || null,
            price: formatPrice(p.price),
          };
        })
      : FALLBACK_ARTEFACTS;

  return (
    <div ref={rootRef} className={styles.page}>
      {/* ================= HERO (pinned, parallax layers) ================= */}
      <div className={styles.heroWrap}>
        <div className={styles.heroSticky}>
          <div className={styles.heroOverlay} />


          {/* god rays */}
          <div data-depth="0.1" className={`${styles.ray} ${styles.ray1}`} />
          <div data-depth="0.1" className={`${styles.ray} ${styles.ray2}`} />
          <div data-depth="0.1" className={`${styles.ray} ${styles.ray3}`} />
          <div data-depth="0.1" className={`${styles.ray} ${styles.ray4}`} />

          {/* centre arch — mid layer */}
          <div data-depth="0.42" className={styles.rockCenter}>
            <Image
              src={ROCK_CENTER}
              alt="Moss-covered stone archway aquascape"
              width={860}
              height={860}
              priority
              sizes="(max-width: 768px) 74vw, 860px"
            />
            {/* T-rex vs rhino, squaring off inside the arch */}
            <div className={styles.arena}>
              <div className={`${styles.combatant} ${styles.trex}`}>
                <Image
                  src={TREX}
                  alt="Dinosaur facing off inside the centre aquascape rock arch"
                  width={460}
                  height={460}
                  priority
                  sizes="(max-width: 768px) 38vw, 420px"
                />
              </div>
              <div className={`${styles.combatant} ${styles.rhino}`}>
                <Image
                  src={RHINO}
                  alt="Rhino facing off inside the centre aquascape rock arch"
                  width={460}
                  height={460}
                  priority
                  sizes="(max-width: 768px) 38vw, 420px"
                />
              </div>
            </div>
          </div>

          {/* mossy rock, bottom left */}
          <div data-depth="0.42" className={styles.rockLeft}>
            <Image
              src={ROCK_BOTTOM_LEFT}
              alt="Moss-covered aquascape rock"
              width={460}
              height={460}
              priority
              sizes="(max-width: 768px) 30vw, 460px"
            />
          </div>

          {/* mossy rock, bottom right */}
          <div data-depth="0.42" className={styles.rockRight}>
            <Image
              src={ROCK_BOTTOM_RIGHT}
              alt=""
              aria-hidden="true"
              width={460}
              height={460}
              priority
              sizes="(max-width: 768px) 30vw, 460px"
            />
          </div>

          {/* mist */}
          <div className={styles.mistBottom} />
          <div data-depth="0.5" className={styles.mistBlob1} />
          <div data-depth="0.5" className={styles.mistBlob2} />

          {/* floating stone islands */}
          <div data-depth="0.26" className={styles.islandRight}>
            <div className={styles.islandRightFloat}>
              <Image
                src={ROCK_FLOATING}
                alt="Floating island of stone and grass"
                width={190}
                height={190}
                sizes="190px"
              />
            </div>
            <div className={styles.islandShadow} />
          </div>
          <div data-depth="0.34" className={styles.islandLeft}>
            <div className={styles.islandLeftFloat}>
              <Image
                src={ROCK_FLOATING}
                alt=""
                aria-hidden="true"
                width={100}
                height={100}
                sizes="100px"
              />
            </div>
          </div>

          {/* bubbles */}
          {HERO_BUBBLES.map(([left, scale, duration, delay]) => (
            <Bubble key={left} left={left} scale={scale} duration={duration} delay={delay} />
          ))}

          {/* vignette */}
          <div className={styles.vignette} />

          {/* nav */}
          <header className={styles.nav}>
            <Link href="/" className={styles.navBrand} aria-label="Duckaroo home">
              <Image src={LOGO} alt="Duckaroo logo" width={42} height={42} priority />
              <span className={styles.navWordmark}>DUCKAROO</span>
            </Link>
            <nav className={styles.navLinks} aria-label="Main navigation">
              {NAV_LINKS.map((l) => (
                <Link key={l.label} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link href="/service" className={styles.navCta}>
              Book a service
            </Link>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </header>

          {/* headline (fades + drifts up on scroll) */}
          <div data-hero-headline="" className={styles.headline}>
            <p className={styles.eyebrow}>Living Art Aquascapes · Brisbane &amp; Gold Coast</p>
            <h1 className={styles.heroTitle}>
              Step into the <em>floating</em> world
            </h1>
            <p className={styles.heroSub}>
              Mountains under glass. Stone that hangs in the air. Duckaroo designs, builds and
              maintains living aquascapes across Brisbane &amp; the Gold Coast — every tank a
              doorway.
            </p>
            <div className={styles.heroCtas}>
              <a href="#worlds" className={styles.ctaPrimary}>
                Enter the worlds
              </a>
              <Link href="/service" className={styles.ctaGhost}>
                Book a service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DEEP BODY (slides over the pinned hero) ================= */}
      <div className={styles.deepBody}>
        {/* worlds */}
        <section id="worlds" className={styles.worlds}>
          <div className={styles.sectionRay} />
          <div data-reveal="" className={styles.worldsHeader}>
            <h2 className={styles.kicker}>Worlds, not tanks</h2>
            <div className={styles.sectionTitle}>Each installation is its own island</div>
          </div>
          <div className={styles.worldsGrid}>
            {WORLDS.map((w, i) => (
              <Link
                key={w.name}
                href="/customer-stories"
                data-reveal=""
                data-delay={i * 150}
                className={styles.worldCard}
              >
                <div className={`${styles.worldImage} ${w.mask}`}>
                  <Image
                    src={w.image}
                    alt={`${w.name} — ${w.meta}`}
                    fill
                    sizes="(max-width: 940px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.worldShadow} />
                <h3 className={styles.worldName}>{w.name}</h3>
                <div className={styles.worldMeta}>{w.meta}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* rare life */}
        <section id="rare-life" className={styles.rare}>
          <div className={styles.rareGrid}>
            <div data-reveal="" className={styles.rareText}>
              <h2 className={styles.kicker}>Rare life</h2>
              <div className={styles.sectionTitle}>Creatures you thought were myths</div>
              <p>
                Rare fish and botanicals, ethically sourced and quarantined in-house, matched to
                the world we build around them. New arrivals land in the store a few times a
                year.
              </p>
              <Link href="/products" className={styles.rareLink}>
                Browse the collection →
              </Link>
            </div>
            <div className={styles.rareCircles}>
              {RARE_LIFE.map((r, i) => (
                <div key={r.name} data-reveal="" data-delay={i * 150} className={styles.rareItem}>
                  <div
                    className={styles.rareCircle}
                    style={{ width: r.size, height: r.size }}
                  >
                    <Image src={r.image} alt={r.name} fill sizes={`${r.size}px`} />
                  </div>
                  <div className={styles.rareName}>{r.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* artefacts */}
        <section id="artefacts" className={styles.artefacts}>
          <h2 data-reveal="" className={styles.kicker}>
            Artefacts of the atelier
          </h2>
          <div className={styles.artefactList}>
            {artefacts.map((a, i) => (
              <Link
                key={a.name}
                href={a.href}
                data-reveal=""
                data-delay={i * 120}
                className={styles.artefactRow}
              >
                <div className={styles.artefactThumb}>
                  {a.image && (
                    <Image src={a.image} alt={a.name} fill sizes="120px" />
                  )}
                </div>
                <div className={styles.artefactInfo}>
                  <h3 className={styles.artefactTitle}>{a.name}</h3>
                  <div className={styles.artefactSub}>{a.sub}</div>
                </div>
                <div className={styles.artefactPrice}>{a.price || "View →"}</div>
              </Link>
            ))}
          </div>
          <Link href="/products" className={styles.artefactsMore}>
            Browse the full collection →
          </Link>
        </section>

        {/* commissions */}
        <section id="commissions" className={styles.commission}>
          <div className={styles.sectionRayAlt} />
          {BAND_BUBBLES.map(([left, scale, duration, delay]) => (
            <Bubble key={left} left={left} scale={scale} duration={duration} delay={delay} />
          ))}
          <div data-reveal="" className={styles.commissionInner}>
            <h2 className={styles.kicker}>Commissions</h2>
            <div className={styles.sectionTitle}>
              Dream a world. <em>We&apos;ll grow it.</em>
            </div>
            <p>
              Every commission begins with your imagination — a site visit, a hand-drawn concept,
              and a world built, planted and kept alive by the Duckaroo team across Brisbane &amp;
              the Gold Coast.
            </p>
            <Link href="/service" className={styles.ctaPrimary} style={{ marginTop: 8 }}>
              Begin your commission
            </Link>
            <div className={styles.commissionPhone}>
              or call <a href="tel:+61457663939">(04) 5766 3939</a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* mobile menu overlay */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Navigation">
          <div className={styles.mobileMenuTop}>
            <Link
              href="/"
              className={styles.navBrand}
              onClick={() => setMenuOpen(false)}
              aria-label="Duckaroo home"
            >
              <Image src={LOGO} alt="Duckaroo logo" width={42} height={42} />
              <span className={styles.navWordmark}>DUCKAROO</span>
            </Link>
            <button
              type="button"
              className={styles.mobileClose}
              aria-label="Close navigation menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className={styles.mobileLinks} aria-label="Main navigation">
            {NAV_LINKS.map((l, i) => (
              <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/service"
            className={styles.mobileMenuCta}
            onClick={() => setMenuOpen(false)}
          >
            Book a service
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
