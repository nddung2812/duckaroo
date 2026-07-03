export const revalidate = 3600;

import { getDiseaseBySlug, getAllDiseaseSlugs } from "@/lib/diseases";
import { getDiseaseImages } from "@/lib/cloudinary";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ChevronRight, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const rows = await getAllDiseaseSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const disease = await getDiseaseBySlug(slug);

  if (!disease) return { title: "Disease Not Found" };

  const truncateAtWord = (text, max) => {
    if (!text || text.length <= max) return text;
    return text.slice(0, text.lastIndexOf(" ", max)) + "...";
  };

  const description = truncateAtWord(disease.blog_paragraph, 155);

  return {
    title: `${disease.disease_name} | Aquarium Disease Guide | Duckaroo`,
    description,
    keywords: `${disease.disease_name}, ${disease.common_names ?? ""}, aquarium disease, fish disease Australia`,
    metadataBase: new URL("https://aquaticswandesign.com.au"),
    alternates: {
      canonical: `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}`,
    },
    openGraph: {
      title: `${disease.disease_name} | Aquarium Disease Guide`,
      description,
      url: `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}`,
      images: disease.image_url ? [{ url: disease.image_url, alt: disease.disease_name }] : [],
      type: "article",
      siteName: "Duckaroo",
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title: `${disease.disease_name} | Aquarium Disease Guide`,
      description,
      images: disease.image_url ? [disease.image_url] : [],
    },
    robots: { index: true, follow: true },
  };
}

const TYPE_COLORS = {
  "Parasitic (Ciliate Protozoan)": "text-amber-400",
  "Parasitic (Dinoflagellate)": "text-amber-400",
  "Parasitic (Microsporidian)": "text-amber-400",
  "Parasitic": "text-amber-400",
  "Bacterial": "text-blue-400",
  "Bacterial/Physical": "text-blue-400",
  "Viral": "text-red-400",
  "Fungal": "text-purple-400",
  "Environmental": "text-slate-400",
  "Environmental/Nutritional": "text-slate-400",
};

const TANK_COLORS = {
  Freshwater: "text-cyan-400",
  Marine: "text-blue-300",
  Both: "text-emerald-400",
};

const getTankTypeLabel = (tankType) => {
  const labels = {
    Freshwater: "Freshwater",
    Marine: "Marine",
    Both: "Freshwater & Marine",
  };
  return labels[tankType] || tankType;
};

const bulletList = (text) =>
  text
    ?.split(";")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

export default async function DiseasePage({ params }) {
  const { slug } = await params;
  const disease = await getDiseaseBySlug(slug);

  if (!disease) notFound();

  const images = await getDiseaseImages(disease.disease_name);

  const typeColor = TYPE_COLORS[disease.disease_type] || "text-slate-400";
  const tankColor = TANK_COLORS[disease.tank_type] || "text-slate-400";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}#article`,
        url: `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}`,
        headline: disease.disease_name,
        description: disease.blog_paragraph?.slice(0, 155),
        image: disease.image_url ?? undefined,
        author: {
          "@type": "Organization",
          "@id": "https://aquaticswandesign.com.au/#organization",
          name: "Duckaroo",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://aquaticswandesign.com.au/#organization",
          name: "Duckaroo",
          logo: {
            "@type": "ImageObject",
            url: "https://res.cloudinary.com/dhvj8x2nq/image/upload/f_auto,q_auto/v1739712659/swan-logo-transparent_rphcfl",
          },
        },
        datePublished: "2026-04-05",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}`,
        },
        articleSection: "Aquarium Diseases",
        keywords: disease.common_names ?? disease.disease_name,
        inLanguage: "en-AU",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aquaticswandesign.com.au" },
          { "@type": "ListItem", position: 2, name: "Common Aquarium Diseases", item: "https://aquaticswandesign.com.au/common-aquarium-diseases" },
          { "@type": "ListItem", position: 3, name: disease.disease_name, item: `https://aquaticswandesign.com.au/common-aquarium-diseases/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/40 text-xs mb-10">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/common-aquarium-diseases" className="hover:text-white/70 transition-colors">
              Aquarium Diseases
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{disease.disease_name}</span>
          </nav>

          {/* Title */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-3 items-center text-xs mb-3">
              <span className={`font-semibold ${typeColor}`}>
                {disease.disease_type.split("(")[0].trim()}
              </span>
              <span className="text-white/20">·</span>
              <span className={`${tankColor}`}>{getTankTypeLabel(disease.tank_type)}</span>
              {disease.contagious?.startsWith("Yes") && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-red-400">Contagious</span>
                </>
              )}
              {disease.notifiable_in_australia && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-red-300 font-semibold">Notifiable in Australia</span>
                </>
              )}
              {disease.zoonotic && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-orange-400">Zoonotic Risk</span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {disease.disease_name}
            </h1>
            {disease.common_names && (
              <p className="text-white/50 text-base mt-2 italic">{disease.common_names}</p>
            )}
          </header>

          {/* Hero Image */}
          {images.length > 0 && (
            <div className="mb-10">
              <div className="rounded-xl overflow-hidden h-56 md:h-80 w-full">
                <img
                  src={images[0].url}
                  alt={disease.disease_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {disease.image_credit && (
                <p className="text-xs text-white/30 mt-1.5 text-right italic">{disease.image_credit}</p>
              )}
            </div>
          )}

          {/* Alerts */}
          {disease.notifiable_in_australia && (
            <div className="flex gap-3 bg-red-950/40 border border-red-500/25 rounded-lg p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300 text-sm mb-1">Notifiable Disease in Australia</p>
                <p className="text-red-200/75 text-sm leading-relaxed">
                  If you suspect this disease, you are legally required to report it to your state&apos;s
                  Department of Agriculture, Fisheries and Forestry (DAFF) immediately.
                </p>
              </div>
            </div>
          )}

          {disease.zoonotic && (
            <div className="flex gap-3 bg-orange-950/40 border border-orange-500/25 rounded-lg p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-300 text-sm mb-1">Zoonotic Risk</p>
                <p className="text-orange-200/75 text-sm leading-relaxed">
                  This disease can potentially transfer to humans. Practice good hygiene when handling
                  affected fish and tank water.
                </p>
              </div>
            </div>
          )}

          {/* Article Body */}
          <article className="prose prose-invert max-w-none mt-8 divide-y divide-white/10">

            {/* Overview */}
            {disease.blog_paragraph && (
              <section className="pb-8">
                {disease.causative_agent && (
                  <p className="text-white/50 text-sm mb-4">
                    <span className="font-medium text-white/70">Causative agent:</span>{" "}
                    {disease.causative_agent}
                  </p>
                )}
                <p className="text-white/80 leading-relaxed text-base md:text-lg">
                  {disease.blog_paragraph}
                </p>
              </section>
            )}

            {/* Symptoms */}
            {disease.symptoms && (
              <section className="py-8">
                <h2 className="text-xl font-bold text-white mb-4">Symptoms</h2>
                <ul className="space-y-2">
                  {bulletList(disease.symptoms).map((item, i) => (
                    <li key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Treatment */}
            {disease.treatment && (
              <section className="py-8">
                <h2 className="text-xl font-bold text-white mb-4">Treatment</h2>
                <ul className="space-y-2">
                  {bulletList(disease.treatment).map((item, i) => (
                    <li key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Australian Medications */}
            {disease.australian_medications && (
              <section className="py-8">
                <h2 className="text-xl font-bold text-white mb-4">Australian Medications</h2>
                <ul className="space-y-2">
                  {bulletList(disease.australian_medications).map((item, i) => (
                    <li key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Commonly Affected Fish */}
            {disease.commonly_affected_fish && (
              <section className="py-8">
                <h2 className="text-xl font-bold text-white mb-4">Commonly Affected Fish</h2>
                <ul className="space-y-2">
                  {bulletList(disease.commonly_affected_fish).map((item, i) => (
                    <li key={i} className="flex gap-3 text-white/75 text-sm leading-relaxed">
                      <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Notes */}
            {disease.notes && (
              <section className="py-8">
                <h2 className="text-xl font-bold text-amber-300 mb-3">Important Notes</h2>
                <p className="text-amber-100/80 text-sm leading-relaxed">{disease.notes}</p>
              </section>
            )}
          </article>

          {/* Wikipedia Link */}
          {disease.wikipedia_url && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href={disease.wikipedia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Read more on Wikipedia <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm mb-1">Concerned about your aquarium?</p>
            <h2 className="text-xl font-bold text-white mb-3">
              Duckaroo covers Brisbane &amp; Gold Coast
            </h2>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              Our professional aquarium health service can help identify and treat fish diseases
              before they spread through your tank.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/service">Book an Aquarium Service</Link>
            </Button>
          </div>

          {/* Image Gallery Grid */}
          {images.length > 0 && (
            <div className="mt-12 pt-12 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6">Disease Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <a
                    key={image.public_id}
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all"
                  >
                    <img
                      src={image.url}
                      alt={disease.disease_name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/common-aquarium-diseases"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              ← All aquarium diseases
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
