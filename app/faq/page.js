"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { faqItems } from "./faqData";

function FaqItem({ item, index, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/40 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50">
      <h3 className="m-0">
        <button
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
        >
          <span className="text-base md:text-lg font-semibold text-white">
            {item.question}
          </span>
          <ChevronDown
            className={`shrink-0 text-blue-400 transition-transform duration-300 ${
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
        <p className="p-5 md:p-6 pt-0 md:pt-0 text-gray-300 leading-relaxed border-t border-gray-700/50">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white">
      <Navbar />

      <main className="pt-28 md:pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-2xl text-blue-400 mb-6">
              <HelpCircle size={32} aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Questions
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
          <section className="mt-14 text-center bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Our friendly team is happy to help. Get a free, no-obligation quote
              for your fish tank or pond today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/service"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:from-blue-600 hover:to-cyan-500 transition-colors"
              >
                Get a Free Quote
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-600 text-white font-semibold hover:bg-gray-800 transition-colors"
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
