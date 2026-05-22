"use client";

import { useState } from "react";
import { addPlantImage, deletePlantImage } from "@/lib/store";
import type { PlantImage } from "@/lib/types";
import { useRefreshStore } from "@/hooks/use-store";
import { Trash2, Upload } from "lucide-react";

export function ImageUpload({
  plantId,
  images,
}: {
  plantId: number;
  images: PlantImage[];
}) {
  const { refresh } = useRefreshStore();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        addPlantImage(plantId, reader.result);
        refresh();
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-emerald-100">
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : "Add photo"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      <p className="text-xs text-stone-500">
        Photos are stored in your browser on this device (not uploaded to a server).
      </p>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.dataUrl}
                alt={img.caption || "Plant photo"}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  deletePlantImage(img.id);
                  refresh();
                }}
                className="absolute right-1 top-1 rounded bg-red-600/90 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                title="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
