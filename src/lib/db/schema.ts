import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const plantCatalog = sqliteTable("plant_catalog", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // vegetable | fruit | herb
  sunlightHours: text("sunlight_hours").notNull(),
  sunlightType: text("sunlight_type").notNull(), // direct | indirect | partial | shade
  sunlightNotes: text("sunlight_notes"),
  waterFrequency: text("water_frequency").notNull(),
  waterNotes: text("water_notes"),
  potSizeMinLiters: integer("pot_size_min_liters"),
  potSizeNotes: text("pot_size_notes"),
  growingTips: text("growing_tips"),
});

export const myPlants = sqliteTable("my_plants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  catalogPlantId: integer("catalog_plant_id"),
  status: text("status").notNull().default("active"), // active | planned | harvested | archived
  plantedDate: text("planted_date"),
  location: text("location"),
  potSizeLiters: integer("pot_size_liters"),
  potNotes: text("pot_notes"),
  waterSchedule: text("water_schedule"),
  waterNotes: text("water_notes"),
  notes: text("notes"),
  successNotes: text("success_notes"),
  problemNotes: text("problem_notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const plantImages = sqliteTable("plant_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plantId: integer("plant_id")
    .notNull()
    .references(() => myPlants.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  caption: text("caption"),
  createdAt: text("created_at").notNull(),
});

export const diseases = sqliteTable("diseases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plantCatalogId: integer("plant_catalog_id"),
  name: text("name").notNull(),
  symptoms: text("symptoms").notNull(),
  prevention: text("prevention"),
  organicTreatment: text("organic_treatment").notNull(),
  chemicalTreatment: text("chemical_treatment"),
  recommendation: text("recommendation").notNull(), // organic_preferred | either | chemical_last_resort
});

export const fertilizers = sqliteTable("fertilizers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plantCatalogId: integer("plant_catalog_id"),
  name: text("name").notNull(),
  type: text("type").notNull(), // organic | synthetic | both
  npk: text("npk"),
  growthStage: text("growth_stage").notNull(),
  frequency: text("frequency").notNull(),
  applicationNotes: text("application_notes").notNull(),
});

export const companions = sqliteTable("companions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plantA: text("plant_a").notNull(),
  plantB: text("plant_b").notNull(),
  relationship: text("relationship").notNull(), // good | bad | neutral
  samePot: integer("same_pot", { mode: "boolean" }).notNull().default(true),
  notes: text("notes").notNull(),
});
