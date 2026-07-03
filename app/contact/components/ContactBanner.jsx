"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import UnifiedServiceForm from "../../components/UnifiedServiceForm";

const ContactBanner = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us Today",
      content: "(04) 5766 3939",
      description: "Available 8AM - 6PM | Emergency service 24/7",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "aquaticswandesign@gmail.com",
      description: "We respond within 2 hours during business hours",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Service Areas",
      content: "All Brisbane & QLD",
      description: "Brisbane CBD, Southside, Northside, Gold Coast",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "Mon - Sun 8AM - 6PM",
      description: "Same-day service available for urgent requests",
      color: "from-teal-400 to-teal-600",
    },
  ];

  return (
    <section
      className="pt-12 pb-20 px-4 relative z-10"
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 bg-emerald-500/30 border-emerald-400 text-emerald-100"
          >
            Contact Brisbane&apos;s #1 Aquarium Experts
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Get Your FREE
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 block">
              Aquarium Quote
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ready to transform your aquatic space? Contact Brisbane&apos;s most
            trusted
            <strong> fish tank cleaning</strong> and{" "}
            <strong>aquarium maintenance specialists</strong>. Same-day quotes,
            emergency service available!
          </p>

          {/* Contact Information Quick Access */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-white/90">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold">Call: (04) 5766 3939</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold">aquaticswandesign@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold">All Brisbane & Queensland</span>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${info.color} text-white shadow-lg group-hover:scale-110 group-hover:shadow-emerald-400/30 transition-all duration-300 mb-4`}
                >
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {info.title}
                </h3>
                <p className="text-white/90 font-semibold mb-2">
                  {info.content}
                </p>
                <p className="text-white/70 text-sm leading-relaxed">
                  {info.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="lg:order-2">
            <UnifiedServiceForm variant="contact" />
          </div>

          {/* Why Choose Us Section */}
          <div className="lg:order-1 space-y-8">
            <Card className="bg-white/15 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-emerald-300">
                  Why Choose Duckaroo Brisbane?
                </h2>
                <div className="space-y-4">
                  {[
                    "⭐ 247+ 5-star Google reviews from satisfied customers",
                    "🚀 Same-day service & emergency callouts available 24/7",
                    "🎯 15+ years experience with Brisbane water conditions",
                    "💯 100% satisfaction guarantee on all services",
                    "🏆 Brisbane's #1 rated aquarium cleaning specialists",
                    "📱 Free quotes & consultations - no obligation",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-white/90"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-emerald-300">
                  Our Services Include:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80 text-sm">
                  {[
                    "Fish Tank Cleaning",
                    "Aquarium Maintenance",
                    "Pond Cleaning & Care",
                    "Tank Setup & Installation",
                    "Emergency Tank Service",
                    "Water Quality Testing",
                    "Equipment Repair",
                    "Aquascaping Design",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
