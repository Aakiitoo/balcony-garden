"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useState } from "react";
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

  const [mode, setMode] = useState<"type" | "mine">(
    plantParam ? "mine" : "type",
  );
  const [typeId, setTypeId] = useState(catalogParam ?? "");
  const [plantId, setPlantId] = useState(plantParam ?? "");

  const myPlants = getMyPlants();
  const resolved = resolveCatalogId({ catalog: catalogParam, plant: plantParam });

  function apply() {
    const params = new URLSearchParams();
    if (mode === "mine" && plantId) {
      params.set("plant", plantId);
    } else if (typeId) {
      params.set("catalog", typeId);
    }
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
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
            onChange={() => setMode("type")}
          />
          Plant type
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="tipMode"
            checked={mode === "mine"}
            onChange={() => setMode("mine")}
            disabled={myPlants.length === 0}
          />
          One of my plants
        </label>
      </div>
      {mode === "type" ? (
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="">Select plant type…</option>
          {plantCatalog.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          <option value="">Select your plant…</option>
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
      <button
        type="button"
        onClick={apply}
        className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Show tips
      </button>
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
