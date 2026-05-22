"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlantTipsPicker } from "@/components/PlantTipsPicker";
import { resolveCatalogId, getDiseasesForCatalog } from "@/lib/tips";
import { getCatalogById } from "@/lib/data/reference";
import { Bug } from "lucide-react";

function DiseasesContent() {
  const searchParams = useSearchParams();
  const { catalogId, label } = resolveCatalogId({
    catalog: searchParams.get("catalog"),
    plant: searchParams.get("plant"),
  });
  const diseases = catalogId ? getDiseasesForCatalog(catalogId) : [];
  const typeName = catalogId ? getCatalogById(catalogId)?.name : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Bug className="h-7 w-7 text-rose-500" />
          Diseases & pests
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Issues for a plant type plus general balcony pests.
        </p>
      </header>
      <PlantTipsPicker />
      {!catalogId ? (
        <p className="text-sm text-stone-500">
          Select a plant type or one of your plants above.
        </p>
      ) : diseases.length === 0 ? (
        <p className="text-sm text-stone-500">No entries for {label ?? typeName}.</p>
      ) : (
        <ul className="space-y-4">
          {diseases.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{d.name}</h2>
              <p className="mt-1 text-sm text-stone-500">
                {d.plantCatalogId
                  ? `Affects: ${typeName}`
                  : "General — many balcony plants"}
              </p>
              <p className="mt-3 text-sm">
                <span className="font-medium text-stone-700">Symptoms: </span>
                {d.symptoms}
              </p>
              {d.prevention && (
                <p className="mt-2 text-sm">
                  <span className="font-medium text-stone-700">Prevention: </span>
                  {d.prevention}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-3 text-sm">
                  <p className="font-medium text-emerald-900">Organic options</p>
                  <p className="mt-1 text-emerald-950/90">{d.organicTreatment}</p>
                </div>
                {d.chemicalTreatment && (
                  <div className="rounded-lg bg-stone-100 p-3 text-sm">
                    <p className="font-medium text-stone-800">
                      Insecticide / fungicide options
                    </p>
                    <p className="mt-1 text-stone-700">{d.chemicalTreatment}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function DiseasesGuidePage() {
  return (
    <Suspense>
      <DiseasesContent />
    </Suspense>
  );
}
