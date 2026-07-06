import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageAmbience from "../components/PageAmbience";

export const metadata = {
  title: "Shipping Policy | Live Aquatic Plant Delivery Australia | Duckaroo",
  description:
    "Duckaroo shipping policy for live aquatic plants and non-live products. Australia-wide express post, live arrival guarantee, Monday dispatch for live orders. WA, NT and TAS restrictions apply.",
  alternates: {
    canonical: "https://duckaroo.com.au/shipping-policy",
  },
  openGraph: {
    title: "Shipping Policy | Duckaroo Aquatic Plant Store",
    description:
      "Australia-wide live plant shipping with live arrival guarantee. Express Post Monday dispatch. Learn about our delivery times and policies.",
    url: "https://duckaroo.com.au/shipping-policy",
    siteName: "Duckaroo",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1756014363/meta_f0bqpw.jpg",
        width: 1200,
        height: 630,
        alt: "Duckaroo - Australia Wide Live Plant Shipping",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippingPolicyPage() {
  return (
    <>
      <PageAmbience />

      <div className="min-h-screen relative z-10 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-medium text-parchment mb-4 [text-wrap:balance]">
              Shipping Policy
            </h1>
            <p className="text-lg text-cream/70 max-w-2xl mx-auto">
              Important information about our shipping procedures and policies
            </p>
          </div>

          {/* Policy Content */}
          <Card className="shadow-2xl bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="font-display text-2xl font-medium text-parchment">
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Non-Live Products */}
              <div>
                <h3 className="font-display text-xl font-medium text-parchment mb-3 flex items-center">
                  📦 Non-Live Products
                </h3>
                <p className="text-cream/75 leading-relaxed">
                  Shipped within <strong>1–3 business days</strong>.
                </p>
              </div>

              {/* Live Products */}
              <div>
                <h3 className="font-display text-xl font-medium text-parchment mb-3 flex items-center">
                  🐠 Live Products
                </h3>
                <p className="text-cream/75 leading-relaxed">
                  Shipped every <strong>Monday</strong> to prevent delays over
                  the weekend. All live products are sent via{" "}
                  <strong>Express Post</strong> at the standard express rate.
                </p>
              </div>

              {/* Restricted Areas */}
              <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-display text-xl font-medium text-red-300 mb-3 flex items-center">
                  ⚠️ Restricted Areas
                </h3>
                <p className="text-red-200/90 leading-relaxed">
                  Shipping to{" "}
                  <strong>
                    Western Australia (WA), NT (Northern Territory) and Tasmania
                    (TAS)
                  </strong>{" "}
                  is unavailable due to regulatory restrictions.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-moss/40 border border-cream/15 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-display text-xl font-medium text-amber-glow mb-3">
                  📋 Important Notes
                </h3>
                <ul className="text-cream/75 space-y-2">
                  <li>
                    • All orders are processed during business hours (Monday -
                    Friday)
                  </li>
                  <li>
                    • Express Post tracking information will be provided once
                    shipped
                  </li>
                  <li>
                    • Live products require someone to be available for delivery
                  </li>
                  <li>
                    • Please ensure your delivery address is accessible for
                    Australia Post
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="text-center pt-6 border-t border-cream/15">
                <p className="text-cream/70 mb-4">
                  Questions about shipping? We&apos;re here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-amber-glow text-[#04121b] text-[13px] uppercase tracking-[0.14em] font-medium rounded-full hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] transition-shadow"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:aquaticswandesign@gmail.com"
                    className="inline-flex items-center justify-center px-8 py-3 border border-cream/30 text-cream/90 text-[13px] uppercase tracking-[0.14em] font-medium rounded-full hover:border-cream/60 hover:bg-cream/5 transition-colors backdrop-blur-sm"
                  >
                    Email Support
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
