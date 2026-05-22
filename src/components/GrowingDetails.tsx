import Link from "next/link";
import {
  CalendarDays,
  FlaskConical,
  Bug,
  Leaf,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { MyPlant } from "@/lib/types";
import { POT_STAGE_LABELS } from "@/lib/labels";
import { formatPlantDate, getFertilizerFeedStatus } from "@/lib/format";
import { PotIcon } from "@/components/icons/PotIcon";

export function GrowingDetails({
  plant,
  editHref,
}: {
  plant: MyPlant;
  editHref: string;
}) {
  const feedStatus = getFertilizerFeedStatus(plant.lastFertilizedDate);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="mb-4 font-semibold">Growing details</h2>
      <dl className="space-y-4 text-sm">
        {plant.plantedDate && (
          <div>
            <dt className="flex items-center gap-1.5 text-stone-500">
              <CalendarDays className="h-4 w-4" />
              Planted / planned
            </dt>
            <dd className="mt-1 font-serif text-lg font-medium tracking-tight text-stone-800">
              {formatPlantDate(plant.plantedDate)}
            </dd>
          </div>
        )}

        {plant.potStage && (
          <div>
            <dt className="text-stone-500">Pot stage</dt>
            <dd className="font-medium">
              {POT_STAGE_LABELS[plant.potStage] ?? plant.potStage}
            </dd>
          </div>
        )}

        {plant.potSizeLiters != null && (
          <div className="flex gap-2">
            <PotIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <dt className="text-stone-500">Pot size</dt>
              <dd className="font-medium">{plant.potSizeLiters} L</dd>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Bug className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <div className="min-w-0 flex-1">
            <dt className="text-stone-500">Current diseases / problems</dt>
            {plant.currentProblems ? (
              <dd className="mt-1 whitespace-pre-wrap text-stone-800">
                {plant.currentProblems}
              </dd>
            ) : (
              <dd className="mt-1 text-stone-500">None noted</dd>
            )}
            <Link
              href={editHref}
              className="mt-1 inline-block text-xs text-emerald-700 hover:underline"
            >
              Update
            </Link>
          </div>
        </div>

        {plant.status === "active" && (
          <div className="flex gap-2 rounded-lg border border-violet-100 bg-violet-50/50 p-3">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
            <div className="min-w-0 flex-1">
              <dt className="font-medium text-violet-900">Fertilizing</dt>
              {!plant.lastFertilizedDate && !plant.lastFertilizerUsed ? (
                <dd className="mt-1 text-stone-600">Not fertilized yet</dd>
              ) : (
                <>
                  {plant.lastFertilizedDate && (
                    <dd className="mt-1 font-serif text-base text-stone-800">
                      {formatPlantDate(plant.lastFertilizedDate)}
                    </dd>
                  )}
                  {plant.lastFertilizerUsed && (
                    <dd className="text-stone-600">{plant.lastFertilizerUsed}</dd>
                  )}
                </>
              )}
              <dd className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                {feedStatus === "fed" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-800">
                      Well-fed — recently fertilized
                    </span>
                  </>
                )}
                {feedStatus === "hungry" && (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-800">
                      Hungry — might need fertilizer
                    </span>
                  </>
                )}
                {feedStatus === "none" && (
                  <>
                    <Leaf className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-500">
                      Log a feeding date to track status
                    </span>
                  </>
                )}
              </dd>
              <Link
                href={editHref}
                className="mt-2 inline-block text-xs text-emerald-700 hover:underline"
              >
                Update feeding log
              </Link>
            </div>
          </div>
        )}

        {plant.notes && (
          <div>
            <dt className="text-stone-500">Notes</dt>
            <dd className="whitespace-pre-wrap text-stone-700">{plant.notes}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
