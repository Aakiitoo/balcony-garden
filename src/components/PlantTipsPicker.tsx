"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getMyPlants } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { resolveCatalogId } from "@/lib/tips";
import { plantCatalog } from "@/lib/data/reference";

function PlantTipsPickerInner() {
  useStoreVersion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogParam = searchParams.get("catalog");
  const plantParam = searchParams.get("plant");

  const myPlants = getMyPlants();
  const mode = plantParam ? "mine" : "type";
  const resolved = resolveCatalogId({ catalog: catalogParam, plant: plantParam });

  useEffect(() => {
    if (catalogParam || plantParam) return;
    const firstCatalog = plantCatalog[0]?.id;
    if (firstCatalog) {
      router.replace(`${pathname}?catalog=${firstCatalog}`);
    }
  }, [catalogParam, plantParam, pathname, router]);

  function navigateType(catalogId: string) {
    router.replace(`${pathname}?catalog=${catalogId}`);
  }

  function navigatePlant(id: string) {
    router.replace(`${pathname}?plant=${id}`);
  }

  function switchToType() {
    const id = catalogParam ?? String(plantCatalog[0]?.id ?? "");
    if (id) navigateType(id);
    else router.replace(pathname);
  }

  function switchToMine() {
    const first = myPlants[0];
    if (first) navigatePlant(String(first.id));
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-stone-800">Show tips for</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="tipMode"
            checked={mode === "type"}
            onChange={switchToType}
          />
          Plant type
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="tipMode"
            checked={mode === "mine"}
            onChange={switchToMine}
            disabled={myPlants.length === 0}
          />
          One of my plants
        </label>
      </div>
      {mode === "type" ? (
        <select
          value={catalogParam ?? String(plantCatalog[0]?.id ?? "")}
          onChange={(e) => navigateType(e.target.value)}
          className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          {plantCatalog.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={plantParam ?? (myPlants[0] ? String(myPlants[0].id) : "")}
          onChange={(e) => navigatePlant(e.target.value)}
          className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          disabled={myPlants.length === 0}
        >
          {myPlants.map((p) => {
            const typeName =
              plantCatalog.find((c) => c.id === p.catalogPlantId)?.name ?? "";
            return (
              <option key={p.id} value={p.id}>
                {p.name} ({typeName})
              </option>
            );
          })}
        </select>
      )}
      {resolved.catalogId && resolved.label && (
        <p className="mt-3 text-sm text-emerald-800">
          Showing tips for: <strong>{resolved.label}</strong>
        </p>
      )}
    </div>
  );
}

export function PlantTipsPicker() {
  return (
    <Suspense fallback={<div className="h-24 rounded-xl bg-stone-100" />}>
      <PlantTipsPickerInner />
    </Suspense>
  );
}
