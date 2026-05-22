export const STATUS_LABELS: Record<string, string> = {
  active: "Growing now",
  planned: "Planned",
  harvested: "Harvested",
  archived: "Archived",
};

export const SUNLIGHT_TYPE_LABELS: Record<string, string> = {
  direct: "Direct sun",
  indirect: "Bright indirect",
  partial: "Partial shade",
  shade: "Full shade OK",
};

export const RECOMMENDATION_LABELS: Record<string, string> = {
  organic_preferred: "Organic preferred",
  either: "Either works",
  chemical_last_resort: "Chemical as last resort",
};

export const RELATIONSHIP_LABELS: Record<string, string> = {
  good: "Good together",
  bad: "Avoid together",
  neutral: "Neutral",
};

export const CATEGORY_LABELS: Record<string, string> = {
  vegetable: "Vegetable",
  fruit: "Fruit",
  herb: "Herb",
};

export function formatLocationSunlight(loc: {
  sunlightMode: "full_shade" | "hours";
  sunlightHours: number | null;
}): string {
  if (loc.sunlightMode === "full_shade") return "Full shade";
  return `${loc.sunlightHours ?? "?"} hours / day`;
}

export const POT_STAGE_LABELS: Record<string, string> = {
  starter: "First growing pot",
  final: "Season pot (stays until harvest)",
};
