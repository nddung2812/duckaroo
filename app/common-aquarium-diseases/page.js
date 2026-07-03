import { getAllDiseases } from "@/lib/diseases";
import { getDiseaseImages } from "@/lib/cloudinary";
import Layout from "@/app/components/Layout";
import DiseasesClientWrapper from "./DiseasesClientWrapper";
import { Badge } from "@/components/ui/badge";

const BASE = "https://aquaticswandesign.com.au";

export default async function CommonAquariumDiseasesPage() {
  const diseases = await getAllDiseases();

  const diseasesWithImages = await Promise.all(
    diseases.map(async (disease) => ({
      ...disease,
      images: await getDiseaseImages(disease.disease_name),
    }))
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE}/common-aquarium-diseases`,
        url: `${BASE}/common-aquarium-diseases`,
        name: "Common Aquarium Diseases — Identification & Treatment Guide",
        description:
          "A comprehensive guide to 30 common aquarium diseases affecting freshwater and marine fish in Australia, including symptoms, treatments, and Australian medication options.",
        publisher: {
          "@type": "Organization",
          "@id": `${BASE}/#organization`,
          name: "Duckaroo",
        },
        inLanguage: "en-AU",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: diseases.length,
          itemListElement: diseases.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE}/common-aquarium-diseases/${d.slug}`,
            name: d.disease_name,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Aquarium Diseases",
            item: `${BASE}/common-aquarium-diseases`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Layout className="bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <section className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-emerald-500/20 border-emerald-500/50 text-emerald-300">
              Fish Health Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Common Aquarium Diseases
              </span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              A comprehensive guide to 30 freshwater and marine fish diseases found in Australian aquariums.
              Identify symptoms, discover Australian-available treatments, and prevent outbreaks in your tank.
            </p>
          </div>
        </section>

        <DiseasesClientWrapper diseases={diseasesWithImages} />
      </Layout>
    </>
  );
}
