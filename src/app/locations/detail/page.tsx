"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getLocation, getPlantsByLocation } from "@/lib/store";
import { useRefreshStore, useStoreVersion } from "@/hooks/use-store";
import { PlantListItem } from "@/components/PlantListItem";
import { DeleteLocationModal } from "@/components/DeleteLocationModal";
import { STATUS_LABELS, formatLocationSunlight } from "@/lib/labels";
import { Pencil } from "lucide-react";
import type { MyPlant } from "@/lib/types";

const STATUS_ORDER = ["active", "planned", "harvested"] as const;

function groupPlants(plants: MyPlant[]) {
  return STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    plants: plants.filter((p) => p.status === status),
  })).filter((g) => g.plants.length > 0);
}

function LocationDetailContent() {
  useStoreVersion();
  const { refresh } = useRefreshStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const location = id ? getLocation(id) : null;
  const plants = location ? getPlantsByLocation(location.id) : [];
  const groups = groupPlants(plants);
  const [showDelete, setShowDelete] = useState(false);

  if (!location) {
    return (
      <p className="text-stone-600">
        Location not found.{" "}
        <Link href="/locations" className="text-emerald-700 hover:underline">
          Back to locations
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950">{location.name}</h1>
          <p className="mt-1 text-sm font-medium text-amber-800">
            {formatLocationSunlight(location)}
          </p>
          {location.description && (
            <p className="mt-2 max-w-xl text-stone-600">{location.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/locations/edit?id=${location.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </header>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-stone-500">
          No plants at this location yet.{" "}
          <Link href="/plants/new" className="font-medium text-emerald-700 hover:underline">
            Add a plant
          </Link>
        </p>
      ) : (
        groups.map(({ status, label, plants: groupPlants }) => (
          <section key={status}>
            <h2 className="mb-3 text-lg font-semibold text-emerald-950">{label}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {groupPlants.map((p) => (
                <li key={p.id}>
                  <PlantListItem plant={p} showStatus={false} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {showDelete && (
        <DeleteLocationModal
          location={location}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            refresh();
            router.push("/locations");
          }}
        />
      )}
    </div>
  );
}

export default function LocationDetailPage() {
  return (
    <Suspense>
      <LocationDetailContent />
    </Suspense>
  );
}
