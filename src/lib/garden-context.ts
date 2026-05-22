import { eq, inArray, or, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/** Strip variety suffix for companion matching, e.g. "Tomato (Cherry)" → "Tomato". */
export function companionKeyFromCatalogName(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, "").trim();
}

export type MyGardenContext = {
  hasPlants: boolean;
  hasLinkedCatalog: boolean;
  catalogIds: number[];
  catalogPlants: (typeof schema.plantCatalog.$inferSelect)[];
  companionKeys: Set<string>;
  myPlantLabels: { id: number; name: string; catalogName: string | null }[];
};

export function getMyGardenContext(): MyGardenContext {
  const db = getDb();
  const myPlants = db
    .select()
    .from(schema.myPlants)
    .where(
      or(
        eq(schema.myPlants.status, "active"),
        eq(schema.myPlants.status, "planned"),
      ),
    )
    .all();

  const catalogIds = [
    ...new Set(
      myPlants
        .map((p) => p.catalogPlantId)
        .filter((id): id is number => id != null),
    ),
  ];

  const catalogPlants =
    catalogIds.length > 0
      ? db
          .select()
          .from(schema.plantCatalog)
          .where(inArray(schema.plantCatalog.id, catalogIds))
          .all()
      : [];

  const catalogById = Object.fromEntries(catalogPlants.map((c) => [c.id, c]));

  const companionKeys = new Set(
    catalogPlants.map((c) => companionKeyFromCatalogName(c.name)),
  );

  const myPlantLabels = myPlants.map((p) => ({
    id: p.id,
    name: p.name,
    catalogName: p.catalogPlantId
      ? (catalogById[p.catalogPlantId]?.name ?? null)
      : null,
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
): boolean {
  return keys.has(plantA) || keys.has(plantB);
}
