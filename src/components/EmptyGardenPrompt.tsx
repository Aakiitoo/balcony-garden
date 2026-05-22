import Link from "next/link";
import { Sprout, Link2 } from "lucide-react";

type EmptyGardenPromptProps = {
  hasPlants: boolean;
  hasLinkedCatalog: boolean;
  guideName: string;
};

export function EmptyGardenPrompt({
  hasPlants,
  hasLinkedCatalog,
  guideName,
}: EmptyGardenPromptProps) {
  if (!hasPlants) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
        <Sprout className="mx-auto h-10 w-10 text-stone-400" />
        <h2 className="mt-4 text-lg font-semibold text-stone-800">
          Add plants first
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          {guideName} is based on what you are growing. Add a plant, then link it
          to a plant type so recommendations appear here.
        </p>
        <Link
          href="/plants/new"
          className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Add your first plant
        </Link>
      </div>
    );
  }

  if (!hasLinkedCatalog) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-6 py-12 text-center">
        <Link2 className="mx-auto h-10 w-10 text-amber-600" />
        <h2 className="mt-4 text-lg font-semibold text-amber-950">
          Link your plants to a type
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-amber-900/80">
          Your plants are not linked to a guide type yet. Edit each plant and
          choose a match under &quot;Link to plant guide&quot; — then {guideName}{" "}
          will show tailored advice.
        </p>
        <Link
          href="/plants"
          className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Go to My Plants
        </Link>
      </div>
    );
  }

  return null;
}
