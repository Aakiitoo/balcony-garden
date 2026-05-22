"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addPlantImage, deletePlantImage } from "@/lib/actions/plants";
import { Trash2, Upload } from "lucide-react";

type PlantImage = {
  id: number;
  filename: string;
  caption: string | null;
};

export function ImageUpload({
  plantId,
  images,
}: {
  plantId: number;
  images: PlantImage[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { filename } = await res.json();
      await addPlantImage(plantId, filename);
      router.refresh();
    }
    setUploading(false);
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
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/uploads/${img.filename}`}
                alt={img.caption || "Plant photo"}
                className="h-full w-full object-cover"
              />
              <form
                action={deletePlantImage.bind(null, img.id, plantId)}
                className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <button
                  type="submit"
                  className="rounded bg-red-600/90 p-1.5 text-white hover:bg-red-700"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
