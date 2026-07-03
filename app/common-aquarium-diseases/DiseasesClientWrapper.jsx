"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TYPE_LABELS = {
  "Parasitic (Ciliate Protozoan)": { label: "Parasitic", color: "text-amber-400" },
  "Parasitic (Dinoflagellate)": { label: "Parasitic", color: "text-amber-400" },
  "Parasitic (Microsporidian)": { label: "Parasitic", color: "text-amber-400" },
  "Parasitic": { label: "Parasitic", color: "text-amber-400" },
  "Bacterial": { label: "Bacterial", color: "text-blue-400" },
  "Bacterial/Physical": { label: "Bacterial", color: "text-blue-400" },
  "Viral": { label: "Viral", color: "text-red-400" },
  "Fungal": { label: "Fungal", color: "text-purple-400" },
  "Environmental": { label: "Environmental", color: "text-slate-400" },
  "Environmental/Nutritional": { label: "Environmental", color: "text-slate-400" },
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Search diseases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-emerald-500/50"
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
                    ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                    : "border-white/20 text-white hover:border-white/40"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-white/35 text-xs mb-8">
          {filtered.length} of {diseases.length} diseases
        </p>

        {/* Disease List */}
        {filtered.length === 0 ? (
          <p className="text-white/50 py-8 text-center">No diseases match that filter.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {filtered.map((disease) => {
              const typeInfo = TYPE_LABELS[disease.disease_type] || { label: disease.disease_type, color: "text-slate-400" };
              const tankColor = TANK_COLORS[disease.tank_type] || "text-slate-400";
              const preview = disease.blog_paragraph
                ? disease.blog_paragraph.length > 200
                  ? disease.blog_paragraph.slice(0, 200) + "…"
                  : disease.blog_paragraph
                : null;

              return (
                <article key={disease.id} className="py-6 group">
                  <div className="flex items-center gap-3 mb-1.5 text-xs">
                    <span className={`font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
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
                        <span className="text-red-300 font-medium">Notifiable</span>
                      </>
                    )}
                    {disease.zoonotic && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-orange-400">Zoonotic</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    <Link href={`/common-aquarium-diseases/${disease.slug}`}>
                      {disease.disease_name}
                    </Link>
                  </h2>
                  {disease.common_names && (
                    <p className="text-white/45 text-sm mt-0.5 italic">{disease.common_names}</p>
                  )}
                  {preview && (
                    <p className="text-white/60 text-sm leading-relaxed mt-2 line-clamp-2">{preview}</p>
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
                          className="group relative overflow-hidden rounded bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all"
                        >
                          <img
                            src={image.url}
                            alt={disease.disease_name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </a>
                      ))}
                      {disease.images.length > 3 && (
                        <div className="relative overflow-hidden rounded bg-white/5 border border-white/10 flex items-center justify-center">
                          <span className="text-white/70 text-sm font-medium">+{disease.images.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/common-aquarium-diseases/${disease.slug}`}
                    className="inline-block mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
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
