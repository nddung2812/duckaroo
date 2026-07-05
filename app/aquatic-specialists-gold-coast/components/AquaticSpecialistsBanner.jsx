"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Fish,
  Waves,
  Shield,
  Users,
} from "lucide-react";
import UnifiedServiceForm from "../../components/UnifiedServiceForm";

const AquaticSpecialistsBanner = () => {

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Gold Coast Team",
      content: "(04) 5766 3939",
      description: "Available 8AM - 6PM | Emergency service available 24/7",
      color: "from-moss to-ink",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Our Specialists",
      content: "aquaticswandesign@gmail.com",
      description: "Rapid response within 2 hours during business hours",
      color: "from-moss to-ink",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Gold Coast Service Areas",
      content: "All Gold Coast Suburbs",
      description:
        "Southport, Surfers Paradise, Broadbeach, Burleigh, Coolangatta",
      color: "from-moss to-ink",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Operating Hours",
      content: "Mon - Sun 8AM - 6PM",
      description: "Same-day service available for urgent Gold Coast requests",
      color: "from-moss to-ink",
    },
  ];

  const specialistFeatures = [
    {
      icon: <Fish className="w-8 h-8" />,
      title: "Fish Tank Specialists",
      description:
        "Expert aquarium cleaning and maintenance for Gold Coast homes and businesses",
      color: "from-moss to-ink",
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Pond Maintenance Experts",
      description:
        "Professional pond cleaning and water feature services across Gold Coast",
      color: "from-moss to-ink",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "15+ Years Experience",
      description:
        "Trusted Gold Coast aquatic specialists with proven track record",
      color: "from-moss to-ink",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "247+ Happy Customers",
      description:
        "Gold Coast's most reviewed and trusted aquatic service provider",
      color: "from-moss to-ink",
    },
  ];

  return (
    <section
      className="pt-12 pb-20 px-4 relative z-10"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 bg-moss/60 border-amber-glow/40 text-amber-glow rounded-full"
          >
            Gold Coast&apos;s #1 Rated Aquatic Specialists
          </Badge>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-parchment mb-6 leading-tight">
            <span className="text-amber-glow">
              Aquatic Specialists
            </span>
            <span className="block text-parchment">Gold Coast</span>
          </h1>

          <p className="text-xl md:text-2xl text-cream/75 mb-12 max-w-4xl mx-auto leading-relaxed">
            Gold Coast&apos;s premier <strong>aquatic specialists</strong>{" "}
            providing expert <strong>fish tank cleaning</strong>,{" "}
            <strong>pond maintenance</strong>, and{" "}
            <strong>aquarium services</strong>. 15+ years experience, same-day
            service, free quotes!
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
              <span className="font-semibold">All Gold Coast Areas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Contact Form */}
          <div className="lg:order-2">
            <UnifiedServiceForm variant="contact" />
          </div>

          {/* Why Choose Us Section */}
          <div className="lg:order-1 space-y-8">
            <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-medium mb-6 text-amber-glow">
                  Why Choose Our Gold Coast Aquatic Specialists?
                </h2>
                <div className="space-y-4">
                  {[
                    "⭐ Gold Coast's #1 rated aquatic specialists (247+ 5-star reviews)",
                    "🚀 Same-day service across all Gold Coast suburbs",
                    "🎯 15+ years experience with Queensland water conditions",
                    "💯 100% satisfaction guarantee on all Gold Coast services",
                    "🏆 Most trusted fish tank and pond specialists on Gold Coast",
                    "📱 Free quotes & consultations throughout Gold Coast",
                    "🌊 Experts in saltwater & freshwater aquarium systems",
                    "🔧 Emergency aquatic services available 24/7",
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

            <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-medium mb-4 text-amber-glow">
                  Gold Coast Aquatic Services:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-cream/80 text-sm">
                  {[
                    "Fish Tank Cleaning",
                    "Aquarium Maintenance",
                    "Pond Cleaning & Care",
                    "Tank Setup & Installation",
                    "Emergency Aquatic Service",
                    "Water Quality Testing",
                    "Equipment Repair & Service",
                    "Aquascaping Design",
                    "Koi Pond Maintenance",
                    "Commercial Aquarium Service",
                    "Saltwater Tank Specialists",
                    "Water Feature Maintenance",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-glow rounded-full flex-shrink-0"></span>
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-medium mb-4 text-amber-glow">
                  Gold Coast Service Areas:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-cream/80 text-sm">
                  {[
                    "Southport",
                    "Surfers Paradise",
                    "Broadbeach",
                    "Burleigh Heads",
                    "Coolangatta",
                    "Robina",
                    "Nerang",
                    "Mudgeeraba",
                    "Currumbin",
                    "Palm Beach",
                    "Tugun",
                    "Varsity Lakes",
                  ].map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-glow rounded-full flex-shrink-0"></span>
                      {area}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specialist Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {specialistFeatures.map((feature, index) => (
            <Card
              key={index}
              className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl hover:bg-cream/10 hover:border-amber-glow/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} border border-amber-glow/40 text-amber-glow shadow-lg group-hover:scale-110 group-hover:shadow-amber-glow/30 transition-all duration-300 mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-medium text-parchment mb-2 group-hover:text-amber-glow transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-cream/75 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
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
      </div>
    </section>
  );
};

export default AquaticSpecialistsBanner;
