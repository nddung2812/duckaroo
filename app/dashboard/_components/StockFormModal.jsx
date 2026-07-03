"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";

const CATEGORIES = [
  { value: "plants", label: "Plants" },
  { value: "livestock", label: "Livestock" },
  { value: "accessories", label: "Accessories" },
  { value: "probiotics", label: "Probiotics" },
];

const DEFAULT_FEATURES = [
  { value: "Premium quality" },
  { value: "AQUATIC SWAN DESIGN" },
  { value: "Fast shipping" },
];

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function StockFormModal({ item, onClose, onSave }) {
  const isEdit = !!item?.id;
  const [images, setImages] = useState([]);
  const [slugLocked, setSlugLocked] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      category: "plants",
      price: "",
      stock: "",
      description: "",
      spec_vendor: "Duckaroo",
      spec_category: "",
      spec_type: "Premium",
      reviews_rating: "4.9",
      reviews_count: "0",
      features: DEFAULT_FEATURES,
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  const nameValue = watch("name");

  // Auto-generate slug from name when creating a new item
  useEffect(() => {
    if (!isEdit && !slugLocked && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isEdit, slugLocked, setValue]);

  useEffect(() => {
    if (item) {
      const specs = item.specifications ?? {};
      const reviews = item.reviews ?? {};
      const rawFeatures = item.features;
      const featureList = Array.isArray(rawFeatures) && rawFeatures.length > 0
        ? rawFeatures.map((f) => ({ value: typeof f === "string" ? f : f.value ?? "" }))
        : DEFAULT_FEATURES;

      reset({
        name: item.name ?? "",
        slug: item.slug ?? "",
        category: item.category ?? "plants",
        price: item.price ?? "",
        stock: item.stock ?? "",
        description: item.description ?? "",
        spec_vendor: specs.Vendor ?? "Duckaroo",
        spec_category: specs.Category ?? "",
        spec_type: specs.Type ?? "Premium",
        reviews_rating: reviews.rating ?? "4.9",
        reviews_count: reviews.count ?? "0",
        features: featureList,
      });
      setImages(Array.isArray(item.images) ? item.images : []);
      setSlugLocked(false);
    }
  }, [item, reset]);

  async function onSubmit(data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description || null,
      images,
      features: data.features.map((f) => f.value).filter(Boolean),
      specifications: {
        Vendor: data.spec_vendor,
        Category: data.spec_category,
        Type: data.spec_type,
      },
      reviews: {
        rating: data.reviews_rating,
        count: Number(data.reviews_count),
        individual: item?.reviews?.individual ?? [],
      },
    };
    await onSave(payload, isEdit ? item.id : null);
  }

  const slugValue = watch("slug");
  const uploadFolder = `products/${slugValue || "draft"}`;

  const inputCls = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">

          {/* ── Name + Slug ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className={inputCls}
                placeholder="e.g. Anubias Afzelli"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Slug <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-400 ml-2">auto-generated · editable</span>
              </label>
              <input
                {...register("slug", { required: "Slug is required" })}
                onChange={(e) => { setSlugLocked(true); setValue("slug", e.target.value); }}
                className={`${inputCls} font-mono`}
                placeholder="auto-generated-from-name"
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          {/* ── Category + Price + Stock ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select {...register("category", { required: true })} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (AUD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" step="0.01" min="0"
                {...register("price", { required: "Required", min: { value: 0, message: "≥ 0" } })}
                className={inputCls}
                placeholder="0.00"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min="0"
                {...register("stock", { required: "Required", min: { value: 0, message: "≥ 0" } })}
                className={inputCls}
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          {/* ── Images ── */}
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <ImageUploader images={images} folder={uploadFolder} onChange={setImages} />
          </div>

          {/* ── Description ── */}
          <div>
            <label className="block text-sm font-medium mb-1">Description (HTML)</label>
            <textarea
              {...register("description")}
              rows={4}
              className={`${inputCls} font-mono resize-y`}
              placeholder="<p>Product description…</p>"
            />
          </div>

          {/* ── Features ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Features</label>
              <button
                type="button"
                onClick={() => appendFeature({ value: "" })}
                className="text-xs text-blue-600 hover:underline"
              >
                + Add feature
              </button>
            </div>
            <div className="space-y-2">
              {featureFields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`features.${idx}.value`)}
                    className={inputCls}
                    placeholder="e.g. Premium quality"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-red-400 hover:text-red-600 px-2 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Specifications ── */}
          <div>
            <label className="block text-sm font-medium mb-2">Specifications</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Vendor</label>
                <input {...register("spec_vendor")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <input
                  {...register("spec_category")}
                  className={inputCls}
                  placeholder="e.g. Product_Plants"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <input {...register("spec_type")} className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div>
            <label className="block text-sm font-medium mb-2">Reviews</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rating (0–5)</label>
                <input
                  type="number" step="0.1" min="0" max="5"
                  {...register("reviews_rating")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Review count</label>
                <input
                  type="number" min="0"
                  {...register("reviews_count")}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
