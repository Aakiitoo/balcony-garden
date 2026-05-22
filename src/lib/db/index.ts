import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";
import { seedDatabase } from "./seed";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

function getDbPath() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "garden.db");
}

function initDb() {
  const sqlite = new Database(getDbPath());
  const db = drizzle(sqlite, { schema });

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS plant_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sunlight_hours TEXT NOT NULL,
      sunlight_type TEXT NOT NULL,
      sunlight_notes TEXT,
      water_frequency TEXT NOT NULL,
      water_notes TEXT,
      pot_size_min_liters INTEGER,
      pot_size_notes TEXT,
      growing_tips TEXT
    );
    CREATE TABLE IF NOT EXISTS my_plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      catalog_plant_id INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      planted_date TEXT,
      location TEXT,
      pot_size_liters INTEGER,
      pot_notes TEXT,
      water_schedule TEXT,
      water_notes TEXT,
      notes TEXT,
      success_notes TEXT,
      problem_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS plant_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plant_id INTEGER NOT NULL REFERENCES my_plants(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      caption TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plant_catalog_id INTEGER,
      name TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      prevention TEXT,
      organic_treatment TEXT NOT NULL,
      chemical_treatment TEXT,
      recommendation TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS fertilizers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plant_catalog_id INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      npk TEXT,
      growth_stage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      application_notes TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS companions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plant_a TEXT NOT NULL,
      plant_b TEXT NOT NULL,
      relationship TEXT NOT NULL,
      same_pot INTEGER NOT NULL DEFAULT 1,
      notes TEXT NOT NULL
    );
  `);

  const count = sqlite
    .prepare("SELECT COUNT(*) as c FROM plant_catalog")
    .get() as { c: number };
  if (count.c === 0) {
    seedDatabase(db);
  }

  return db;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = initDb();
  }
  return globalForDb.db;
}

export function getUploadsDir() {
  const dir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}
