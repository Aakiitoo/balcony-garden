"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlantTipsPicker } from "@/components/PlantTipsPicker";
import { resolveCatalogId, getSunlightForCatalog } from "@/lib/tips";
import {
  SUNLIGHT_TYPE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/labels";
import { Sun } from "lucide-react";

function SunlightContent() {
  const searchParams = useSearchParams();
  const { catalogId, label } = resolveCatalogId({
    catalog: searchParams.get("catalog"),
    plant: searchParams.get("plant"),
  });
  const plant = catalogId ? getSunlightForCatalog(catalogId) : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Sun className="h-7 w-7 text-amber-500" />
          Sunlight
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Light needs for a plant type — pick a type or one of your plants by name.
        </p>
      </header>
      <PlantTipsPicker />
      {!catalogId ? (
        <p className="text-sm text-stone-500">
          Select a plant type or one of your plants above to see sunlight advice.
        </p>
      ) : plant ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{label ?? plant.name}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-stone-500">Category</dt>
              <dd>{CATEGORY_LABELS[plant.category]}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Hours</dt>
              <dd>{plant.sunlightHours}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Light type</dt>
              <dd>
                {SUNLIGHT_TYPE_LABELS[plant.sunlightType] ?? plant.sunlightType}
              </dd>
            </div>
            {plant.sunlightNotes && (
              <div>
                <dt className="text-stone-500">Notes</dt>
                <dd className="text-stone-700">{plant.sunlightNotes}</dd>
              </div>
            )}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

export default function SunlightGuidePage() {
  return (
    <Suspense>
      <SunlightContent />
    </Suspense>
  );
}
