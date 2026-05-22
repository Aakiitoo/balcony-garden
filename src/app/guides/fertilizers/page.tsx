"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlantTipsPicker } from "@/components/PlantTipsPicker";
import { resolveCatalogId, getFertilizersForCatalog } from "@/lib/tips";
import { getCatalogById } from "@/lib/data/reference";
import { FlaskConical } from "lucide-react";

function FertilizersContent() {
  const searchParams = useSearchParams();
  const { catalogId, label } = resolveCatalogId({
    catalog: searchParams.get("catalog"),
    plant: searchParams.get("plant"),
  });
  const fertilizers = catalogId ? getFertilizersForCatalog(catalogId) : [];
  const typeName = catalogId ? getCatalogById(catalogId)?.name : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <FlaskConical className="h-7 w-7 text-violet-500" />
          Fertilizers
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Feeding advice for a plant type.
        </p>
      </header>
      <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-sm text-violet-950">
        <p className="font-medium">What is N-P-K?</p>
        <p className="mt-1 text-violet-900/90">
          The three numbers on fertilizer labels are{" "}
          <strong>Nitrogen (N)</strong> — leafy growth,{" "}
          <strong>Phosphorus (P)</strong> — roots and flowers, and{" "}
          <strong>Potassium (K)</strong> — fruit quality and disease resistance.
          A 5-10-10 feed is low nitrogen, higher phosphorus and potassium — often
          used when plants start flowering or fruiting.
        </p>
      </div>
      <PlantTipsPicker />
      {!catalogId ? (
        <p className="text-sm text-stone-500">
          Select a plant type or one of your plants above.
        </p>
      ) : fertilizers.length === 0 ? (
        <p className="text-sm text-stone-500">No fertilizer entries for {label ?? typeName}.</p>
      ) : (
        <ul className="space-y-4">
          {fertilizers.map((f) => (
            <li
              key={f.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                {f.npk && (
                  <span className="font-mono text-sm text-stone-500">
                    NPK {f.npk}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-900">
                  {f.growthStage}
                </span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                  {f.type}
                </span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                  {f.frequency}
                </span>
              </div>
              <p className="mt-3 text-sm text-stone-700">{f.applicationNotes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FertilizersGuidePage() {
  return (
    <Suspense>
      <FertilizersContent />
    </Suspense>
  );
}
