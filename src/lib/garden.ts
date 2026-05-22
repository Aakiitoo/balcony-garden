import { plantCatalog, diseases, fertilizers, companions } from "@/lib/data/reference";
import { getMyPlants } from "@/lib/store";
import type { PlantCatalog, MyPlant } from "@/lib/types";

export function companionKeyFromCatalogName(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, "").trim();
}

export type MyGardenContext = {
  hasPlants: boolean;
  hasLinkedCatalog: boolean;
  catalogIds: number[];
  catalogPlants: PlantCatalog[];
  companionKeys: Set<string>;
  myPlantLabels: { id: number; name: string; catalogName: string | null }[];
};

export function getMyGardenContext(): MyGardenContext {
  const myPlants = getMyPlants().filter(
    (p) => p.status === "active" || p.status === "planned",
  );

  const catalogIds = [
    ...new Set(myPlants.map((p) => p.catalogPlantId).filter(Boolean)),
  ];

  const catalogPlants = plantCatalog.filter((c) => catalogIds.includes(c.id));
  const catalogById = Object.fromEntries(catalogPlants.map((c) => [c.id, c]));

  const companionKeys = new Set(
    catalogPlants.map((c) => companionKeyFromCatalogName(c.name)),
  );

  const myPlantLabels = myPlants.map((p: MyPlant) => ({
    id: p.id,
    name: p.name,
    catalogName: catalogById[p.catalogPlantId]?.name ?? null,
  }));

  return {
    hasPlants: myPlants.length > 0,
    hasLinkedCatalog: catalogIds.length > 0,
    catalogIds,
    catalogPlants,
    companionKeys,
    myPlantLabels,
  };
}

export function companionInvolvesMyPlants(
  plantA: string,
  plantB: string,
  keys: Set<string>,
) {
  return keys.has(plantA) || keys.has(plantB);
}

export function getMySunlightGuide() {
  const ctx = getMyGardenContext();
  const plants = plantCatalog.filter((p) => ctx.catalogIds.includes(p.id));
  return { ctx, plants };
}

export function getMyDiseases() {
  const ctx = getMyGardenContext();
  if (ctx.catalogIds.length === 0) return { ctx, diseases: [] };
  const list = diseases.filter(
    (d) =>
      d.plantCatalogId === null ||
      (d.plantCatalogId !== null && ctx.catalogIds.includes(d.plantCatalogId)),
  );
  return { ctx, diseases: list };
}

export function getMyFertilizers() {
  const ctx = getMyGardenContext();
  const list = fertilizers.filter(
    (f) => f.plantCatalogId !== null && ctx.catalogIds.includes(f.plantCatalogId),
  );
  return { ctx, fertilizers: list };
}

export function getMyCompanions(filter?: "good" | "bad") {
  const ctx = getMyGardenContext();
  let list = companions.filter((c) =>
    companionInvolvesMyPlants(c.plantA, c.plantB, ctx.companionKeys),
  );
  if (filter) list = list.filter((c) => c.relationship === filter);
  return { ctx, companions: list };
}
