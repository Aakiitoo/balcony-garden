"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMyPlant, deletePlant } from "@/lib/store";
import { useRefreshStore, useStoreVersion } from "@/hooks/use-store";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantGuidePanel } from "@/components/PlantGuidePanel";
import { GrowingDetails } from "@/components/GrowingDetails";
import { STATUS_LABELS } from "@/lib/labels";
import { Pencil, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";

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
  const editHref = `/plants/edit?id=${plant.id}`;

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
            href={editHref}
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
        <GrowingDetails plant={plant} editHref={editHref} />
        {catalog && (
          <PlantGuidePanel plant={plant} catalog={catalog} location={location} />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section
          className={`rounded-xl border p-6 ${
            plant.successNotes
              ? "border-emerald-300 bg-emerald-50"
              : "border-emerald-200/80 bg-emerald-50/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-900">
              <ThumbsUp className="h-5 w-5 text-emerald-600" />
              Working well
            </h2>
            <Link
              href={editHref}
              className="text-xs font-medium text-emerald-700 hover:underline"
            >
              Edit
            </Link>
          </div>
          {plant.successNotes ? (
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-emerald-950">
              {plant.successNotes}
            </p>
          ) : (
            <p className="mt-3 text-sm text-emerald-800/70">
              Nothing logged yet — edit to note what is going well.
            </p>
          )}
        </section>
        <section
          className={`rounded-xl border p-6 ${
            plant.problemNotes
              ? "border-amber-300 bg-amber-50"
              : "border-amber-200/80 bg-amber-50/40"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-950">
              <ThumbsDown className="h-5 w-5 text-amber-600" />
              Not working
            </h2>
            <Link
              href={editHref}
              className="text-xs font-medium text-emerald-700 hover:underline"
            >
              Edit
            </Link>
          </div>
          {plant.problemNotes ? (
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-amber-950">
              {plant.problemNotes}
            </p>
          ) : (
            <p className="mt-3 text-sm text-amber-900/70">
              Nothing logged yet — edit to note what is not working.
            </p>
          )}
        </section>
      </div>
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
