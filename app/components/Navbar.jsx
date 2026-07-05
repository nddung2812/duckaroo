"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/service", label: "Service" },
    {
      label: "Blogs",
      dropdown: [
        { href: "/blogs", label: "All Blogs" },
        {
          href: "/how-to-setup-your-first-aquarium",
          label: "Aquarium Setup Guide",
        },
        {
          href: "/common-aquarium-diseases",
          label: "Aquarium Disease Guide",
        },
      ],
    },
    {
      href: "/customer-stories",
      label: "Customer Stories",
    },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/about-us", label: "About" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-abyss/60 backdrop-blur-md border-b border-cream/10">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl"
              alt="Swan logo"
              width={60}
              height={60}
              className="w-14 h-14 md:w-16 md:h-16"
              priority
            />
            <span className="text-cream font-display font-semibold text-lg tracking-[0.16em] uppercase whitespace-nowrap hidden sm:block">
              Aquatic Swan Design
            </span>
          </Link>

          {/* Desktop Navigation - Only show on XL screens (1280px+) */}
          <div className="hidden xl:flex items-center space-x-5 2xl:space-x-7">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      className="text-cream/85 hover:text-amber-glow transition-colors duration-200 text-[12px] uppercase tracking-[0.12em] whitespace-nowrap flex items-center space-x-1"
                      onMouseEnter={() => setDropdownOpen(true)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-ink/95 backdrop-blur-md border border-cream/10 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-cream/85 hover:text-amber-glow hover:bg-cream/5 transition-all duration-200 text-[13px] uppercase tracking-[0.14em]"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-cream/85 hover:text-amber-glow transition-colors duration-200 text-[12px] uppercase tracking-[0.12em] whitespace-nowrap"
                  {...(item.href.startsWith("http") && {
                    target: "_blank",
                    rel: "noreferrer",
                  })}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA Buttons - Only show on XL screens (1280px+) */}
          <div className="hidden xl:flex items-center space-x-3 shrink-0">
            <Button
              asChild
              className="rounded-full border border-amber-glow/70 bg-transparent text-amber-glow hover:bg-amber-glow hover:text-[#04121b] text-[12px] uppercase tracking-[0.12em] px-5 whitespace-nowrap transition-colors"
            >
              <Link href="/products">Shop Plants</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-amber-glow text-[#04121b] hover:bg-amber-glow/90 text-[12px] uppercase tracking-[0.12em] px-5 whitespace-nowrap shadow-[0_4px_20px_rgba(232,160,92,0.3)]"
            >
              <Link href="/service">Service</Link>
            </Button>
          </div>

          {/* Mobile Menu - Show up to XL screens (up to 1279px) */}
          <Sheet>
            <SheetTrigger asChild className="xl:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="text-cream w-12 h-12 rounded-full border border-cream/30 hover:border-cream/50 hover:bg-cream/10 transition-all duration-200"
              >
                <Menu className="h-7 w-7" aria-hidden="true" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-ink/95 backdrop-blur-md border-cream/10 [&>button]:text-cream [&>button]:hover:text-cream/80"
            >
              <SheetHeader>
                <SheetTitle className="text-cream font-display text-left">
                  Navigation Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => {
                  if (item.dropdown) {
                    return (
                      <div key={item.label} className="space-y-2">
                        <button
                          onClick={() =>
                            setMobileDropdownOpen(!mobileDropdownOpen)
                          }
                          className="text-cream/85 hover:text-amber-glow transition-colors duration-200 font-display text-2xl flex items-center justify-between w-full"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileDropdownOpen && (
                          <div className="pl-4 space-y-3 border-l-2 border-amber-glow/30 animate-in slide-in-from-top-2 duration-200">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block text-cream/75 hover:text-amber-glow transition-colors duration-200"
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-cream/85 hover:text-amber-glow transition-colors duration-200 font-display text-2xl"
                      {...(item.href.startsWith("http") && {
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="flex flex-col space-y-4 pt-6 border-t border-cream/10">
                  <Button
                    asChild
                    className="rounded-full border border-amber-glow/70 bg-transparent text-amber-glow hover:bg-amber-glow hover:text-[#04121b] text-[12px] uppercase tracking-[0.14em] transition-colors"
                  >
                    <Link href="/products">Shop Plants</Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-full bg-amber-glow text-[#04121b] hover:bg-amber-glow/90 text-[12px] uppercase tracking-[0.14em] shadow-[0_4px_20px_rgba(232,160,92,0.3)]"
                  >
                    <Link href="/service">Service</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
