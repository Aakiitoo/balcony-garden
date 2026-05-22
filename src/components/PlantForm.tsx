"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS } from "@/lib/labels";
import type { MyPlant } from "@/lib/types";
import {
  createPlant,
  updatePlant,
  parsePlantForm,
  getCatalogPlants,
  getLocations,
} from "@/lib/store";
import { useRefreshStore } from "@/hooks/use-store";

type PlantFormProps = {
  mode: "add" | "edit";
  plant?: MyPlant;
};

export function PlantForm({ mode, plant }: PlantFormProps) {
  const router = useRouter();
  const { refresh } = useRefreshStore();
  const catalog = getCatalogPlants();
  const locations = getLocations();
  const isEdit = mode === "edit";
  const [status, setStatus] = useState(plant?.status ?? "active");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = parsePlantForm(new FormData(e.currentTarget), mode);
    if (isEdit && plant) {
      updatePlant(plant.id, form);
      refresh();
      router.push(`/plants/detail?id=${plant.id}`);
    } else {
      const id = createPlant(form);
      refresh();
      router.push(`/plants/detail?id=${id}`);
    }
  }

  const locationDefault =
    plant?.locationId != null ? String(plant.locationId) : "later";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Plant name *</span>
          <input
            name="name"
            required
            defaultValue={plant?.name}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="e.g. Patio tomato #2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Plant type *</span>
          <p className="mt-0.5 text-xs text-stone-500">
            Guides for sunlight, watering, diseases, and companions use this type.
          </p>
          <select
            name="catalogPlantId"
            required
            defaultValue={plant?.catalogPlantId ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="" disabled>
              Choose a plant type…
            </option>
            {catalog.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Status</span>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">
            Planted / planned date
          </span>
          <input
            type="date"
            name="plantedDate"
            defaultValue={plant?.plantedDate ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Location</span>
          <p className="mt-0.5 text-xs text-stone-500">
            {isEdit
              ? "Choose where this plant sits to unlock placement tips."
              : "Pick a saved spot, or choose later — placement tips stay hidden until you assign one."}
          </p>
          <select
            name="locationId"
            defaultValue={locationDefault}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="later">Choose later</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {locations.length === 0 && (
            <p className="mt-1 text-xs text-stone-500">
              No locations yet.{" "}
              <Link href="/locations/new" className="text-emerald-700 hover:underline">
                Create one
              </Link>
            </p>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Pot size (liters)</span>
          <input
            type="number"
            name="potSizeLiters"
            min={1}
            defaultValue={plant?.potSizeLiters ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-stone-700">General notes</span>
        <textarea
          name="notes"
          rows={3}
          defaultValue={plant?.notes ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>

      {isEdit && (
        <>
          <label className="block">
            <span className="text-sm font-medium text-emerald-800">
              What is working well?
            </span>
            <textarea
              name="successNotes"
              rows={3}
              defaultValue={plant?.successNotes ?? ""}
              className="mt-1 w-full rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
              placeholder="Methods, timing, varieties that thrive..."
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-amber-800">
              What is not working?
            </span>
            <textarea
              name="problemNotes"
              rows={3}
              defaultValue={plant?.problemNotes ?? ""}
              className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2"
              placeholder="Pests, bolting, too much sun, lessons learned..."
            />
          </label>
          {status === "active" && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 space-y-4">
              <p className="text-sm font-medium text-violet-900">Fertilizing</p>
              <label className="block">
                <span className="text-sm text-stone-700">Last fertilized</span>
                <input
                  type="date"
                  name="lastFertilizedDate"
                  defaultValue={plant?.lastFertilizedDate ?? ""}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-stone-700">Fertilizer used</span>
                <input
                  name="lastFertilizerUsed"
                  defaultValue={plant?.lastFertilizerUsed ?? ""}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
                  placeholder="e.g. Tomato feed, compost tea"
                />
              </label>
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800"
        >
          {isEdit ? "Save changes" : "Add plant"}
        </button>
        <p className="text-xs text-stone-500">* Required fields</p>
      </div>
    </form>
  );
}
