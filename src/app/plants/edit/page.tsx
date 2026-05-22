"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getMyPlant } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { PlantForm } from "@/components/PlantForm";

function EditPlantContent() {
  useStoreVersion();
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

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Edit {data.plant.name}</h1>
      <PlantForm plant={data.plant} />
    </div>
  );
}

export default function EditPlantPage() {
  return (
    <Suspense>
      <EditPlantContent />
    </Suspense>
  );
}
