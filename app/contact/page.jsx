import ContactPageClient from "./ContactPageClient";

export const metadata = {
  title: "Contact Duckaroo Brisbane - Get Your FREE Aquarium Quote Today",
  description:
    "Contact Brisbane's #1 aquarium experts for fish tank cleaning, pond maintenance & aquatic services. Free quotes, same-day service. Call (04) 5766 3939 or get in touch online.",
  keywords:
    "contact aquarium service Brisbane, fish tank cleaning quote, pond maintenance contact, aquatic services Brisbane, Duckaroo contact",
  openGraph: {
    title: "Contact Duckaroo Brisbane - Expert Aquarium Services",
    description:
      "Get in touch with Brisbane's premier aquarium specialists. Free quotes for fish tank cleaning, pond maintenance & aquatic services. Same-day response guaranteed.",
    url: "https://aquaticswandesign.com.au/contact",
    siteName: "Duckaroo Brisbane",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
        width: 1200,
        height: 630,
        alt: "Contact Duckaroo Brisbane - Aquarium Experts",
      },
    ],
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Duckaroo Brisbane - Expert Aquarium Services",
    description:
      "Get your FREE aquarium quote from Brisbane's #1 fish tank cleaning experts. Same-day service available.",
    images: [
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
    ],
    creator: "@AquaticSwanDesign",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://aquaticswandesign.com.au/contact",
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4705;153.0260",
    ICBM: "-27.4705, 153.0260",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
