"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export async function getMyPlants(status?: string) {
  const db = getDb();
  const query = db
    .select()
    .from(schema.myPlants)
    .orderBy(desc(schema.myPlants.updatedAt));

  if (status) {
    return query.where(eq(schema.myPlants.status, status)).all();
  }
  return query.all();
}

export async function getMyPlant(id: number) {
  const db = getDb();
  const plant = db
    .select()
    .from(schema.myPlants)
    .where(eq(schema.myPlants.id, id))
    .get();
  if (!plant) return null;

  const images = db
    .select()
    .from(schema.plantImages)
    .where(eq(schema.plantImages.plantId, id))
    .orderBy(desc(schema.plantImages.createdAt))
    .all();

  let catalog = null;
  if (plant.catalogPlantId) {
    catalog = db
      .select()
      .from(schema.plantCatalog)
      .where(eq(schema.plantCatalog.id, plant.catalogPlantId))
      .get();
  }

  return { plant, images, catalog };
}

export async function getCatalogPlants() {
  const db = getDb();
  return db.select().from(schema.plantCatalog).all();
}

export async function createPlant(formData: FormData) {
  const now = new Date().toISOString();
  const catalogId = formData.get("catalogPlantId");
  if (!catalogId) {
    throw new Error("Plant type is required for tailored guides.");
  }
  const db = getDb();

  const result = db
    .insert(schema.myPlants)
    .values({
      name: String(formData.get("name") || "").trim(),
      catalogPlantId: Number(catalogId),
      status: String(formData.get("status") || "active"),
      plantedDate: String(formData.get("plantedDate") || "") || null,
      location: String(formData.get("location") || "") || null,
      potSizeLiters: formData.get("potSizeLiters")
        ? Number(formData.get("potSizeLiters"))
        : null,
      potNotes: String(formData.get("potNotes") || "") || null,
      waterSchedule: String(formData.get("waterSchedule") || "") || null,
      waterNotes: String(formData.get("waterNotes") || "") || null,
      notes: String(formData.get("notes") || "") || null,
      successNotes: String(formData.get("successNotes") || "") || null,
      problemNotes: String(formData.get("problemNotes") || "") || null,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  revalidatePath("/plants");
  redirect(`/plants/${result.lastInsertRowid}`);
}

export async function updatePlant(id: number, formData: FormData) {
  const db = getDb();
  const catalogId = formData.get("catalogPlantId");
  if (!catalogId) {
    throw new Error("Plant type is required for tailored guides.");
  }

  db.update(schema.myPlants)
    .set({
      name: String(formData.get("name") || "").trim(),
      catalogPlantId: Number(catalogId),
      status: String(formData.get("status") || "active"),
      plantedDate: String(formData.get("plantedDate") || "") || null,
      location: String(formData.get("location") || "") || null,
      potSizeLiters: formData.get("potSizeLiters")
        ? Number(formData.get("potSizeLiters"))
        : null,
      potNotes: String(formData.get("potNotes") || "") || null,
      waterSchedule: String(formData.get("waterSchedule") || "") || null,
      waterNotes: String(formData.get("waterNotes") || "") || null,
      notes: String(formData.get("notes") || "") || null,
      successNotes: String(formData.get("successNotes") || "") || null,
      problemNotes: String(formData.get("problemNotes") || "") || null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.myPlants.id, id))
    .run();

  revalidatePath(`/plants/${id}`);
  revalidatePath("/plants");
  redirect(`/plants/${id}`);
}

export async function deletePlant(id: number) {
  const db = getDb();
  db.delete(schema.myPlants).where(eq(schema.myPlants.id, id)).run();
  revalidatePath("/plants");
  redirect("/plants");
}

export async function addPlantImage(plantId: number, filename: string, caption?: string) {
  const db = getDb();
  db.insert(schema.plantImages)
    .values({
      plantId,
      filename,
      caption: caption || null,
      createdAt: new Date().toISOString(),
    })
    .run();
  revalidatePath(`/plants/${plantId}`);
}

export async function deletePlantImage(imageId: number, plantId: number) {
  const db = getDb();
  db.delete(schema.plantImages).where(eq(schema.plantImages.id, imageId)).run();
  revalidatePath(`/plants/${plantId}`);
}
