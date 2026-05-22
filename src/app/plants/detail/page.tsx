"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMyPlant, deletePlant } from "@/lib/store";
import { useRefreshStore, useStoreVersion } from "@/hooks/use-store";
import { ImageUpload } from "@/components/ImageUpload";
import {
  STATUS_LABELS,
  SUNLIGHT_TYPE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/labels";
import { Pencil, Trash2, Sun, Droplets, Package } from "lucide-react";

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

  const { plant, images, catalog } = data;

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
          {plant.location && (
            <p className="mt-1 text-stone-600">{plant.location}</p>
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
                  {plant.potNotes && (
                    <dd className="text-stone-600">{plant.potNotes}</dd>
                  )}
                </div>
              </div>
            )}
            {(plant.waterSchedule || plant.waterNotes) && (
              <div className="flex gap-2">
                <Droplets className="mt-0.5 h-4 w-4 text-stone-400" />
                <div>
                  <dt className="text-stone-500">Watering</dt>
                  {plant.waterSchedule && (
                    <dd className="font-medium">{plant.waterSchedule}</dd>
                  )}
                  {plant.waterNotes && (
                    <dd className="text-stone-600">{plant.waterNotes}</dd>
                  )}
                </div>
              </div>
            )}
            {plant.notes && (
              <div>
                <dt className="text-stone-500">Notes</dt>
                <dd className="whitespace-pre-wrap">{plant.notes}</dd>
              </div>
            )}
          </dl>
        </section>

        {catalog && (
          <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Sun className="h-5 w-5 text-amber-600" />
              Guide: {catalog.name}
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-stone-500">Category</dt>
                <dd>{CATEGORY_LABELS[catalog.category] ?? catalog.category}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Sunlight</dt>
                <dd>
                  {catalog.sunlightHours} —{" "}
                  {SUNLIGHT_TYPE_LABELS[catalog.sunlightType] ??
                    catalog.sunlightType}
                </dd>
                {catalog.sunlightNotes && (
                  <dd className="text-stone-600">{catalog.sunlightNotes}</dd>
                )}
              </div>
              <div>
                <dt className="text-stone-500">Typical watering</dt>
                <dd>{catalog.waterFrequency}</dd>
                {catalog.waterNotes && (
                  <dd className="text-stone-600">{catalog.waterNotes}</dd>
                )}
              </div>
              {catalog.potSizeMinLiters && (
                <div>
                  <dt className="text-stone-500">Min. pot size</dt>
                  <dd>{catalog.potSizeMinLiters} L — {catalog.potSizeNotes}</dd>
                </div>
              )}
            </dl>
            <Link
              href="/guides/sunlight"
              className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
            >
              All sunlight advice for your plants →
            </Link>
          </section>
        )}
      </div>

      {(plant.successNotes || plant.problemNotes) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {plant.successNotes && (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
              <h2 className="font-semibold text-emerald-900">Working well</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-950/90">
                {plant.successNotes}
              </p>
            </section>
          )}
          {plant.problemNotes && (
            <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
              <h2 className="font-semibold text-amber-900">Not working</h2>
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
