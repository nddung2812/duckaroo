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
        <div className="mb-6 border border-gray-700 rounded-xl overflow-hidden bg-gray-800/40 backdrop-blur-sm transition-all duration-300 hover:border-gray-600">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400">
                        <Icon size={24} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                </div>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-6 border-t border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, children, type = "info" }) {
    const styles = {
        info: "bg-blue-900/20 border-blue-800/50 text-blue-100",
        warning: "bg-yellow-900/20 border-yellow-800/50 text-yellow-100",
        tip: "bg-green-900/20 border-green-800/50 text-green-100",
        default: "bg-gray-800/50 border-gray-700 text-gray-200"
    };

    const icons = {
        info: <BookOpen size={18} />,
        warning: <AlertCircle size={18} />,
        tip: <CheckCircle2 size={18} />,
        default: <div />
    };

    return (
        <div className={`p-4 rounded-lg border ${styles[type]} mb-4`}>
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
        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-300 group-hover:text-blue-400 transition-colors">
                    <Icon size={20} />
                </div>
                {link && (
                    <Link href={link} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        Shop <ShoppingBag size={12} />
                    </Link>
                )}
            </div>
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-3">{description}</p>
            <div className="text-xs bg-blue-900/30 text-blue-200 p-2 rounded border border-blue-800/30">
                <span className="font-semibold">Best Pick:</span> {recommendation}
            </div>
        </div>
    );
}

function FeaturedProduct({ title, image, link, description }) {
    return (
        <Link href={link} target="_blank" className="group block relative overflow-hidden rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
            <div className="relative h-48 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-2">
                        {title} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2">{description}</p>
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
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">
                    Your First Aquarium
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
                    <p className="text-gray-300">
                        Before buying anything, you must understand the <strong>Nitrogen Cycle</strong>.
                        This is the biological engine of your aquarium.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-700">
                            <div className="text-red-400 font-bold mb-2">1. Ammonia</div>
                            <p className="text-xs text-gray-400">Fish waste & food creates toxic Ammonia.</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-700">
                            <div className="text-yellow-400 font-bold mb-2">2. Nitrite</div>
                            <p className="text-xs text-gray-400">Bacteria converts Ammonia to Nitrite (still toxic).</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-700">
                            <div className="text-green-400 font-bold mb-2">3. Nitrate</div>
                            <p className="text-xs text-gray-400">More bacteria converts Nitrite to Nitrate (safe in low levels).</p>
                        </div>
                    </div>

                    <InfoCard title="The Golden Rule" type="warning">
                        <strong>Never add fish immediately!</strong> You must &quot;cycle&quot; the tank first to build up these beneficial bacteria. This takes 4-8 weeks, or 1 week with seeded media.
                    </InfoCard>

                    <div className="flex justify-center mt-4">
                        <Link
                            href="https://duckaroo.com.au/collections/accessories"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 text-blue-300 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-500/30 text-sm font-medium"
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
                    <div className="relative border-l-2 border-blue-500/30 pl-8 space-y-8">
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                            <h3 className="text-lg font-bold text-white mb-2">Prep & Position</h3>
                            <p className="text-gray-400 text-sm">Place tank on a level stand. Rinse substrate (sand/gravel) thoroughly until water runs clear.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                            <h3 className="text-lg font-bold text-white mb-2">Hardscape & Planting</h3>
                            <p className="text-gray-400 text-sm">Add rocks, wood, and plants. <span className="text-blue-300">Epiphytes</span> like Anubias and Java Fern are best for beginners—glue or tie them to rocks, don&apos;t bury them!</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
                            <h3 className="text-lg font-bold text-white mb-2">Fill & Dechlorinate</h3>
                            <p className="text-gray-400 text-sm">Fill with water (use a plate to prevent disturbing sand). Add <strong>Dechlorinator</strong> immediately.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">4</span>
                            <h3 className="text-lg font-bold text-white mb-2">Start the Cycle</h3>
                            <p className="text-gray-400 text-sm">Turn on filter and heater. Add an ammonia source (fish food or pure ammonia). Wait 4-8 weeks or use seeded media.</p>
                        </div>
                    </div>

                    <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700 text-center">
                        <h4 className="text-white font-bold mb-3">Need Plants?</h4>
                        <p className="text-sm text-gray-400 mb-4">Live plants help filter your water and make fish feel safe.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-semibold"
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
                    <p className="text-gray-300">
                        Once your test kit shows <strong>0 Ammonia, 0 Nitrite, and some Nitrates</strong>, you are cycled!
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <Fish size={18} className="text-pink-400" /> Beginner Stars
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Betta Fish (Solo)</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Guppies or Endlers</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Cherry Shrimp</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> White Cloud Minnows</li>
                            </ul>
                            <Link href="https://duckaroo.com.au/collections/aquarium-shrimp" className="inline-block mt-4 text-xs text-blue-400 hover:text-blue-300">
                                Browse Live Stock →
                            </Link>
                        </div>

                        <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-green-400" /> Weekly Routine
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Change 20-30% of water</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Test water parameters</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Rinse filter sponge in tank water</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Scrape glass algae</li>
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
            <div className="mt-12 p-8 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-blue-800/30 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto,w_1200,h_600,c_fill/v1757335537/bucephalandra_bush_oyiznj')] opacity-10 bg-cover bg-center" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Dive In?</h2>
                    <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                        The key to a successful aquarium is patience. Take your time, test your water, and enjoy the process of creating a world.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Shop Equipment
                        </Link>
                        <Link
                            href="https://duckaroo.com.au/collections/aquarium-shrimp"
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-gray-900/20"
                        >
                            Browse Fish & Shrimp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
