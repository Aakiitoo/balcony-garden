"use client";

import { getMySunlightGuide } from "@/lib/garden";
import { useStoreVersion } from "@/hooks/use-store";
import { SUNLIGHT_TYPE_LABELS, CATEGORY_LABELS } from "@/lib/labels";
import { EmptyGardenPrompt } from "@/components/EmptyGardenPrompt";
import { MyPlantsSummary } from "@/components/MyPlantsSummary";
import { Sun } from "lucide-react";

export default function SunlightGuidePage() {
  useStoreVersion();
  const { ctx, plants } = getMySunlightGuide();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Sun className="h-7 w-7 text-amber-500" />
          Sunlight for your plants
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Light needs for the plant types you are actually growing.
        </p>
      </header>

      <EmptyGardenPrompt
        hasPlants={ctx.hasPlants}
        hasLinkedCatalog={ctx.hasLinkedCatalog}
        guideName="Sunlight advice"
      />

      {ctx.hasLinkedCatalog && (
        <>
          <MyPlantsSummary ctx={ctx} />
          {plants.length === 0 ? (
            <p className="text-sm text-stone-500">No sunlight data for your linked types.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Plant type</th>
                    <th className="px-4 py-3 font-semibold">Hours</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="hidden px-4 py-3 font-semibold md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {plants.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3">
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-2 text-xs text-stone-500">
                          {CATEGORY_LABELS[p.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.sunlightHours}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          {SUNLIGHT_TYPE_LABELS[p.sunlightType] ?? p.sunlightType}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-stone-600 md:table-cell">
                        {p.sunlightNotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
