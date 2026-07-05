import Image from "next/image";

export default function AquariumGuideBanner() {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <Image
                src="https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto,w_1200,h_600,c_fill/v1757335537/bucephalandra_bush_oyiznj"
                alt="Beautiful planted aquarium setup guide - The Ultimate Beginner's Guide"
                fill
                className="object-cover"
                priority
                sizes="100vw"
                quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-abyss" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                    <h1 className="font-display text-5xl md:text-7xl font-medium text-parchment mb-6 drop-shadow-lg tracking-tight">
                        The Ultimate <span className="text-amber-glow">Beginner&apos;s Guide</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-cream/85 drop-shadow-md max-w-2xl mx-auto">
                        Everything you need to know to set up and maintain a thriving aquarium ecosystem.
                    </p>
                </div>
            </div>
        </div>
    );
}
