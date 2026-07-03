import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Shipping Policy | Live Aquatic Plant Delivery Australia | Duckaroo",
  description:
    "Duckaroo shipping policy for live aquatic plants and non-live products. Australia-wide express post, live arrival guarantee, Monday dispatch for live orders. WA, NT and TAS restrictions apply.",
  alternates: {
    canonical: "https://aquaticswandesign.com.au/shipping-policy",
  },
  openGraph: {
    title: "Shipping Policy | Duckaroo Aquatic Plant Store",
    description:
      "Australia-wide live plant shipping with live arrival guarantee. Express Post Monday dispatch. Learn about our delivery times and policies.",
    url: "https://aquaticswandesign.com.au/shipping-policy",
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
      {/* Dark Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-30"
        style={{ minWidth: "100vw", minHeight: "100vh" }}
      />

      {/* Mobile Ocean Gradient */}
      <div
        className="md:hidden fixed top-0 left-0 w-full h-full -z-20"
        style={{
          minWidth: "100vw",
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0a1628 0%, #0c1f4a 25%, #1e3a8a 50%, #1e40af 75%, #1d4ed8 100%)",
        }}
      />

      {/* Dark overlay for consistency */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/20 -z-10"
        style={{ minWidth: "100vw", minHeight: "100vh" }}
      />

      <div className="min-h-screen relative z-10 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow">
              Shipping Policy
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Important information about our shipping procedures and policies
            </p>
          </div>

          {/* Policy Content */}
          <Card className="shadow-2xl bg-slate-800/90 backdrop-blur-md border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Non-Live Products */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  📦 Non-Live Products
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Shipped within <strong>1–3 business days</strong>.
                </p>
              </div>

              {/* Live Products */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  🐠 Live Products
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  Shipped every <strong>Monday</strong> to prevent delays over
                  the weekend. All live products are sent via{" "}
                  <strong>Express Post</strong> at the standard express rate.
                </p>
              </div>

              {/* Restricted Areas */}
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-red-300 mb-3 flex items-center">
                  ⚠️ Restricted Areas
                </h3>
                <p className="text-red-200 leading-relaxed">
                  Shipping to{" "}
                  <strong>
                    Western Australia (WA), NT (Northern Territory) and Tasmania
                    (TAS)
                  </strong>{" "}
                  is unavailable due to regulatory restrictions.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">
                  📋 Important Notes
                </h3>
                <ul className="text-blue-200 space-y-2">
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
              <div className="text-center pt-6 border-t border-slate-600/50">
                <p className="text-slate-300 mb-4">
                  Questions about shipping? We&apos;re here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-lg"
                  >
                    Contact Us
                  </a>
                  <a
                    href="mailto:aquaticswandesign@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-2 border border-emerald-500 text-emerald-400 font-medium rounded-md hover:bg-emerald-900/30 hover:border-emerald-400 transition-colors backdrop-blur-sm"
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
