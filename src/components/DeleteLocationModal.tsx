"use client";

import { useState } from "react";
import type { Location } from "@/lib/types";
import {
  deleteLocationAndReassign,
  getPlantsByLocation,
  getLocations,
} from "@/lib/store";
import { useRefreshStore } from "@/hooks/use-store";

export function DeleteLocationModal({
  location,
  onClose,
  onDeleted,
}: {
  location: Location;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { refresh } = useRefreshStore();
  const plants = getPlantsByLocation(location.id);
  const otherLocations = getLocations().filter((l) => l.id !== location.id);
  const [moveTo, setMoveTo] = useState<string>(
    otherLocations.length > 0 ? String(otherLocations[0].id) : "later",
  );

  function confirmDelete() {
    const target =
      moveTo === "later" ? null : Number(moveTo);
    deleteLocationAndReassign(location.id, target);
    refresh();
    onDeleted();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-labelledby="delete-location-title"
      >
        <h2 id="delete-location-title" className="text-lg font-semibold text-stone-900">
          Delete “{location.name}”?
        </h2>
        {plants.length > 0 ? (
          <>
            <p className="mt-2 text-sm text-stone-600">
              {plants.length} plant{plants.length === 1 ? "" : "s"} use this
              location. Where should they go?
            </p>
            <ul className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
              {plants.map((p) => (
                <li key={p.id}>· {p.name}</li>
              ))}
            </ul>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-stone-700">
                Move plants to
              </span>
              <select
                value={moveTo}
                onChange={(e) => setMoveTo(e.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
              >
                <option value="later">Choose later (no location)</option>
                {otherLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <p className="mt-2 text-sm text-stone-600">
            No plants are assigned here. This location will be removed.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete location
          </button>
        </div>
      </div>
    </div>
  );
}
