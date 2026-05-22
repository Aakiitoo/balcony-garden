import Link from "next/link";
import { Sun, Droplets, MapPin, Bug, FlaskConical, Users } from "lucide-react";
import type { PlantCatalog, Location, MyPlant } from "@/lib/types";
import { tipsHref } from "@/lib/tips";
import {
  SUNLIGHT_TYPE_LABELS,
  CATEGORY_LABELS,
  formatLocationSunlight,
} from "@/lib/labels";

export function PlantGuidePanel({
  plant,
  catalog,
  location,
}: {
  plant: MyPlant;
  catalog: PlantCatalog;
  location: Location | null;
}) {
  const tipLinks = [
    { href: tipsHref("sunlight", catalog.id), label: "Sunlight", icon: Sun },
    { href: tipsHref("diseases", catalog.id), label: "Diseases", icon: Bug },
    {
      href: tipsHref("fertilizers", catalog.id),
      label: "Fertilizers",
      icon: FlaskConical,
    },
    {
      href: tipsHref("companions", catalog.id),
      label: "Companions",
      icon: Users,
    },
  ];

  if (!plant.locationId) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-amber-950">
          <MapPin className="h-5 w-5" />
          Placement & growing tips
        </h2>
        <p className="mt-2 text-sm text-amber-900/90">
          Assign a location to unlock placement tips and quick links to all guide
          categories for {catalog.name}.
        </p>
        <Link
          href={`/plants/edit?id=${plant.id}`}
          className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Edit plant & choose location →
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <Sun className="h-5 w-5 text-amber-600" />
        Tips: {catalog.name}
        {location && (
          <span className="text-sm font-normal text-stone-600">
            @ {location.name}
          </span>
        )}
      </h2>
      {location && (
        <div className="mb-4 rounded-lg bg-white/80 p-3 text-sm">
          <p className="font-medium text-stone-700">This spot</p>
          <p className="mt-1 text-stone-600">
            {formatLocationSunlight(location)}
          </p>
          {location.description && (
            <>
              <p className="mt-2 font-medium text-stone-700">About this spot</p>
              <p className="text-stone-600">{location.description}</p>
            </>
          )}
        </div>
      )}
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-stone-500">Category</dt>
          <dd>{CATEGORY_LABELS[catalog.category] ?? catalog.category}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Sunlight (plant type)</dt>
          <dd>
            {catalog.sunlightHours} —{" "}
            {SUNLIGHT_TYPE_LABELS[catalog.sunlightType] ?? catalog.sunlightType}
          </dd>
          {catalog.sunlightNotes && (
            <dd className="text-stone-600">{catalog.sunlightNotes}</dd>
          )}
        </div>
        <div className="flex gap-2">
          <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
          <div>
            <dt className="text-stone-500">Watering</dt>
            <dd className="font-medium">{catalog.waterFrequency}</dd>
            {catalog.waterNotes && (
              <dd className="text-stone-600">{catalog.waterNotes}</dd>
            )}
          </div>
        </div>
        {catalog.potSizeMinLiters && (
          <div>
            <dt className="text-stone-500">Recommended pot size</dt>
            <dd>
              {catalog.potSizeMinLiters} L min. — {catalog.potSizeNotes}
            </dd>
          </div>
        )}
      </dl>
      <div className="mt-5 border-t border-amber-200/80 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Full guides for this plant type
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {tipLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
