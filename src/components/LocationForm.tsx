"use client";

import { useRouter } from "next/navigation";
import type { Location } from "@/lib/types";
import { createLocation, updateLocation } from "@/lib/store";
import { useRefreshStore } from "@/hooks/use-store";

export function LocationForm({ location }: { location?: Location }) {
  const router = useRouter();
  const { refresh } = useRefreshStore();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const description = String(fd.get("description") || "").trim();
    if (!name) return;

    if (location) {
      updateLocation(location.id, name, description);
      refresh();
      router.push(`/locations/detail?id=${location.id}`);
    } else {
      const id = createLocation(name, description);
      refresh();
      router.push(`/locations/detail?id=${id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Name *</span>
        <input
          name="name"
          required
          defaultValue={location?.name}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          placeholder="e.g. South balcony rail"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          About this spot (optional)
        </span>
        <textarea
          name="description"
          rows={3}
          defaultValue={location?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          placeholder="Sun exposure, wind, what works here…"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800"
        >
          {location ? "Save location" : "Create location"}
        </button>
        <p className="text-xs text-stone-500">* Required fields</p>
      </div>
    </form>
  );
}
