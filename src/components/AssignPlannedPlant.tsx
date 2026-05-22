"use client";

import { useState } from "react";
import { getMyPlants, assignPlantToLocation } from "@/lib/store";
import { useRefreshStore, useStoreVersion } from "@/hooks/use-store";
import { plantCatalog } from "@/lib/data/reference";
import { Plus } from "lucide-react";

export function AssignPlannedPlant({ locationId }: { locationId: number }) {
  useStoreVersion();
  const { refresh } = useRefreshStore();
  const planned = getMyPlants("planned").filter(
    (p) => p.locationId !== locationId,
  );
  const [selectedId, setSelectedId] = useState(
    planned[0] ? String(planned[0].id) : "",
  );

  if (planned.length === 0) return null;

  function handleAssign() {
    const id = Number(selectedId);
    if (!id) return;
    assignPlantToLocation(id, locationId);
    refresh();
    const remaining = getMyPlants("planned").filter(
      (p) => p.locationId !== locationId,
    );
    setSelectedId(remaining[0] ? String(remaining[0].id) : "");
  }

  return (
    <section className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
        <Plus className="h-4 w-4" />
        Add a planned plant to this location
      </h2>
      <p className="mt-1 text-xs text-emerald-800/80">
        Assign a plant you already planned — it keeps its status as Planned.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="min-w-[12rem] flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          {planned.map((p) => {
            const type =
              plantCatalog.find((c) => c.id === p.catalogPlantId)?.name ?? "";
            return (
              <option key={p.id} value={p.id}>
                {p.name} ({type})
              </option>
            );
          })}
        </select>
        <button
          type="button"
          onClick={handleAssign}
          disabled={!selectedId}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          Assign here
        </button>
      </div>
    </section>
  );
}
