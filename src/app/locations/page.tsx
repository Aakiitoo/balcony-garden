"use client";

import Link from "next/link";
import { getLocations, getPlantsByLocation } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { formatLocationSunlight } from "@/lib/labels";
import { MapPin, Plus } from "lucide-react";

export default function LocationsPage() {
  useStoreVersion();
  const locations = getLocations();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Locations</h1>
          <p className="mt-1 text-stone-600">
            Balcony spots and planters where your plants live.
          </p>
        </div>
        <Link
          href="/locations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          <Plus className="h-5 w-5" />
          Create new location
        </Link>
      </header>

      {locations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
          No locations yet.{" "}
          <Link
            href="/locations/new"
            className="font-medium text-emerald-700 hover:underline"
          >
            Create your first location
          </Link>
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => {
            const count = getPlantsByLocation(loc.id).length;
            return (
              <li key={loc.id}>
                <Link
                  href={`/locations/detail?id=${loc.id}`}
                  className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <h2 className="font-semibold text-stone-900">{loc.name}</h2>
                    <p className="mt-0.5 text-xs text-amber-800">
                      {formatLocationSunlight(loc)}
                    </p>
                    {loc.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                        {loc.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-stone-500">
                      {count} plant{count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
