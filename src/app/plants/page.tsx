"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMyPlants } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { STATUS_LABELS } from "@/lib/labels";
import { Plus, MapPin, Droplets } from "lucide-react";

function PlantsContent() {
  useStoreVersion();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? undefined;
  const plants = getMyPlants(status);

  const filters = [
    { value: "", label: "All" },
    { value: "active", label: "Growing" },
    { value: "planned", label: "Planned" },
    { value: "harvested", label: "Harvested" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-emerald-950">My plants</h1>
        <Link
          href="/plants/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          <Plus className="h-5 w-5" />
          Add plant
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/plants?status=${f.value}` : "/plants"}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              (status ?? "") === f.value
                ? "bg-emerald-700 text-white"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {plants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
          No plants yet.{" "}
          <Link href="/plants/new" className="font-medium text-emerald-700 hover:underline">
            Add your first plant
          </Link>
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {plants.map((p) => (
            <li key={p.id}>
              <Link
                href={`/plants/detail?id=${p.id}`}
                className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-stone-900">{p.name}</h2>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </div>
                {p.location && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-stone-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.location}
                  </p>
                )}
                {p.waterSchedule && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
                    <Droplets className="h-3.5 w-3.5" />
                    {p.waterSchedule}
                  </p>
                )}
                {p.plantedDate && (
                  <p className="mt-2 text-xs text-stone-500">
                    Planted / planned: {p.plantedDate}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PlantsPage() {
  return (
    <Suspense>
      <PlantsContent />
    </Suspense>
  );
}
