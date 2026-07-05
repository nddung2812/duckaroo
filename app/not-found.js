"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Fish,
  Waves,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import Layout from "@/app/components/Layout";
import PageAmbience from "@/app/components/PageAmbience";

export default function NotFound() {
  const [fishPosition, setFishPosition] = useState({ x: 50, y: 50 });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Animated fish swimming effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFishPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    {
      href: "/products",
      label: "Products",
      icon: <Fish className="w-4 h-4" />,
    },
    {
      href: "/service",
      label: "Services",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      href: "/customer-stories",
      label: "Customer Stories",
      icon: <Waves className="w-4 h-4" />,
    },
    { href: "/blogs", label: "Blog", icon: <Waves className="w-4 h-4" /> },
    {
      href: "/about-us",
      label: "About Us",
      icon: <Fish className="w-4 h-4" />,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      href: "/shipping-policy",
      label: "Shipping",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  const recentPages = [
    {
      title: "Customer Success Stories",
      href: "/customer-stories",
      time: "View Projects",
    },
    {
      title: "Fish Tank Cleaning Service",
      href: "/service",
      time: "Get Quote",
    },
    { title: "Premium Aquatic Products", href: "/products", time: "Browse" },
    {
      title: "Aquarium Setup Guide",
      href: "/how-to-setup-your-first-aquarium",
      time: "Learn More",
    },
    { title: "About Our Team", href: "/about-us", time: "Learn More" },
    { title: "Blog & Guides", href: "/blogs", time: "Read More" },
  ];

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <PageAmbience />

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-glow rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-cream/70 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-amber-glow rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-cream/70 rounded-full animate-pulse delay-3000"></div>
        </div>

        {/* Swimming fish animation */}
        <div
          className="absolute w-8 h-8 text-amber-glow/30 transition-all duration-3000 ease-in-out"
          style={{
            left: `${fishPosition.x}%`,
            top: `${fishPosition.y}%`,
            transform: `rotate(${fishPosition.x > 50 ? "0deg" : "180deg"})`,
          }}
        >
          <Fish className="w-8 h-8" />
        </div>

        <div className="relative z-10 pt-20 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main 404 Section */}
            <div className="text-center mb-16">
              <div className="mb-8">
                <h1 className="font-display text-8xl md:text-9xl font-medium text-parchment/15 mb-4 select-none">
                  404
                </h1>
                <div className="relative">
                  <h2 className="font-display text-3xl md:text-5xl font-medium text-parchment mb-4">
                    Lost in the Deep
                  </h2>
                  <p className="text-xl text-cream/70 mb-8 max-w-2xl mx-auto">
                    This page seems to have swum away. Let&apos;s help you
                    navigate back to calmer waters.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for pages, products, guides..."
                    className={`w-full pl-12 pr-4 py-4 bg-cream/5 backdrop-blur-md border rounded-full text-cream placeholder:text-cream/60 transition-all duration-300 ${
                      isSearchFocused
                        ? "border-amber-glow bg-cream/10 shadow-lg shadow-amber-glow/20"
                        : "border-cream/30 hover:border-cream/50"
                    }`}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-glow hover:bg-amber-glow text-[#04121b] text-[13px] uppercase tracking-[0.14em] font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                >
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border border-cream/30 text-cream/90 hover:bg-cream/5 hover:border-cream/60 bg-transparent text-[13px] uppercase tracking-[0.14em] px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  onClick={() => window.history.back()}
                >
                  <Link href="#" className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-cream/90 hover:bg-cream/5 hover:text-cream text-[13px] uppercase tracking-[0.14em] px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Links and Recent Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Navigation */}
              <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl hover:border-amber-glow/50 transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-medium text-parchment mb-6 flex items-center gap-2">
                    <Waves className="w-5 h-5 text-amber-glow" />
                    Quick Navigation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="flex items-center gap-3 p-4 rounded-lg bg-cream/5 hover:bg-cream/10 transition-all duration-300 group text-cream/90 hover:text-cream"
                      >
                        <div className="text-amber-glow group-hover:text-amber-glow/80 transition-colors">
                          {link.icon}
                        </div>
                        <span className="font-medium">{link.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent/Popular Pages */}
              <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl hover:border-amber-glow/50 transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-medium text-parchment mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-glow" />
                    Popular Pages
                  </h3>
                  <div className="space-y-3">
                    {recentPages.map((page, index) => (
                      <Link
                        key={index}
                        href={page.href}
                        className="flex items-center justify-between p-4 rounded-lg bg-cream/5 hover:bg-cream/10 transition-all duration-300 group"
                      >
                        <div>
                          <h4 className="font-medium text-cream group-hover:text-amber-glow transition-colors">
                            {page.title}
                          </h4>
                          <p className="text-sm text-cream/60">{page.time}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cream/40 group-hover:text-cream/80 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Section */}
            <div className="mt-16 text-center">
              <Card className="bg-cream/5 backdrop-blur-md border-cream/15 rounded-2xl max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="font-display text-lg font-medium text-parchment mb-4">
                    Still can&apos;t find what you&apos;re looking for?
                  </h3>
                  <p className="text-cream/70 mb-6">
                    Our aquatic experts are here to help you navigate any
                    challenges.
                  </p>
                  <Button
                    asChild
                    className="bg-amber-glow hover:bg-amber-glow text-[#04121b] text-[13px] uppercase tracking-[0.14em] font-medium rounded-full hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
