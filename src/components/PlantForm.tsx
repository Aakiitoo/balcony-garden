import { createPlant, updatePlant } from "@/lib/actions/plants";
import { STATUS_LABELS } from "@/lib/labels";
import type { myPlants } from "@/lib/db/schema";

type CatalogPlant = { id: number; name: string };

type PlantFormProps = {
  catalog: CatalogPlant[];
  plant?: typeof myPlants.$inferSelect;
};

export function PlantForm({ catalog, plant }: PlantFormProps) {
  const action = plant
    ? updatePlant.bind(null, plant.id)
    : createPlant;

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Plant name *</span>
          <input
            name="name"
            required
            defaultValue={plant?.name}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="e.g. Cherry tomato #2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">
            Plant type (for tailored guides) *
          </span>
          <p className="mt-0.5 text-xs text-stone-500">
            Sunlight, diseases, fertilizers, and companions only appear for linked
            types.
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
            defaultValue={plant?.status ?? "active"}
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
          <span className="text-sm font-medium text-stone-700">Planted / planned date</span>
          <input
            type="date"
            name="plantedDate"
            defaultValue={plant?.plantedDate ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Location</span>
          <input
            name="location"
            defaultValue={plant?.location ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="e.g. South balcony, rail planter"
          />
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
        <span className="text-sm font-medium text-stone-700">Pot notes</span>
        <textarea
          name="potNotes"
          rows={2}
          defaultValue={plant?.potNotes ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          placeholder="Material, drainage, when to repot..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Watering schedule</span>
          <input
            name="waterSchedule"
            defaultValue={plant?.waterSchedule ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="e.g. Every morning"
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="text-sm font-medium text-stone-700">Watering notes</span>
          <input
            name="waterNotes"
            defaultValue={plant?.waterNotes ?? ""}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            placeholder="Amount, signs of thirst..."
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

      <label className="block">
        <span className="text-sm font-medium text-emerald-800">What is working well?</span>
        <textarea
          name="successNotes"
          rows={3}
          defaultValue={plant?.successNotes ?? ""}
          className="mt-1 w-full rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
          placeholder="Methods, timing, varieties that thrive..."
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-amber-800">What is not working?</span>
        <textarea
          name="problemNotes"
          rows={3}
          defaultValue={plant?.problemNotes ?? ""}
          className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2"
          placeholder="Pests, bolting, too much sun, lessons learned..."
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800"
        >
          {plant ? "Save changes" : "Add plant"}
        </button>
      </div>
    </form>
  );
}
