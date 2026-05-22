"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Location } from "@/lib/types";
import {
  createLocation,
  updateLocation,
  parseLocationForm,
} from "@/lib/store";
import { useRefreshStore } from "@/hooks/use-store";

export function LocationForm({ location }: { location?: Location }) {
  const router = useRouter();
  const { refresh } = useRefreshStore();
  const [sunlightMode, setSunlightMode] = useState<"full_shade" | "hours">(
    location?.sunlightMode ?? "hours",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = parseLocationForm(new FormData(e.currentTarget));
    if (!form.name) return;

    if (location) {
      updateLocation(location.id, form);
      refresh();
      router.push(`/locations/detail?id=${location.id}`);
    } else {
      const id = createLocation(form);
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

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-700">
          Daily sunlight *
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="sunlightMode"
            value="full_shade"
            checked={sunlightMode === "full_shade"}
            onChange={() => setSunlightMode("full_shade")}
          />
          Full shade
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="sunlightMode"
            value="hours"
            checked={sunlightMode === "hours"}
            onChange={() => setSunlightMode("hours")}
          />
          Hours of direct sun per day
        </label>
        {sunlightMode === "hours" && (
          <select
            name="sunlightHours"
            required
            defaultValue={location?.sunlightHours ?? 6}
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => (
              <option key={h} value={h}>
                {h} hour{h === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        )}
      </fieldset>

      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          About this spot (optional)
        </span>
        <textarea
          name="description"
          rows={3}
          defaultValue={location?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          placeholder="Wind, what grows well here, rail vs floor…"
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
