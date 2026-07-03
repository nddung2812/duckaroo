import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader className="pb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Product Not Found
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Sorry, we couldn&rsquo;t find the product you&rsquo;re looking
              for. It may have been moved, deleted, or the URL might be
              incorrect.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                What can you do?
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Check the URL for any typos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Browse our complete product catalog</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Use the search function to find what you need</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Contact us if you need assistance</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild className="flex-1 sm:flex-none">
                <Link href="/products">
                  <Search className="w-4 h-4 mr-2" />
                  Browse All Products
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1 sm:flex-none">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
