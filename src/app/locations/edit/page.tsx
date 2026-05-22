"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getLocation } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { LocationForm } from "@/components/LocationForm";

function EditLocationContent() {
  useStoreVersion();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const location = id ? getLocation(id) : null;

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Edit location</h1>
      <LocationForm location={location} />
    </div>
  );
}

export default function EditLocationPage() {
  return (
    <Suspense>
      <EditLocationContent />
    </Suspense>
  );
}
