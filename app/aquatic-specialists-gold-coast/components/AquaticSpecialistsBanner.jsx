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
      color: "from-emerald-400 to-emerald-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Our Specialists",
      content: "aquaticswandesign@gmail.com",
      description: "Rapid response within 2 hours during business hours",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Gold Coast Service Areas",
      content: "All Gold Coast Suburbs",
      description:
        "Southport, Surfers Paradise, Broadbeach, Burleigh, Coolangatta",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Operating Hours",
      content: "Mon - Sun 8AM - 6PM",
      description: "Same-day service available for urgent Gold Coast requests",
      color: "from-teal-400 to-teal-600",
    },
  ];

  const specialistFeatures = [
    {
      icon: <Fish className="w-8 h-8" />,
      title: "Fish Tank Specialists",
      description:
        "Expert aquarium cleaning and maintenance for Gold Coast homes and businesses",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Pond Maintenance Experts",
      description:
        "Professional pond cleaning and water feature services across Gold Coast",
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "15+ Years Experience",
      description:
        "Trusted Gold Coast aquatic specialists with proven track record",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "247+ Happy Customers",
      description:
        "Gold Coast's most reviewed and trusted aquatic service provider",
      color: "from-orange-500 to-red-500",
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
            className="mb-6 bg-emerald-500/30 border-emerald-400 text-emerald-100"
          >
            Gold Coast&apos;s #1 Rated Aquatic Specialists
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Aquatic Specialists
            </span>
            <span className="block text-white">Gold Coast</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Gold Coast&apos;s premier <strong>aquatic specialists</strong>{" "}
            providing expert <strong>fish tank cleaning</strong>,{" "}
            <strong>pond maintenance</strong>, and{" "}
            <strong>aquarium services</strong>. 15+ years experience, same-day
            service, free quotes!
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
            <Card className="bg-white/15 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-emerald-300">
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
                <h3 className="text-xl font-bold mb-4 text-emerald-300">
                  Gold Coast Aquatic Services:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80 text-sm">
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
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-emerald-300">
                  Gold Coast Service Areas:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
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
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0"></span>
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
              className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 group-hover:shadow-emerald-400/30 transition-all duration-300 mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
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
      </div>
    </section>
  );
};

export default AquaticSpecialistsBanner;
