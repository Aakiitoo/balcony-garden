"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PlantTipsPicker } from "@/components/PlantTipsPicker";
import { resolveCatalogId, getCompanionsForCatalog } from "@/lib/tips";
import { RELATIONSHIP_LABELS } from "@/lib/labels";
import { Users, ThumbsUp, ThumbsDown } from "lucide-react";

function CompanionsContent() {
  const searchParams = useSearchParams();
  const { catalogId, label } = resolveCatalogId({
    catalog: searchParams.get("catalog"),
    plant: searchParams.get("plant"),
  });
  const good = catalogId ? getCompanionsForCatalog(catalogId, "good") : [];
  const bad = catalogId ? getCompanionsForCatalog(catalogId, "bad") : [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-emerald-950">
          <Users className="h-7 w-7 text-sky-500" />
          Pot companions
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          What grows well next to a plant type in pots on your balcony.
        </p>
      </header>
      <PlantTipsPicker />
      {!catalogId ? (
        <p className="text-sm text-stone-500">
          Select a plant type or one of your plants above.
        </p>
      ) : good.length === 0 && bad.length === 0 ? (
        <p className="text-sm text-stone-500">
          No companion entries for {label} yet.
        </p>
      ) : (
        <>
          {good.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-emerald-800">
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
                      {c.samePot ? "Same pot" : "Adjacent pots"}
                    </p>
                    <p className="mt-2 text-sm text-stone-700">{c.notes}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {bad.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-800">
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
                    <p className="mt-2 text-sm text-stone-700">{c.notes}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function CompanionsGuidePage() {
  return (
    <Suspense>
      <CompanionsContent />
    </Suspense>
  );
}
