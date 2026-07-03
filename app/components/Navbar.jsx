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
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl"
              alt="Swan logo"
              width={60}
              height={60}
              className="w-14 h-14 md:w-16 md:h-16"
              priority
            />
            <span className="text-white font-bold text-xl hidden sm:block">
              Aquatic Swan Design
            </span>
          </Link>

          {/* Desktop Navigation - Only show on XL screens (1280px+) */}
          <div className="hidden xl:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="relative" ref={dropdownRef}>
                    <button
                      className="text-white/90 hover:text-purple-400 transition-colors duration-200 font-medium flex items-center space-x-1"
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
                      <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-white/90 hover:text-purple-400 hover:bg-white/5 transition-all duration-200 font-medium"
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
                  className="text-white/90 hover:text-purple-400 transition-colors duration-200 font-medium"
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
          <div className="hidden xl:flex items-center space-x-4">
            <Button
              asChild
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-700 border-none"
            >
              <Link href="/products">Shop Plants</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-700 border-none"
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
                className="text-white w-12 h-12 border border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              >
                <Menu className="h-7 w-7" aria-hidden="true" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-white/10 [&>button]:text-white [&>button]:hover:text-white/80"
            >
              <SheetHeader>
                <SheetTitle className="text-white text-left">
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
                          className="text-white/90 hover:text-purple-400 transition-colors duration-200 font-medium text-lg flex items-center justify-between w-full"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileDropdownOpen && (
                          <div className="pl-4 space-y-3 border-l-2 border-purple-400/30 animate-in slide-in-from-top-2 duration-200">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block text-white/80 hover:text-purple-400 transition-colors duration-200 font-medium"
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
                      className="text-white/90 hover:text-purple-400 transition-colors duration-200 font-medium text-lg"
                      {...(item.href.startsWith("http") && {
                        target: "_blank",
                        rel: "noreferrer",
                      })}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="flex flex-col space-y-4 pt-6 border-t border-white/10">
                  <Button
                    asChild
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:bg-gradient-to-br hover:from-emerald-600 hover:to-teal-700 border-none"
                  >
                    <Link href="/products">Shop Plants</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-indigo-700 border-none"
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
