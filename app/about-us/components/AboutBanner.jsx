import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
} from "lucide-react";

const AboutBanner = () => {
  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "15+ Years Experience",
      description: "Brisbane's most experienced aquarium specialists",
      color: "from-moss to-ink",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "1000+ Happy Customers",
      description: "Trusted by Brisbane families & businesses",
      color: "from-moss to-ink",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "5-Star Rated Service",
      description: "247+ verified Google reviews",
      color: "from-moss to-ink",
    },
  ];

  const services = [
    "Professional Fish Tank Cleaning",
    "Aquarium Maintenance Plans",
    "New Tank Setup & Installation",
    "Pond Cleaning & Maintenance",
    "Emergency Aquarium Services",
    "Aquascaping Design",
    "Equipment Installation",
    "Fish Health Consultations",
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-20 relative z-10">
      {/* Hero Section */}
      <div className="text-center max-w-6xl mx-auto mb-16 mt-16">
        <Badge
          variant="outline"
          className="mb-6 bg-moss/60 border-amber-glow/40 text-amber-glow text-lg px-6 py-2 rounded-full"
        >
          Brisbane&apos;s #1 Fish Tank Cleaning Service Since 2010
        </Badge>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-parchment mb-6 leading-tight">
          About
          <span className="text-amber-glow block mt-2 pb-2">
            Duckaroo Brisbane
          </span>
        </h1>

        <div className="text-xl md:text-2xl text-cream/75 mb-8 max-w-4xl mx-auto leading-relaxed space-y-4">
          <p>
            Looking for a reliable{" "}
            <strong className="text-amber-glow">
              fish tank cleaning service
            </strong>{" "}
            or{" "}
            <strong className="text-amber-glow">
              aquarium cleaning service near me
            </strong>
            ?<strong className="text-amber-glow"> Duckaroo</strong> has been
            Brisbane&apos;s premier <strong>fish tank cleaning service</strong>{" "}
            since 2010, providing professional aquarium cleaning service near me
            across Brisbane, Gold Coast, and all Queensland areas.
          </p>

          <p>
            Our experienced <strong>fish tank cleaning service</strong> team
            specializes in
            <strong>aquarium cleaning service near me</strong> solutions, from
            Brisbane CBD to Southside Brisbane. Whether you need routine fish
            tank cleaning service or emergency aquarium cleaning service near
            me, we deliver exceptional results with same-day availability and
            100% satisfaction guarantee.
          </p>
        </div>

        {/* Contact Information */}
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
            <span className="font-semibold">
              Servicing All Brisbane & Surrounding Areas
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm sm:max-w-2xl mx-auto mb-12">
          <Button
            asChild
            size="lg"
            className="w-full max-w-xs sm:w-auto sm:max-w-none bg-amber-glow text-[#04121b] hover:bg-amber-glow hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] border-none rounded-full px-4 sm:px-8 py-6 text-[13px] uppercase tracking-[0.14em] font-medium"
          >
            <Link href="/service">Get Free Quote</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full max-w-xs sm:w-auto sm:max-w-none border border-cream/30 text-cream/90 bg-transparent hover:border-cream/60 hover:bg-cream/5 rounded-full px-4 sm:px-8 py-6 text-[13px] uppercase tracking-[0.14em] font-medium"
          >
            <Link
              href="https://duckaroo.com.au/collections/all"
              target="_blank"
              rel="noreferrer"
            >
              Shop Aquarium Plants
            </Link>
          </Button>
        </div>
      </div>

      {/* Our Achievements Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-parchment text-center mb-8">
          Our <span className="text-amber-glow">Achievements</span>
        </h2>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="group bg-cream/5 backdrop-blur-sm border border-cream/15 rounded-2xl hover:bg-cream/10 hover:border-amber-glow/50 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${achievement.color} border border-amber-glow/40 mb-4 text-amber-glow group-hover:scale-110 transition-transform duration-300`}
                >
                  {achievement.icon}
                </div>
                <h3 className="font-display text-xl font-medium text-parchment mb-2">
                  {achievement.title}
                </h3>
                <p className="text-cream/70">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
        <div className="space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-parchment">
            Our <span className="text-amber-glow">Story</span>
          </h2>
          <div className="text-cream/75 space-y-4 leading-relaxed">
            <p>
              Founded in 2010 by passionate aquarists,{" "}
              <strong className="text-amber-glow">Duckaroo</strong> began as a
              small Brisbane-based business with a simple mission: to bring the
              beauty and tranquility of aquatic life to homes and businesses
              across Queensland.
            </p>
            <p>
              What started as weekend{" "}
              <strong>fish tank cleaning service</strong> solutions has grown
              into Brisbane&apos;s most trusted{" "}
              <strong>aquarium cleaning service near me</strong>, serving over
              1000+ satisfied customers from Brisbane CBD to Gold Coast and
              everywhere in between.
            </p>
            <p>
              Our team of experienced aquatic specialists combines 15+ years of
              experience with cutting-edge techniques to deliver exceptional{" "}
              <strong>fish tank cleaning service</strong> and{" "}
              <strong>aquarium cleaning service near me</strong> solutions that
              exceed expectations every time.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-parchment mb-6">
            Our <span className="text-amber-glow">Services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-amber-glow flex-shrink-0" />
                <span className="text-cream/90 text-sm font-medium">
                  {service}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-moss/60 rounded-2xl border border-amber-glow/40">
            <p className="text-amber-glow text-sm font-semibold">
              🚀 Same-day service available | 📞 Emergency callouts 24/7 | 💯
              100% satisfaction guarantee | 🏆 Brisbane&apos;s #1 rated service
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="max-w-6xl mx-auto">
        <Card className="bg-cream/5 backdrop-blur-md border border-cream/15 rounded-2xl">
          <CardContent className="p-8">
            <h2 className="font-display text-2xl font-medium text-amber-glow mb-6 text-center">
              Why Choose Duckaroo for Brisbane Aquarium Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-cream/75 text-sm space-y-0 leading-relaxed">
              <div className="space-y-4">
                <p>
                  <strong>Local Brisbane Expertise:</strong> Born and bred in
                  Brisbane, we understand Queensland&apos;s unique water
                  conditions, climate challenges, and local aquarium needs
                  better than anyone else.
                </p>
                <p>
                  <strong>Comprehensive Fish Tank Cleaning Service:</strong>{" "}
                  From routine <strong>fish tank cleaning service</strong> to
                  emergency <strong>aquarium cleaning service near me</strong>,
                  pond maintenance, and custom aquascaping design - we&apos;re
                  your local one-stop solution for all aquatic service needs.
                </p>
                <p>
                  <strong>Experienced Professionals:</strong> Our team has
                  extensive experience and undergoes continuous learning to stay
                  current with the latest aquarium maintenance techniques and
                  technologies.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  <strong>Service Areas:</strong> We proudly serve all Brisbane
                  suburbs including CBD, Southside (Logan, Springwood),
                  Northside (Chermside, Redcliffe), Eastern suburbs (Wynnum,
                  Capalaba), Western suburbs (Toowong, Ipswich), plus Gold Coast
                  and regional Queensland.
                </p>
                <p>
                  <strong>Customer Satisfaction:</strong> With 247+ five-star
                  Google reviews and a 100% satisfaction guarantee, we&apos;re
                  committed to exceeding your expectations on every visit.
                </p>
                <p>
                  <strong>Emergency Support:</strong> When you need{" "}
                  <strong>aquarium cleaning service near me</strong> urgently,
                  we&apos;re here 24/7. We offer emergency{" "}
                  <strong>fish tank cleaning service</strong> and maintenance
                  across Brisbane and surrounding areas, because aquarium
                  emergencies don&apos;t wait for business hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AboutBanner;
