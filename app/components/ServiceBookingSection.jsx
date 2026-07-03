"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Star,
  Award,
  Clock,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import UnifiedServiceForm from "./UnifiedServiceForm";

const whyChooseUs = [
  {
    title: "Expert Service",
    description:
      "Our team of certified professionals brings years of experience in aquarium maintenance and care.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Quality Products",
    description:
      "We use only the highest quality products and equipment for your aquarium.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Reliable Service",
    description:
      "Count on us for consistent, reliable service that keeps your aquarium thriving.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Customer Satisfaction",
    description:
      "Your satisfaction is our priority. We guarantee quality service every time.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const brisbaneAreas = [
  "South Brisbane",
  "North Brisbane",
  "East Brisbane",
  "West Brisbane",
  "CBD",
  "Gold Coast",
  "Sunshine Coast",
  "Ipswich",
];

const ServiceBookingSection = () => {

  return (
    <section id="service-booking" className="w-full px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      <div className="max-w-7xl mx-auto">
        {/* SEO-Optimized Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Book Your Service
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Get a free quote for our professional aquarium services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Why Choose Us Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseUs.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-4 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 group-hover:shadow-emerald-400/30 transition-all duration-300">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300"
                          itemProp="name"
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-white/90 text-sm leading-relaxed font-medium"
                          itemProp="description"
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Brisbane Service Areas - SEO Optimized */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl group">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center group-hover:text-emerald-300 transition-colors duration-300">
                  <MapPin className="w-6 h-6 mr-3 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                  Brisbane Fish Tank Cleaning Service Areas
                </h2>
                <p className="text-white/80 text-sm mb-4 font-medium">
                  Professional aquarium cleaning and maintenance services across
                  all Brisbane suburbs:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/90 text-sm font-medium">
                  {brisbaneAreas.map((area, index) => (
                    <span
                      key={index}
                      className="flex items-center hover:text-emerald-300 transition-colors duration-200"
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 flex-shrink-0"></span>
                      {area}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <p className="text-emerald-200 text-sm font-semibold">
                    🚀 Same-day service available | 📞 Emergency callouts 24/7 |
                    💯 Free quotes for all Brisbane locations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <UnifiedServiceForm />
        </div>
      </div>
    </section>
  );
};

export default ServiceBookingSection;
