export function formatPlantDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

export type FertilizerFeedStatus = "none" | "fed" | "hungry";

export function getFertilizerFeedStatus(
  lastDate: string | null,
): FertilizerFeedStatus {
  if (!lastDate) return "none";
  const then = new Date(`${lastDate}T12:00:00`).getTime();
  if (Number.isNaN(then)) return "none";
  return Date.now() - then > FOUR_WEEKS_MS ? "hungry" : "fed";
}
