import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Customer Success Stories | Real Aquarium Projects Brisbane & Gold Coast | Duckaroo",
  description:
    "Browse Duckaroo's portfolio of fish tank cleaning, aquarium setup, and pond maintenance projects across Brisbane and Gold Coast. Real before and after results from satisfied customers.",
  keywords:
    "aquarium projects Brisbane, fish tank cleaning results, aquarium before after, customer reviews Brisbane, pond maintenance Gold Coast",
  alternates: {
    canonical: "https://aquaticswandesign.com.au/customer-stories",
  },
  openGraph: {
    title: "Customer Success Stories | Real Aquarium Projects | Duckaroo",
    description:
      "Real aquarium projects and customer success stories from Duckaroo's fish tank cleaning and aquarium maintenance services across Brisbane and Gold Coast.",
    url: "https://aquaticswandesign.com.au/customer-stories",
    siteName: "Duckaroo",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        width: 1200,
        height: 630,
        alt: "Duckaroo Customer Success Stories - Real Aquarium Projects Brisbane & Gold Coast",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RealAquariumProjectLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://aquaticswandesign.com.au/customer-stories",
            name: "Customer Success Stories | Duckaroo",
            description:
              "Real aquarium projects and customer success stories from Duckaroo's fish tank cleaning and aquarium maintenance services across Brisbane and Gold Coast.",
            url: "https://aquaticswandesign.com.au/customer-stories",
            publisher: {
              "@id": "https://aquaticswandesign.com.au/#organization",
            },
            mainEntity: {
              "@type": "ItemList",
              name: "Aquarium Projects Portfolio",
              description:
                "Before and after aquarium cleaning, setup, and maintenance projects by Duckaroo across Brisbane and Gold Coast.",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Residential Aquarium Cleaning — Brisbane",
                  description:
                    "Complete fish tank cleaning and water change service for a 200L residential aquarium in Brisbane.",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Office Aquarium Maintenance — Gold Coast",
                  description:
                    "Ongoing monthly aquarium maintenance for a commercial office display tank on the Gold Coast.",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Planted Tank Setup — Brisbane Northside",
                  description:
                    "Full planted aquarium setup including hardscape, substrate, and plant installation for a new 300L tank.",
                },
              ],
            },
          }),
        }}
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
