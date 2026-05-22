"use client";

import { getMyCompanions } from "@/lib/garden";
import { useStoreVersion } from "@/hooks/use-store";
import { RELATIONSHIP_LABELS } from "@/lib/labels";
import { EmptyGardenPrompt } from "@/components/EmptyGardenPrompt";
import { MyPlantsSummary } from "@/components/MyPlantsSummary";
import { Users, ThumbsUp, ThumbsDown } from "lucide-react";

export default function CompanionsGuidePage() {
  useStoreVersion();
  const { ctx: ctxGood, companions: good } = getMyCompanions("good");
  const { companions: bad } = getMyCompanions("bad");
  const ctx = ctxGood;
  const hasPairs = good.length > 0 || bad.length > 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Users className="h-7 w-7 text-sky-500" />
          Pot companions for your plants
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Pairings that involve at least one plant type you are growing.
        </p>
      </header>

      <EmptyGardenPrompt
        hasPlants={ctx.hasPlants}
        hasLinkedCatalog={ctx.hasLinkedCatalog}
        guideName="Companion planting"
      />

      {ctx.hasLinkedCatalog && (
        <>
          <MyPlantsSummary ctx={ctx} />
          {!hasPairs ? (
            <p className="rounded-xl border border-stone-200 bg-white px-6 py-8 text-center text-sm text-stone-600">
              No companion pairings match your current plant types yet. Add more
              linked types (e.g. tomato + basil) to see suggestions.
            </p>
          ) : (
            <>
              {good.length > 0 && (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-800">
                    <ThumbsUp className="h-5 w-5" />
                    Good together
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {good.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4"
                      >
                        <p className="font-semibold">
                          {c.plantA} + {c.plantB}
                        </p>
                        <p className="mt-1 text-xs text-emerald-700">
                          {c.samePot ? "Same pot" : "Adjacent pots"} ·{" "}
                          {RELATIONSHIP_LABELS[c.relationship]}
                        </p>
                        <p className="mt-2 text-sm text-stone-700">{c.notes}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {bad.length > 0 && (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-rose-800">
                    <ThumbsDown className="h-5 w-5" />
                    Avoid together
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {bad.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-rose-200 bg-rose-50/30 p-4"
                      >
                        <p className="font-semibold">
                          {c.plantA} + {c.plantB}
                        </p>
                        <p className="mt-1 text-xs text-rose-700">
                          {c.samePot ? "Never same pot" : "Keep apart"}
                        </p>
                        <p className="mt-2 text-sm text-stone-700">{c.notes}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
