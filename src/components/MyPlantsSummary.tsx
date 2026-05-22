import Link from "next/link";
import type { MyGardenContext } from "@/lib/garden-context";

export function MyPlantsSummary({ ctx }: { ctx: MyGardenContext }) {
  if (!ctx.hasLinkedCatalog) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm">
      <p className="font-medium text-emerald-900">
        Showing advice for your plants:
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {ctx.myPlantLabels
          .filter((p) => p.catalogName)
          .map((p) => (
            <li key={p.id}>
              <Link
                href={`/plants/${p.id}`}
                className="rounded-full bg-white px-2.5 py-0.5 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                {p.name}
                <span className="text-emerald-600/70"> · {p.catalogName}</span>
              </Link>
            </li>
          ))}
      </ul>
      {ctx.myPlantLabels.some((p) => !p.catalogName) && (
        <p className="mt-2 text-amber-800/90">
          Some plants are not linked to a guide type — edit them to include their
          recommendations.
        </p>
      )}
    </div>
  );
}
