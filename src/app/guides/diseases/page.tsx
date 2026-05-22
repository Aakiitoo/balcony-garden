import { getMyDiseases } from "@/lib/actions/guides";
import { RECOMMENDATION_LABELS } from "@/lib/labels";
import { EmptyGardenPrompt } from "@/components/EmptyGardenPrompt";
import { MyPlantsSummary } from "@/components/MyPlantsSummary";
import { Bug } from "lucide-react";

export default async function DiseasesGuidePage() {
  const { ctx, diseases } = await getMyDiseases();
  const catalogMap = Object.fromEntries(
    ctx.catalogPlants.map((p) => [p.id, p.name]),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Bug className="h-7 w-7 text-rose-500" />
          Diseases & pests for your plants
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Issues that affect your linked plant types, plus common balcony pests
          when you have plants growing.
        </p>
      </header>

      <EmptyGardenPrompt
        hasPlants={ctx.hasPlants}
        hasLinkedCatalog={ctx.hasLinkedCatalog}
        guideName="Disease & pest advice"
      />

      {ctx.hasLinkedCatalog && (
        <>
          <MyPlantsSummary ctx={ctx} />

          {diseases.length === 0 ? (
            <p className="text-sm text-stone-500">No disease entries for your plants yet.</p>
          ) : (
            <ul className="space-y-4">
              {diseases.map((d) => (
                <li
                  key={d.id}
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">{d.name}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        d.recommendation === "organic_preferred"
                          ? "bg-emerald-100 text-emerald-800"
                          : d.recommendation === "chemical_last_resort"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {RECOMMENDATION_LABELS[d.recommendation] ?? d.recommendation}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    {d.plantCatalogId
                      ? `Affects: ${catalogMap[d.plantCatalogId]}`
                      : "General — can affect many balcony plants"}
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
        </>
      )}
    </div>
  );
}
