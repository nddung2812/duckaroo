import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";
import PageAmbience from "../../components/PageAmbience";

export default function ProductNotFound() {
  return (
    <>
      <PageAmbience />
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl text-cream">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-red-950/30 border border-red-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-300" />
              </div>
              <CardTitle className="font-display text-3xl font-medium text-parchment mb-2">
                Product Not Found
              </CardTitle>
              <p className="text-cream/70 text-lg">
                Sorry, we couldn&rsquo;t find the product you&rsquo;re looking
                for. It may have been moved, deleted, or the URL might be
                incorrect.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium text-parchment">
                  What can you do?
                </h3>
                <ul className="text-left space-y-2 text-cream/70">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-glow rounded-full"></div>
                    <span>Check the URL for any typos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-glow rounded-full"></div>
                    <span>Browse our complete product catalog</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-glow rounded-full"></div>
                    <span>Use the search function to find what you need</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-glow rounded-full"></div>
                    <span>Contact us if you need assistance</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  asChild
                  className="flex-1 sm:flex-none bg-amber-glow text-[#04121b] rounded-full text-[13px] uppercase tracking-[0.14em] font-medium hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                >
                  <Link href="/products">
                    <Search className="w-4 h-4 mr-2" />
                    Browse All Products
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="flex-1 sm:flex-none rounded-full border-cream/30 text-cream/90 bg-transparent hover:border-cream/60 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em]"
                >
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-cream/15">
                <p className="text-sm text-cream/60">
                  Need help?{" "}
                  <Link href="/contact" className="text-amber-glow hover:underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
