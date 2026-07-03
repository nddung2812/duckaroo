"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageUploader({ images = [], folder = "stock", onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const uploadRes = await fetch("/api/stock/upload", {
        method: "POST",
        body: formData,
      });
      const data = await uploadRes.json();

      if (uploadRes.ok && data.url) {
        onChange([...images, { url: data.url, public_id: data.public_id }]);
      } else {
        console.error("Upload failed:", data.error || uploadRes.statusText);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(idx) {
    const img = images[idx];
    if (img.public_id) {
      await fetch("/api/stock/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.public_id }),
      });
    }
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((img, idx) => (
        <div key={idx} className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={img.url}
            alt={`Image ${idx + 1}`}
            fill
            className="object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 leading-none"
          >
            ×
          </button>
        </div>
      ))}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
      >
        {uploading ? (
          <span className="text-xs text-gray-500 text-center px-1">Uploading…</span>
        ) : (
          <span className="text-2xl text-gray-400 leading-none">+</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
