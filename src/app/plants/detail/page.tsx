"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMyPlant, deletePlant } from "@/lib/store";
import { useRefreshStore, useStoreVersion } from "@/hooks/use-store";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantGuidePanel } from "@/components/PlantGuidePanel";
import { STATUS_LABELS } from "@/lib/labels";
import { Pencil, Trash2, Package, FlaskConical } from "lucide-react";

function PlantDetailContent() {
  useStoreVersion();
  const { refresh } = useRefreshStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const data = id ? getMyPlant(id) : null;

  if (!data) {
    return (
      <p className="text-stone-600">
        Plant not found.{" "}
        <Link href="/plants" className="text-emerald-700 hover:underline">
          Back to My Plants
        </Link>
      </p>
    );
  }

  const { plant, images, catalog, location } = data;

  function handleDelete() {
    if (confirm(`Delete "${plant.name}"?`)) {
      deletePlant(plant.id);
      refresh();
      router.push("/plants");
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {STATUS_LABELS[plant.status] ?? plant.status}
          </p>
          <h1 className="text-3xl font-bold text-emerald-950">{plant.name}</h1>
          {location ? (
            <p className="mt-1 text-stone-600">
              <Link
                href={`/locations/detail?id=${location.id}`}
                className="hover:text-emerald-700 hover:underline"
              >
                {location.name}
              </Link>
            </p>
          ) : (
            <p className="mt-1 text-sm text-amber-700">No location assigned</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/plants/edit?id=${plant.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Photos</h2>
        <ImageUpload plantId={plant.id} images={images} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Growing details</h2>
          <dl className="space-y-3 text-sm">
            {plant.plantedDate && (
              <div>
                <dt className="text-stone-500">Planted / planned</dt>
                <dd className="font-medium">{plant.plantedDate}</dd>
              </div>
            )}
            {plant.potSizeLiters && (
              <div className="flex gap-2">
                <Package className="mt-0.5 h-4 w-4 text-stone-400" />
                <div>
                  <dt className="text-stone-500">Pot size</dt>
                  <dd className="font-medium">{plant.potSizeLiters} L</dd>
                </div>
              </div>
            )}
            {plant.notes && (
              <div>
                <dt className="text-stone-500">Notes</dt>
                <dd className="whitespace-pre-wrap">{plant.notes}</dd>
              </div>
            )}
            {plant.status === "active" &&
              (plant.lastFertilizedDate || plant.lastFertilizerUsed) && (
                <div className="flex gap-2">
                  <FlaskConical className="mt-0.5 h-4 w-4 text-violet-500" />
                  <div>
                    <dt className="text-stone-500">Last fertilized</dt>
                    {plant.lastFertilizedDate && (
                      <dd className="font-medium">{plant.lastFertilizedDate}</dd>
                    )}
                    {plant.lastFertilizerUsed && (
                      <dd className="text-stone-600">{plant.lastFertilizerUsed}</dd>
                    )}
                    <Link
                      href={`/plants/edit?id=${plant.id}`}
                      className="mt-1 inline-block text-xs text-emerald-700 hover:underline"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              )}
          </dl>
        </section>

        {catalog && (
          <PlantGuidePanel plant={plant} catalog={catalog} location={location} />
        )}
      </div>

      {(plant.successNotes || plant.problemNotes) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {plant.successNotes && (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-emerald-900">Working well</h2>
                <Link
                  href={`/plants/edit?id=${plant.id}`}
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  Edit
                </Link>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-950/90">
                {plant.successNotes}
              </p>
            </section>
          )}
          {plant.problemNotes && (
            <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-amber-900">Not working</h2>
                <Link
                  href={`/plants/edit?id=${plant.id}`}
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  Edit
                </Link>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-amber-950/90">
                {plant.problemNotes}
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlantDetailPage() {
  return (
    <Suspense>
      <PlantDetailContent />
    </Suspense>
  );
}
