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
      color: "from-moss to-ink",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "aquaticswandesign@gmail.com",
      description: "We respond within 2 hours during business hours",
      color: "from-moss to-ink",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Service Areas",
      content: "All Brisbane & QLD",
      description: "Brisbane CBD, Southside, Northside, Gold Coast",
      color: "from-moss to-ink",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "Mon - Sun 8AM - 6PM",
      description: "Same-day service available for urgent requests",
      color: "from-moss to-ink",
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
            className="mb-6 bg-moss/60 border-amber-glow/40 text-amber-glow"
          >
            Contact Brisbane&apos;s #1 Aquarium Experts
          </Badge>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-parchment mb-6 leading-tight">
            Get Your FREE
            <span className="text-amber-glow block">
              Aquarium Quote
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-cream/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ready to transform your aquatic space? Contact Brisbane&apos;s most
            trusted
            <strong> fish tank cleaning</strong> and{" "}
            <strong>aquarium maintenance specialists</strong>. Same-day quotes,
            emergency service available!
          </p>

          {/* Contact Information Quick Access */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-cream/90">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-glow" />
              <span className="font-semibold">Call: (04) 5766 3939</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-glow" />
              <span className="font-semibold">aquaticswandesign@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-glow" />
              <span className="font-semibold">All Brisbane & Queensland</span>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:bg-cream/10 hover:border-amber-glow/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.color} border border-amber-glow/40 text-amber-glow shadow-lg group-hover:scale-110 group-hover:shadow-amber-glow/30 transition-all duration-300 mb-4`}
                >
                  {info.icon}
                </div>
                <h3 className="font-display text-lg font-medium text-parchment mb-2 group-hover:text-amber-glow transition-colors duration-300">
                  {info.title}
                </h3>
                <p className="text-cream/90 font-semibold mb-2">
                  {info.content}
                </p>
                <p className="text-cream/70 text-sm leading-relaxed">
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
            <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:border-amber-glow/50 transition-colors duration-300">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-medium mb-6 text-amber-glow">
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
                      className="flex items-start gap-3 text-cream/90"
                    >
                      <div className="w-2 h-2 bg-amber-glow rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:border-amber-glow/50 transition-colors duration-300">
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-medium mb-4 text-amber-glow">
                  Our Services Include:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-cream/80 text-sm">
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
                      <span className="w-1.5 h-1.5 bg-amber-glow rounded-full flex-shrink-0"></span>
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
