"use client";

import { getMyFertilizers } from "@/lib/garden";
import { useStoreVersion } from "@/hooks/use-store";
import { EmptyGardenPrompt } from "@/components/EmptyGardenPrompt";
import { MyPlantsSummary } from "@/components/MyPlantsSummary";
import { FlaskConical } from "lucide-react";

export default function FertilizersGuidePage() {
  useStoreVersion();
  const { ctx, fertilizers } = getMyFertilizers();
  const catalogMap = Object.fromEntries(
    ctx.catalogPlants.map((p) => [p.id, p.name]),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <FlaskConical className="h-7 w-7 text-violet-500" />
          Fertilizers for your plants
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Feeding schedules only for the plant types in your garden.
        </p>
      </header>

      <EmptyGardenPrompt
        hasPlants={ctx.hasPlants}
        hasLinkedCatalog={ctx.hasLinkedCatalog}
        guideName="Fertilizer advice"
      />

      {ctx.hasLinkedCatalog && (
        <>
          <MyPlantsSummary ctx={ctx} />
          {fertilizers.length === 0 ? (
            <p className="text-sm text-stone-500">
              No fertilizer entries for your linked types yet.
            </p>
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
                  {f.plantCatalogId && (
                    <p className="mt-1 text-sm text-emerald-700">
                      For: {catalogMap[f.plantCatalogId]}
                    </p>
                  )}
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
        </>
      )}
    </div>
  );
}
