// Single source of truth for the FAQ page.
// Both the visible accordion (page.js) and the FAQPage JSON-LD (layout.js)
// are generated from this array, so the structured data always matches the
// on-page content — a requirement for valid Google FAQ rich results.
//
// Items are grouped on the page by `category`, which must match an id in
// `faqCategories` below. Category is presentation-only and is not emitted
// into the JSON-LD.

export const faqCategories = [
  {
    id: "services",
    label: "Our services",
    blurb: "What a visit involves, how often, and what we can look after.",
  },
  {
    id: "pricing-booking",
    label: "Pricing, booking & coverage",
    blurb: "What it costs, where we go, and how to get us out to your place.",
  },
  {
    id: "fish-health",
    label: "Fish health",
    blurb: "When something in the tank doesn't look right.",
  },
];

export const faqItems = [
  {
    category: "services",
    question: "What is included in a professional fish tank cleaning service?",
    answer:
      "A standard Duckaroo service includes a partial water change, gravel or substrate vacuuming, algae removal from glass and decorations, filter inspection and cleaning, water parameter testing (ammonia, nitrite, nitrate, pH), and a general health check of your fish and plants. We also top up dechlorinated water and dose any necessary water conditioners. Every visit finishes with a quick summary of your tank's condition and any recommendations.",
  },
  {
    category: "services",
    question: "How often should my aquarium be cleaned and maintained?",
    answer:
      "Most home aquariums benefit from professional maintenance every 2 to 4 weeks, while larger or heavily stocked tanks may need weekly attention. Regular servicing keeps water parameters stable, prevents algae build-up, and protects fish health. Duckaroo offers flexible schedules — one-off cleans, fortnightly, or monthly maintenance plans — tailored to your tank size, stocking level, and filtration setup. We'll recommend the ideal frequency after assessing your aquarium.",
  },
  {
    category: "services",
    question: "Do you maintain ponds as well as indoor aquariums?",
    answer:
      "Yes, Duckaroo services outdoor ponds in addition to indoor fish tanks. Our pond services include cleaning, debris and sludge removal, pump and filter maintenance, water quality testing, algae control, and general health checks for pond fish such as goldfish and koi. Whether it's a small backyard feature or a large ornamental pond, we help keep the water clear and the ecosystem healthy year-round.",
  },
  {
    category: "services",
    question: "Can you set up a brand new aquarium from scratch?",
    answer:
      "Yes. Duckaroo offers complete aquarium setup services, taking you from a bare tank to a fully functioning, beautiful aquarium. This includes tank placement, equipment installation (filter, heater, lighting), substrate and hardscape design, aquascaping and planting, and guidance through the all-important nitrogen cycling process so your tank is ready for fish. We can design freshwater, planted, or display tanks to suit your space and style.",
  },
  {
    category: "services",
    question: "What types of aquariums and fish do you work with?",
    answer:
      "We work with a wide range of setups including freshwater community tanks, planted and aquascaped aquariums, coldwater goldfish tanks, and larger display aquariums. Our team is experienced with tropical fish, livebearers, cichlids, bettas, and live aquatic plants. Whether you have a small desktop tank or a large feature aquarium, Duckaroo has the expertise and equipment to keep it thriving.",
  },
  {
    category: "pricing-booking",
    question: "How much does a fish tank cleaning service cost?",
    answer:
      "Pricing depends on your tank size, its current condition, and how often you'd like it serviced. One-off deep cleans are priced differently from ongoing maintenance contracts, which attract better rates. Duckaroo offers competitive, transparent pricing with no hidden fees. The best way to get an accurate figure is to request a free, no-obligation quote — just tell us your tank size and location and we'll provide a personalised price.",
  },
  {
    category: "pricing-booking",
    question:
      "What areas do you service for fish tank cleaning and aquarium maintenance?",
    answer:
      "Duckaroo provides professional fish tank cleaning and aquarium maintenance across Brisbane and the Gold Coast, including surrounding areas such as Logan, Ipswich, Redlands, and the northern and southern Brisbane suburbs. We service both residential homes and commercial premises like offices, restaurants, medical clinics, and retail spaces. If you're unsure whether we cover your suburb, contact us and we'll confirm availability for your location.",
  },
  {
    category: "pricing-booking",
    question: "How do I book a fish tank cleaning service or request a quote?",
    answer:
      "Booking is easy. Head to our Service page and fill out the quick enquiry form with your name, contact details, location, and a short description of your tank or pond — you can even attach a photo. We'll get back to you promptly with a quote and available times. You can also reach us through our Contact page. There's no obligation, and we're happy to answer any questions before you book.",
  },
  {
    category: "pricing-booking",
    question: "Do I need to be home during the aquarium service?",
    answer:
      "It's not essential, but it can be helpful for your first visit so we can discuss your goals and any concerns. For ongoing maintenance, many of our regular customers provide access and we service the tank while they're at work or out. We're fully professional, careful in your home or business, and always leave the area clean and tidy. Arrangements can be made to suit your schedule and preferences.",
  },
  {
    category: "fish-health",
    question: "My fish look unwell — can you help diagnose and treat diseases?",
    answer:
      "Absolutely. Our technicians are experienced in identifying common aquarium fish diseases such as white spot (ich), fin rot, fungal infections, and parasites. During a service we assess fish behaviour and symptoms, test water quality (a frequent cause of illness), and recommend appropriate treatment. You can also browse our detailed Aquarium Disease Guide for symptoms and treatments, and we stock quality medications and water treatments to help your fish recover.",
  },
];
