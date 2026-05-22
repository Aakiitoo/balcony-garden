"use server";

import { eq, inArray, or, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import {
  getMyGardenContext,
  companionInvolvesMyPlants,
} from "@/lib/garden-context";

export async function getMyGardenContextAction() {
  return getMyGardenContext();
}

export async function getMySunlightGuide() {
  const ctx = getMyGardenContext();
  if (ctx.catalogIds.length === 0) {
    return { ctx, plants: [] };
  }
  const db = getDb();
  const plants = db
    .select()
    .from(schema.plantCatalog)
    .where(inArray(schema.plantCatalog.id, ctx.catalogIds))
    .all();
  return { ctx, plants };
}

export async function getMyDiseases() {
  const ctx = getMyGardenContext();
  if (ctx.catalogIds.length === 0) {
    return { ctx, diseases: [] };
  }
  const db = getDb();
  const diseases = db
    .select()
    .from(schema.diseases)
    .where(
      or(
        inArray(schema.diseases.plantCatalogId, ctx.catalogIds),
        isNull(schema.diseases.plantCatalogId),
      ),
    )
    .all();
  return { ctx, diseases };
}

export async function getMyFertilizers() {
  const ctx = getMyGardenContext();
  if (ctx.catalogIds.length === 0) {
    return { ctx, fertilizers: [] };
  }
  const db = getDb();
  const fertilizers = db
    .select()
    .from(schema.fertilizers)
    .where(inArray(schema.fertilizers.plantCatalogId, ctx.catalogIds))
    .all();
  return { ctx, fertilizers };
}

export async function getMyCompanions(filter?: "good" | "bad") {
  const ctx = getMyGardenContext();
  if (ctx.companionKeys.size === 0) {
    return { ctx, companions: [] };
  }
  const db = getDb();
  let companions = db.select().from(schema.companions).all();
  companions = companions.filter((c) =>
    companionInvolvesMyPlants(c.plantA, c.plantB, ctx.companionKeys),
  );
  if (filter) {
    companions = companions.filter((c) => c.relationship === filter);
  }
  return { ctx, companions };
}
