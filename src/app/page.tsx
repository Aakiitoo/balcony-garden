"use client";

import Link from "next/link";
import { getMyPlants } from "@/lib/store";
import { useStoreVersion } from "@/hooks/use-store";
import { Sprout, Sun, Bug, FlaskConical, Users, Plus } from "lucide-react";
import { STATUS_LABELS } from "@/lib/labels";

export default function DashboardPage() {
  useStoreVersion();
  const plants = getMyPlants();
  const active = plants.filter((p) => p.status === "active");
  const planned = plants.filter((p) => p.status === "planned");

  const guideCards = [
    {
      href: "/guides/sunlight",
      title: "Sunlight needs",
      desc: "Light needs for your linked plant types only",
      icon: Sun,
    },
    {
      href: "/guides/diseases",
      title: "Diseases & pests",
      desc: "Pests & diseases relevant to what you grow",
      icon: Bug,
    },
    {
      href: "/guides/fertilizers",
      title: "Fertilizers",
      desc: "Feeding advice for your plants only",
      icon: FlaskConical,
    },
    {
      href: "/guides/companions",
      title: "Pot companions",
      desc: "Pot pairings involving your plant types",
      icon: Users,
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
            Track pots and planters, log what works, and get advice tailored to
            the plants you grow.
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
        <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Growing now</p>
          <p className="mt-1 text-3xl font-bold text-emerald-800">{active.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Planned</p>
          <p className="mt-1 text-3xl font-bold text-stone-800">{planned.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Total entries</p>
          <p className="mt-1 text-3xl font-bold text-stone-800">{plants.length}</p>
        </div>
      </section>

      {plants.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sprout className="h-5 w-5 text-emerald-600" />
            Recent plants
          </h2>
          <ul className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
            {plants.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/plants/detail?id=${p.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-stone-50"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-stone-500">
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {plants.length > 5 && (
            <Link
              href="/plants"
              className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:underline"
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
