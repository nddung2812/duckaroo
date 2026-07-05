import { Youtube, Facebook, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const footerLinks = {
    services: [
      {
        label: "Shop With Us",
        href: "https://duckaroo.com.au/collections/all",
      },
      { label: "Contact Us", href: "/contact" },
      { label: "Get Quote", href: "/service" },
      { label: "Gold Coast Service", href: "/aquatic-specialists-gold-coast" },
    ],
    products: [
      {
        label: "All Products",
        href: "/products",
      },
      {
        label: "Rare Bucephalandra",
        href: "https://duckaroo.com.au/collections/bucephalandra-anubias",
      },
      {
        label: "Accessories",
        href: "https://duckaroo.com.au/collections/accessories",
      },
      {
        label: "Alo Doctor",
        href: "https://alodoctor.com.au/",
      },
      {
        label: "Fish tank Cleaning Service",
        href: "https://www.fishtankcleaning.com.au/",
      },
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Blogs", href: "/blogs" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      {
        label: "Customer Stories",
        href: "/customer-stories",
      },
      { label: "FAQ", href: "/faq" },
    ],
  };

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com/aquaticswandesign",
      label: "Facebook",
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: "https://www.youtube.com/@aquaticswandesigntv1518",
      label: "YouTube",
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://www.instagram.com/__duckaroo__/",
      label: "Instagram",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:aquaticswandesign@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="w-full bg-abyss border-t border-cream/10 text-cream">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-display font-semibold tracking-[0.14em] uppercase mb-4 text-parchment">
              Aquatic Swan Design
            </h3>
            <p className="text-cream/65 mb-4 leading-relaxed">
              Creating stunning aquatic landscapes that bring the tranquility
              and beauty of nature into your space.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-cream/65 hover:text-amber-glow hover:bg-cream/10 rounded-full"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-glow font-medium">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-cream/65 hover:text-amber-glow transition-colors duration-200"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-glow font-medium">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-cream/65 hover:text-amber-glow transition-colors duration-200"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-glow font-medium">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-cream/65 hover:text-amber-glow transition-colors duration-200"
                    {...(link.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-cream/10 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-cream/55 text-sm" suppressHydrationWarning>
            Copyright &copy; {new Date().getFullYear()} - Aquatic Swan Design.
            All rights reserved.
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-cream/55 text-sm">Secure payments</span>
            <Image
              src="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712660/payment_cewxih"
              alt="Accepted payment methods"
              width={201}
              height={22}
              className="opacity-70"
              loading="lazy"
              sizes="201px"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
