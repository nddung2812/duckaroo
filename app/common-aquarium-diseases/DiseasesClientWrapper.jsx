"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TYPE_LABELS = {
  "Parasitic (Ciliate Protozoan)": { label: "Parasitic", color: "text-amber-glow" },
  "Parasitic (Dinoflagellate)": { label: "Parasitic", color: "text-amber-glow" },
  "Parasitic (Microsporidian)": { label: "Parasitic", color: "text-amber-glow" },
  "Parasitic": { label: "Parasitic", color: "text-amber-glow" },
  "Bacterial": { label: "Bacterial", color: "text-amber-glow" },
  "Bacterial/Physical": { label: "Bacterial", color: "text-amber-glow" },
  "Viral": { label: "Viral", color: "text-amber-glow" },
  "Fungal": { label: "Fungal", color: "text-amber-glow" },
  "Environmental": { label: "Environmental", color: "text-amber-glow" },
  "Environmental/Nutritional": { label: "Environmental", color: "text-amber-glow" },
};

const TANK_COLORS = {
  Freshwater: "text-cream/75",
  Marine: "text-cream/75",
  Both: "text-cream/75",
};

const getTankTypeLabel = (tankType) => {
  const labels = {
    Freshwater: "Freshwater",
    Marine: "Marine",
    Both: "Freshwater & Marine",
  };
  return labels[tankType] || tankType;
};

export default function DiseasesClientWrapper({ diseases }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = diseases;
    if (activeFilter === "Freshwater")
      result = result.filter((d) => d.tank_type === "Freshwater" || d.tank_type === "Both");
    if (activeFilter === "Marine")
      result = result.filter((d) => d.tank_type === "Marine" || d.tank_type === "Both");
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.disease_name.toLowerCase().includes(q) ||
          (d.common_names && d.common_names.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeFilter, searchQuery, diseases]);

  return (
    <div className="px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/50 w-4 h-4" />
            <Input
              placeholder="Search diseases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/5 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow/50"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Freshwater", "Marine"].map((filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                size="sm"
                variant={activeFilter === filter ? "default" : "outline"}
                className={
                  activeFilter === filter
                    ? "rounded-full bg-amber-glow text-[#04121b] border-amber-glow hover:bg-amber-glow/90"
                    : "rounded-full border border-cream/30 text-cream/90 bg-transparent hover:border-cream/60 hover:bg-cream/5"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-cream/50 text-xs mb-8">
          {filtered.length} of {diseases.length} diseases
        </p>

        {/* Disease List */}
        {filtered.length === 0 ? (
          <p className="text-cream/60 py-8 text-center">No diseases match that filter.</p>
        ) : (
          <div className="divide-y divide-cream/15">
            {filtered.map((disease) => {
              const typeInfo = TYPE_LABELS[disease.disease_type] || { label: disease.disease_type, color: "text-amber-glow" };
              const tankColor = TANK_COLORS[disease.tank_type] || "text-cream/75";
              const preview = disease.blog_paragraph
                ? disease.blog_paragraph.length > 200
                  ? disease.blog_paragraph.slice(0, 200) + "…"
                  : disease.blog_paragraph
                : null;

              return (
                <article key={disease.id} className="py-6 group">
                  <div className="flex items-center gap-3 mb-1.5 text-xs">
                    <span className={`font-medium uppercase tracking-[0.14em] ${typeInfo.color}`}>{typeInfo.label}</span>
                    <span className="text-cream/30">·</span>
                    <span className={`${tankColor}`}>{getTankTypeLabel(disease.tank_type)}</span>
                    {disease.contagious?.startsWith("Yes") && (
                      <>
                        <span className="text-cream/30">·</span>
                        <span className="text-red-300">Contagious</span>
                      </>
                    )}
                    {disease.notifiable_in_australia && (
                      <>
                        <span className="text-cream/30">·</span>
                        <span className="text-red-300 font-medium">Notifiable</span>
                      </>
                    )}
                    {disease.zoonotic && (
                      <>
                        <span className="text-cream/30">·</span>
                        <span className="text-orange-300">Zoonotic</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-display font-medium text-parchment group-hover:text-amber-glow transition-colors leading-snug">
                    <Link href={`/common-aquarium-diseases/${disease.slug}`}>
                      {disease.disease_name}
                    </Link>
                  </h2>
                  {disease.common_names && (
                    <p className="text-cream/60 text-sm mt-0.5 italic">{disease.common_names}</p>
                  )}
                  {preview && (
                    <p className="text-cream/75 text-sm leading-relaxed mt-2 line-clamp-2">{preview}</p>
                  )}

                  {/* Image Grid */}
                  {disease.images && disease.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {disease.images.slice(0, 3).map((image) => (
                        <a
                          key={image.public_id}
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-xl bg-cream/5 border border-cream/15 hover:border-amber-glow/50 transition-all"
                        >
                          <img
                            src={image.url}
                            alt={disease.disease_name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </a>
                      ))}
                      {disease.images.length > 3 && (
                        <div className="relative overflow-hidden rounded-xl bg-cream/5 border border-cream/15 flex items-center justify-center">
                          <span className="text-cream/75 text-sm font-medium">+{disease.images.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/common-aquarium-diseases/${disease.slug}`}
                    className="inline-block mt-3 text-amber-glow hover:text-amber-glow/80 text-xs font-medium uppercase tracking-[0.14em] transition-colors"
                  >
                    View guide →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
