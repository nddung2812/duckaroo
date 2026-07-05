"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageAmbience from "../components/PageAmbience";
import { faqItems } from "./faqData";

function FaqItem({ item, index, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border border-cream/15 rounded-2xl overflow-hidden bg-cream/5 backdrop-blur-sm transition-all duration-300 hover:border-amber-glow/50">
      <h3 className="m-0">
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left bg-cream/5 hover:bg-cream/10 transition-colors"
        >
          <span className="font-display text-base md:text-lg font-medium text-parchment">
            {item.question}
          </span>
          <ChevronDown
            className={`shrink-0 text-amber-glow transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            size={22}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="p-5 md:p-6 pt-0 md:pt-0 text-cream/75 leading-relaxed border-t border-cream/15">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) =>
    setOpenIndex((current) => (current === index ? -1 : index));

  return (
    <div className="min-h-screen text-cream">
      <PageAmbience />
      <Navbar />

      <main className="relative z-10 pt-28 md:pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-moss/60 rounded-2xl text-amber-glow mb-6">
              <HelpCircle size={32} aria-hidden="true" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-parchment mb-4 tracking-tight">
              Frequently Asked{" "}
              <span className="text-amber-glow">
                Questions
              </span>
            </h1>
            <p className="text-lg text-cream/75 max-w-2xl mx-auto">
              Everything you need to know about Duckaroo&apos;s fish tank
              cleaning, aquarium maintenance, pond services, and setup across
              Brisbane &amp; the Gold Coast.
            </p>
          </header>

          {/* Accordion */}
          <section aria-label="Frequently asked questions" className="space-y-4">
            {faqItems.map((item, index) => (
              <FaqItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            ))}
          </section>

          {/* CTA */}
          <section className="mt-14 text-center bg-moss/40 border border-cream/15 rounded-2xl p-8">
            <h2 className="font-display text-2xl md:text-3xl font-medium text-parchment mb-3">
              Still have questions?
            </h2>
            <p className="text-cream/75 mb-6 max-w-xl mx-auto">
              Our friendly team is happy to help. Get a free, no-obligation quote
              for your fish tank or pond today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/service"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-glow text-[#04121b] text-[13px] uppercase tracking-[0.14em] font-medium hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)] transition-shadow"
              >
                Get a Free Quote
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cream/30 text-cream/90 text-[13px] uppercase tracking-[0.14em] font-medium bg-transparent hover:border-cream/60 hover:bg-cream/5 transition-colors"
              >
                <Phone size={18} aria-hidden="true" />
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
