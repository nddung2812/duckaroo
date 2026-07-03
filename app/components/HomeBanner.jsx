"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Leaf, Fish, Clock, Shield } from "lucide-react";
import Image from "next/image";

const getImageSrc = (img) => (typeof img === "string" ? img : img?.url ?? "");

const features = [
  {
    title: "Expert Fish Tank Cleaning Service",
    description: "Professional fish tank cleaning & maintenance",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    title: "Premium Salt Water Tank Service",
    description: "Expert saltwater aquarium maintenance & marine tank care",
    icon: <Fish className="h-5 w-5" />,
  },
  {
    title: "Brisbane & Gold Coast Wide Service",
    description: "Fish tank cleaning service across Brisbane & Gold Coast",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "100% Satisfaction Guaranteed",
    description: "Professional fish tank cleaning service",
    icon: <Shield className="h-5 w-5" />,
  },
];

const services = [
  {
    title: "Fish Tank Cleaning Service",
    description:
      "Professional fish tank cleaning service and aquascaping design",
    icon: <Leaf className="h-6 w-6" />,
    href: "/service",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Aquarium Maintenance",
    description:
      "Regular fish tank cleaning service to keep aquariums thriving",
    icon: <Fish className="h-6 w-6" />,
    href: "#service-booking",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Customer Success Stories",
    description: "See real results from our expert fish tank cleaning service",
    icon: <Clock className="h-6 w-6" />,
    href: "#customer-success-stories",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Salt Water Tank Service",
    description:
      "Professional saltwater aquarium maintenance, marine tank setup and salt water fish care",
    icon: <Shield className="h-6 w-6" />,
    href: "/service",
    color: "from-blue-500 to-blue-600",
  },
];

export default function HomeBanner({ featuredProducts = [] }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative z-10">
      {/* Hero Section - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-16 mt-16">
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center">
          <Badge className="mb-6 bg-emerald-500/30 border-emerald-400 text-emerald-100 w-fit">
            Brisbane & Gold Coast&apos;s #1 Fish Tank Cleaning Service
          </Badge>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Brisbane & Gold Coast&apos;s #1 Fish Tank Cleaning Service
          </h1>

          <p className="text-xl text-white/80 mb-8 max-w-xl">
            Looking for reliable{" "}
            <strong className="text-emerald-300">
              fish tank cleaning service
            </strong>{" "}
            in Brisbane & Gold Coast? We&apos;re Brisbane & Gold Coast&apos;s
            premier{" "}
            <strong className="text-emerald-300">
              fish tank cleaning service
            </strong>{" "}
            specialists, offering professional aquarium maintenance,{" "}
            <strong className="text-blue-300">salt water tank service</strong>,
            setup, removal, and premium aquatic plants for your home or office.
            Trust our expert fish tank cleaning and{" "}
            <strong className="text-blue-300">
              saltwater aquarium specialists
            </strong>{" "}
            for crystal-clear results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border-none px-8 py-6 text-lg group"
            >
              <Link href="/products" className="flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 border-none px-8 py-6 text-lg group"
            >
              <Link
                href="#service-booking"
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("service-booking")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Why Choose Our Fish Tank Cleaning Service
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">
                      {feature.title}
                    </div>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Services Cards */}
        <div className="grid grid-cols-1 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              target={service.href.startsWith("#") ? "_self" : "_blank"}
              rel={service.href.startsWith("#") ? "" : "noreferrer"}
              onClick={(e) => {
                if (service.href.startsWith("#")) {
                  e.preventDefault();
                  const element = document.querySelector(service.href);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            >
              <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 md:transition-all md:duration-300 md:hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6 flex items-center gap-6">
                  <div
                    className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-r ${service.color} text-white md:group-hover:scale-110 md:transition-transform md:duration-300`}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-white/70">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="w-full max-w-7xl mx-auto mb-16 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Enhance your{" "}
            <strong className="text-emerald-300">
              fish tank
            </strong>{" "}
            experience with our premium aquatic plants and professional-grade
            supplies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Product Cards - First 3 Products */}
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="flex flex-col">
              <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 md:transition-all md:duration-300 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(product.images?.[0])}
                      alt={product.name}
                      fill
                      className="object-cover md:group-hover:scale-110 md:transition-transform md:duration-300"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={80}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {product.description.replace(/<[^>]*>/g, "").slice(0, 50)}...
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-emerald-400 font-semibold">
                      ${product.price} AUD
                    </span>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-emerald-400"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
