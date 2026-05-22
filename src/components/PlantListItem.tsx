import Link from "next/link";
import { Pencil } from "lucide-react";
import type { MyPlant } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/labels";
import { getLocationName } from "@/lib/store";

export function PlantListItem({
  plant,
  showStatus = true,
}: {
  plant: MyPlant;
  showStatus?: boolean;
}) {
  const locationName = getLocationName(plant.locationId);

  return (
    <div className="flex items-stretch gap-2 rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/plants/detail?id=${plant.id}`}
        className="min-w-0 flex-1 p-5"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-stone-900">{plant.name}</h2>
          {showStatus && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              {STATUS_LABELS[plant.status] ?? plant.status}
            </span>
          )}
        </div>
        {locationName ? (
          <p className="mt-1 text-sm text-stone-600">{locationName}</p>
        ) : (
          <p className="mt-1 text-sm text-amber-700">Location not set</p>
        )}
        {plant.plantedDate && (
          <p className="mt-2 text-xs text-stone-500">
            Planted / planned: {plant.plantedDate}
          </p>
        )}
      </Link>
      <Link
        href={`/plants/edit?id=${plant.id}`}
        className="flex items-center border-l border-stone-100 px-4 text-stone-500 hover:bg-stone-50 hover:text-emerald-700"
        title="Edit plant"
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}
