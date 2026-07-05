"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronDown,
    ChevronUp,
    Droplets,
    Fish,
    Lightbulb,
    Thermometer,
    Wind,
    CheckCircle2,
    AlertCircle,
    BookOpen,
    ShoppingBag,
    ArrowRight
} from "lucide-react";

// --- Components ---

function Phase({ title, icon: Icon, children, isOpen, onToggle }) {
    return (
        <div className="mb-6 border border-cream/15 rounded-2xl overflow-hidden bg-cream/5 backdrop-blur-sm transition-all duration-300 hover:border-amber-glow/50">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left bg-cream/5 hover:bg-cream/10 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-moss/60 rounded-lg text-amber-glow">
                        <Icon size={24} />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-medium text-parchment">{title}</h2>
                </div>
                {isOpen ? <ChevronUp className="text-amber-glow" /> : <ChevronDown className="text-amber-glow" />}
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 border-t border-cream/15">
                    {children}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, children, type = "info" }) {
    const styles = {
        info: "bg-moss/40 border-cream/15 text-cream/90",
        warning: "bg-yellow-900/20 border-yellow-800/50 text-yellow-100",
        tip: "bg-moss/40 border-amber-glow/30 text-cream/90",
        default: "bg-cream/5 border-cream/15 text-cream/80"
    };

    const icons = {
        info: <BookOpen size={18} />,
        warning: <AlertCircle size={18} />,
        tip: <CheckCircle2 size={18} />,
        default: <div />
    };

    return (
        <div className={`p-4 rounded-2xl border ${styles[type]} mb-4`}>
            <div className="flex items-center gap-2 mb-2 font-semibold opacity-90">
                {icons[type]}
                <span>{title}</span>
            </div>
            <div className="text-sm leading-relaxed opacity-90">
                {children}
            </div>
        </div>
    );
}

function EquipmentCard({ title, icon: Icon, description, recommendation, link }) {
    return (
        <div className="bg-cream/5 p-5 rounded-2xl border border-cream/15 hover:border-amber-glow/50 transition-all group">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-moss/60 rounded-lg text-cream/75 group-hover:text-amber-glow transition-colors">
                    <Icon size={20} />
                </div>
                {link && (
                    <Link href={link} target="_blank" className="text-xs text-amber-glow hover:text-amber-glow/80 flex items-center gap-1">
                        Shop <ShoppingBag size={12} />
                    </Link>
                )}
            </div>
            <h3 className="font-display font-medium text-parchment mb-2">{title}</h3>
            <p className="text-sm text-cream/60 mb-3">{description}</p>
            <div className="text-xs bg-moss/60 text-cream/85 p-2 rounded border border-amber-glow/30">
                <span className="font-semibold text-amber-glow">Best Pick:</span> {recommendation}
            </div>
        </div>
    );
}

function FeaturedProduct({ title, image, link, description }) {
    return (
        <Link href={link} target="_blank" className="group block relative overflow-hidden rounded-2xl border border-cream/15 hover:border-amber-glow/50 transition-all">
            <div className="relative h-48 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="font-display text-lg font-medium text-parchment group-hover:text-amber-glow transition-colors flex items-center gap-2">
                        {title} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-cream/80 line-clamp-2">{description}</p>
                </div>
            </div>
        </Link>
    );
}

export default function GuideContent() {
    const [openPhase, setOpenPhase] = useState(1);

    const togglePhase = (phase) => {
        setOpenPhase(openPhase === phase ? null : phase);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Intro Section */}
            <div className="text-center mb-16">
                <h1 className="font-display text-4xl md:text-6xl font-medium text-amber-glow mb-6">
                    Your First Aquarium
                </h1>
                <p className="text-xl text-cream/75 max-w-2xl mx-auto leading-relaxed">
                    A simplified, step-by-step guide to building a thriving ecosystem.
                    No fluff, just what you need to know.
                </p>
            </div>

            {/* Phase 1: The Foundation */}
            <Phase
                title="Phase 1: The Foundation"
                icon={BookOpen}
                isOpen={openPhase === 1}
                onToggle={() => togglePhase(1)}
            >
                <div className="space-y-6">
                    <p className="text-cream/75">
                        Before buying anything, you must understand the <strong>Nitrogen Cycle</strong>.
                        This is the biological engine of your aquarium.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-cream/5 p-4 rounded-2xl text-center border border-cream/15">
                            <div className="text-red-400 font-bold mb-2">1. Ammonia</div>
                            <p className="text-xs text-cream/60">Fish waste & food creates toxic Ammonia.</p>
                        </div>
                        <div className="bg-cream/5 p-4 rounded-2xl text-center border border-cream/15">
                            <div className="text-yellow-400 font-bold mb-2">2. Nitrite</div>
                            <p className="text-xs text-cream/60">Bacteria converts Ammonia to Nitrite (still toxic).</p>
                        </div>
                        <div className="bg-cream/5 p-4 rounded-2xl text-center border border-cream/15">
                            <div className="text-green-400 font-bold mb-2">3. Nitrate</div>
                            <p className="text-xs text-cream/60">More bacteria converts Nitrite to Nitrate (safe in low levels).</p>
                        </div>
                    </div>

                    <InfoCard title="The Golden Rule" type="warning">
                        <strong>Never add fish immediately!</strong> You must &quot;cycle&quot; the tank first to build up these beneficial bacteria. This takes 4-8 weeks, or 1 week with seeded media.
                    </InfoCard>

                    <div className="flex justify-center mt-4">
                        <Link
                            href="https://duckaroo.com.au/collections/accessories"
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-cream/30 text-cream/90 rounded-full bg-transparent hover:border-cream/60 hover:bg-cream/5 transition-colors text-[13px] uppercase tracking-[0.14em] font-medium"
                        >
                            <ShoppingBag size={16} /> Shop Water Testing Kits
                        </Link>
                    </div>
                </div>
            </Phase>

            {/* Phase 2: Gear Up */}
            <Phase
                title="Phase 2: Essential Gear"
                icon={ShoppingBag}
                isOpen={openPhase === 2}
                onToggle={() => togglePhase(2)}
            >
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <EquipmentCard
                        title="The Tank"
                        icon={Droplets}
                        description="Bigger is actually easier. More water volume means more stability."
                        recommendation="20 Gallon Long (Glass)"
                    />
                    <EquipmentCard
                        title="Filtration"
                        icon={Wind}
                        description="The home for your beneficial bacteria. Needs to run 24/7."
                        recommendation="Hang-On-Back or Sponge Filter"
                        link="https://duckaroo.com.au/collections/accessories"
                    />
                    <EquipmentCard
                        title="Heating"
                        icon={Thermometer}
                        description="Most tropical fish need stable warmth (76-80°F)."
                        recommendation="Adjustable Heater (5W per gallon)"
                        link="https://duckaroo.com.au/collections/accessories"
                    />
                    <EquipmentCard
                        title="Lighting"
                        icon={Lightbulb}
                        description="Essential for plants and viewing. Don't leave on 24/7!"
                        recommendation="LED with Timer (6-8 hours/day)"
                        link="https://duckaroo.com.au/collections/accessories"
                    />
                </div>

                <div className="mb-6">
                    <FeaturedProduct
                        title="Essential Filtration"
                        description="Keep your water crystal clear with our top-rated filters suitable for beginners."
                        image="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto,w_600,h_400,c_fill/v1756906679/best-small-fish-tank-filter_c3egvr"
                        link="https://duckaroo.com.au/collections/accessories"
                    />
                </div>

                <div className="mt-6">
                    <InfoCard title="Budget Tip" type="tip">
                        Check local marketplaces for used tanks, but <strong>always leak test</strong> them outside or in a bathtub before setting up!
                    </InfoCard>
                </div>
            </Phase>

            {/* Phase 3: The Setup */}
            <Phase
                title="Phase 3: Building It"
                icon={CheckCircle2}
                isOpen={openPhase === 3}
                onToggle={() => togglePhase(3)}
            >
                <div className="space-y-8">
                    <div className="relative border-l-2 border-amber-glow/30 pl-8 space-y-8">
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-glow text-xs font-bold text-[#04121b]">1</span>
                            <h3 className="font-display text-lg font-medium text-parchment mb-2">Prep & Position</h3>
                            <p className="text-cream/60 text-sm">Place tank on a level stand. Rinse substrate (sand/gravel) thoroughly until water runs clear.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-glow text-xs font-bold text-[#04121b]">2</span>
                            <h3 className="font-display text-lg font-medium text-parchment mb-2">Hardscape & Planting</h3>
                            <p className="text-cream/60 text-sm">Add rocks, wood, and plants. <span className="text-amber-glow">Epiphytes</span> like Anubias and Java Fern are best for beginners—glue or tie them to rocks, don&apos;t bury them!</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-glow text-xs font-bold text-[#04121b]">3</span>
                            <h3 className="font-display text-lg font-medium text-parchment mb-2">Fill & Dechlorinate</h3>
                            <p className="text-cream/60 text-sm">Fill with water (use a plate to prevent disturbing sand). Add <strong>Dechlorinator</strong> immediately.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-glow text-xs font-bold text-[#04121b]">4</span>
                            <h3 className="font-display text-lg font-medium text-parchment mb-2">Start the Cycle</h3>
                            <p className="text-cream/60 text-sm">Turn on filter and heater. Add an ammonia source (fish food or pure ammonia). Wait 4-8 weeks or use seeded media.</p>
                        </div>
                    </div>

                    <div className="bg-cream/5 p-6 rounded-2xl border border-cream/15 text-center">
                        <h4 className="font-display font-medium text-parchment mb-3">Need Plants?</h4>
                        <p className="text-sm text-cream/60 mb-4">Live plants help filter your water and make fish feel safe.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-glow text-[#04121b] rounded-full transition-shadow text-[13px] uppercase tracking-[0.14em] font-medium hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                        >
                            Shop Beginner Plants <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </Phase>

            {/* Phase 4: Life */}
            <Phase
                title="Phase 4: Adding Life"
                icon={Fish}
                isOpen={openPhase === 4}
                onToggle={() => togglePhase(4)}
            >
                <div className="space-y-6">
                    <p className="text-cream/75">
                        Once your test kit shows <strong>0 Ammonia, 0 Nitrite, and some Nitrates</strong>, you are cycled!
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-cream/5 p-5 rounded-2xl border border-cream/15">
                            <h3 className="font-display font-medium text-parchment mb-3 flex items-center gap-2">
                                <Fish size={18} className="text-amber-glow" /> Beginner Stars
                            </h3>
                            <ul className="space-y-2 text-sm text-cream/75">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-glow" /> Betta Fish (Solo)</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-glow" /> Guppies or Endlers</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-glow" /> Cherry Shrimp</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-glow" /> White Cloud Minnows</li>
                            </ul>
                            <Link href="https://duckaroo.com.au/collections/aquarium-shrimp" className="inline-block mt-4 text-xs text-amber-glow hover:text-amber-glow/80">
                                Browse Live Stock →
                            </Link>
                        </div>

                        <div className="bg-cream/5 p-5 rounded-2xl border border-cream/15">
                            <h3 className="font-display font-medium text-parchment mb-3 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-amber-glow" /> Weekly Routine
                            </h3>
                            <ul className="space-y-2 text-sm text-cream/75">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cream/40" /> Change 20-30% of water</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cream/40" /> Test water parameters</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cream/40" /> Rinse filter sponge in tank water</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cream/40" /> Scrape glass algae</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4">
                        <FeaturedProduct
                            title="Colorful Community Fish"
                            description="Browse our selection of hardy, peaceful fish perfect for your first community tank."
                            image="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto,w_600,h_400,c_fill/v1757336118/different-types-of-guppy-rainbow-fish_panpilai-paipa_Shutterstock-3-1_rvoint"
                            link="https://duckaroo.com.au/collections/aquarium-shrimp"
                        />
                    </div>
                </div>
            </Phase>

            {/* Call to Action */}
            <div className="mt-12 p-8 bg-moss/40 rounded-2xl border border-cream/15 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto,w_1200,h_600,c_fill/v1757335537/bucephalandra_bush_oyiznj')] opacity-10 bg-cover bg-center" />
                <div className="relative z-10">
                    <h2 className="font-display text-2xl font-medium text-parchment mb-4">Ready to Dive In?</h2>
                    <p className="text-cream/75 mb-6 max-w-lg mx-auto">
                        The key to a successful aquarium is patience. Take your time, test your water, and enjoy the process of creating a world.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="px-6 py-3 bg-amber-glow text-[#04121b] font-medium rounded-full transition-shadow text-[13px] uppercase tracking-[0.14em] hover:shadow-[0_6px_30px_rgba(232,160,92,0.35)]"
                        >
                            Shop Equipment
                        </Link>
                        <Link
                            href="https://duckaroo.com.au/collections/aquarium-shrimp"
                            className="px-6 py-3 border border-cream/30 text-cream/90 rounded-full bg-transparent hover:border-cream/60 hover:bg-cream/5 transition-colors text-[13px] uppercase tracking-[0.14em] font-medium"
                        >
                            Browse Fish & Shrimp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
