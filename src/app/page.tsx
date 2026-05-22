"use client";

import Link from "next/link";
import { getMyPlants, getLocations } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { PlantListItem } from "@/components/PlantListItem";
import {
  Sprout,
  Sun,
  Bug,
  FlaskConical,
  Users,
  Plus,
  MapPin,
} from "lucide-react";

export default function DashboardPage() {
  useStoreVersion();
  const plants = getMyPlants();
  const active = plants.filter((p) => p.status === "active");
  const planned = plants.filter((p) => p.status === "planned");
  const locations = getLocations();

  const guideCards = [
    {
      href: "/guides/sunlight",
      title: "Sunlight needs",
      desc: "Look up light needs by plant type",
      icon: Sun,
    },
    {
      href: "/guides/diseases",
      title: "Diseases & pests",
      desc: "Diseases and pests by plant type",
      icon: Bug,
    },
    {
      href: "/guides/fertilizers",
      title: "Fertilizers",
      desc: "Fertilizer schedules and N-P-K explained",
      icon: FlaskConical,
    },
    {
      href: "/guides/companions",
      title: "Pot companions",
      desc: "What to grow together in pots",
      icon: Users,
    },
  ];

  const statCards = [
    {
      href: "/plants?status=active",
      label: "Growing now",
      count: active.length,
      className: "border-emerald-200 hover:border-emerald-400",
      countClass: "text-emerald-800",
    },
    {
      href: "/plants?status=planned",
      label: "Planned",
      count: planned.length,
      className: "border-stone-200 hover:border-stone-400",
      countClass: "text-stone-800",
    },
    {
      href: "/plants",
      label: "Total entries",
      count: plants.length,
      className: "border-stone-200 hover:border-stone-400",
      countClass: "text-stone-800",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
            Your balcony garden
          </h1>
          <p className="mt-2 max-w-xl text-stone-600">
            Track pots and planters, organize by location, and get advice tailored
            to the plants you grow.
          </p>
        </div>
        <Link
          href="/plants/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800"
        >
          <Plus className="h-5 w-5" />
          Add plant
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ href, label, count, className, countClass }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${className}`}
          >
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${countClass}`}>{count}</p>
            <p className="mt-2 text-xs text-emerald-700">View list →</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Locations
          </h2>
          <Link
            href="/locations/new"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Create new location
          </Link>
        </div>
        {locations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white px-5 py-8 text-center text-sm text-stone-500">
            Add balcony spots to group plants and unlock placement tips.{" "}
            <Link href="/locations/new" className="font-medium text-emerald-700 hover:underline">
              Create your first location
            </Link>
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <li key={loc.id}>
                <Link
                  href={`/locations/detail?id=${loc.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone-800 ring-1 ring-stone-200 hover:bg-emerald-50 hover:ring-emerald-300"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {loc.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/locations"
                className="inline-block rounded-full px-3 py-1.5 text-sm font-medium text-emerald-700 hover:underline"
              >
                All locations →
              </Link>
            </li>
          </ul>
        )}
      </section>

      {plants.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sprout className="h-5 w-5 text-emerald-600" />
            Recent plants
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {plants.slice(0, 4).map((p) => (
              <li key={p.id}>
                <PlantListItem plant={p} />
              </li>
            ))}
          </ul>
          {plants.length > 4 && (
            <Link
              href="/plants"
              className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
            >
              View all plants →
            </Link>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Advice for your garden</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guideCards.map(({ href, title, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon className="mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="font-semibold text-stone-900">{title}</h3>
              <p className="mt-1 text-sm text-stone-600">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
