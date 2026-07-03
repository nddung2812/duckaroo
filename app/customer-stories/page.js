import AquariumProjectsClient from "./AquariumProjectsClient";

export const metadata = {
  title:
    "Customer Stories Brisbane & Gold Coast | Fish Tank Cleaning Success Stories | Duckaroo",
  description:
    "Read real customer success stories and see stunning aquarium transformations from Brisbane & Gold Coast's #1 fish tank cleaning service. Discover why customers trust Duckaroo for professional tank maintenance.",
  keywords:
    "customer stories Brisbane, customer stories Gold Coast, client testimonials, fish tank cleaning reviews, customer success stories, aquarium transformation stories, professional fish tank service testimonials, Brisbane aquarium cleaning reviews, Gold Coast aquarium cleaning reviews",
  openGraph: {
    title:
      "Customer Stories Brisbane & Gold Coast | Fish Tank Cleaning Success Stories",
    description:
      "Read real customer success stories and see stunning aquarium transformations. Discover why Brisbane & Gold Coast customers choose Duckaroo for professional fish tank cleaning services.",
    url: "https://aquaticswandesign.com.au/customer-stories",
    siteName: "Duckaroo Brisbane Fish Tank Cleaning Service",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=630&fit=crop&crop=center",
        width: 1200,
        height: 630,
        alt: "Customer Stories Brisbane - Fish Tank Cleaning Service Success Stories",
      },
    ],
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Customer Stories Brisbane & Gold Coast | Fish Tank Cleaning Success Stories",
    description:
      "Read real customer success stories and see stunning aquarium transformations by Brisbane & Gold Coast's premier fish tank cleaning service. Stories that speak for themselves.",
    images: [
      "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1757772254/IMG_1383_2_waxakf.jpg",
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
    canonical: "https://aquaticswandesign.com.au/customer-stories",
  },
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4698;153.0251",
    ICBM: "-27.4698, 153.0251",
  },
};

export default function CustomerStoriesPage() {
  return <AquariumProjectsClient />;
}
