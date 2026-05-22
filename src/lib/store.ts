import type {
  MyPlant,
  PlantImage,
  PlantFormData,
  Location,
  LocationFormData,
} from "@/lib/types";
import { plantCatalog } from "@/lib/data/reference";

const STORAGE_KEY = "balcony-garden-v2";
const LEGACY_KEY = "balcony-garden-v1";

type Persisted = {
  myPlants: MyPlant[];
  images: PlantImage[];
  locations: Location[];
  nextPlantId: number;
  nextImageId: number;
  nextLocationId: number;
};

function empty(): Persisted {
  return {
    myPlants: [],
    images: [],
    locations: [],
    nextPlantId: 1,
    nextImageId: 1,
    nextLocationId: 1,
  };
}

const LEGACY_CATALOG_MAP: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
};

function migrateV1(raw: string): Persisted {
  const data = empty();
  try {
    const old = JSON.parse(raw) as {
      myPlants: Array<Record<string, unknown>>;
      images: PlantImage[];
      nextPlantId: number;
      nextImageId: number;
    };
    const locationNameToId = new Map<string, number>();

    function ensureLocation(name: string): number {
      const trimmed = name.trim();
      if (!trimmed) return 0;
      const existing = locationNameToId.get(trimmed.toLowerCase());
      if (existing) return existing;
      const id = data.nextLocationId;
      data.locations.push({
        id,
        name: trimmed,
        description: null,
        sunlightMode: "hours",
        sunlightHours: 6,
        createdAt: new Date().toISOString(),
      });
      locationNameToId.set(trimmed.toLowerCase(), id);
      data.nextLocationId += 1;
      return id;
    }

    for (const p of old.myPlants) {
      const legacyLoc = p.location as string | null | undefined;
      let locationId: number | null = null;
      if (legacyLoc) {
        const lid = ensureLocation(legacyLoc);
        locationId = lid || null;
      }
      const legacyCatalog = Number(p.catalogPlantId) || 1;
      data.myPlants.push({
        id: Number(p.id),
        name: String(p.name),
        catalogPlantId: LEGACY_CATALOG_MAP[legacyCatalog] ?? legacyCatalog,
        status: String(p.status ?? "active"),
        plantedDate: (p.plantedDate as string) || null,
        locationId,
        potSizeLiters: p.potSizeLiters != null ? Number(p.potSizeLiters) : null,
        notes: (p.notes as string) || null,
        successNotes: (p.successNotes as string) || null,
        problemNotes: (p.problemNotes as string) || null,
        lastFertilizedDate: null,
        lastFertilizerUsed: null,
        currentProblems: null,
        potStage: null,
        createdAt: String(p.createdAt),
        updatedAt: String(p.updatedAt ?? p.createdAt),
      });
    }
    data.images = old.images ?? [];
    data.nextPlantId = old.nextPlantId ?? data.myPlants.length + 1;
    data.nextImageId = old.nextImageId ?? 1;
  } catch {
    return empty();
  }
  return data;
}

function normalizeLocation(loc: Location & Partial<Location>): Location {
  const mode = loc.sunlightMode === "full_shade" ? "full_shade" : "hours";
  return {
    id: loc.id,
    name: loc.name,
    description: loc.description ?? null,
    sunlightMode: mode,
    sunlightHours:
      mode === "full_shade"
        ? null
        : Math.min(10, Math.max(1, loc.sunlightHours ?? 6)),
    createdAt: loc.createdAt,
  };
}

function normalizePlant(p: MyPlant & Partial<MyPlant>): MyPlant {
  return {
    ...p,
    lastFertilizedDate: p.lastFertilizedDate ?? null,
    lastFertilizerUsed: p.lastFertilizerUsed ?? null,
    currentProblems: p.currentProblems ?? null,
    potStage:
      p.potStage === "starter" || p.potStage === "final" ? p.potStage : null,
  };
}

function normalizeData(parsed: Persisted): Persisted {
  return {
    ...parsed,
    locations: (parsed.locations ?? []).map((l) =>
      normalizeLocation(l as Location),
    ),
    myPlants: (parsed.myPlants ?? []).map((p) =>
      normalizePlant(p as MyPlant),
    ),
  };
}

function load(): Persisted {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeData({ ...empty(), ...JSON.parse(raw) });
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateV1(legacy);
      save(migrated);
      return migrated;
    }
    return empty();
  } catch {
    return empty();
  }
}

function save(data: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("balcony-garden-update"));
}

export function getLocations(): Location[] {
  const { locations } = load();
  return [...locations].sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocation(id: number): Location | null {
  return load().locations.find((l) => l.id === id) ?? null;
}

export function parseLocationForm(formData: FormData): LocationFormData {
  const mode = formData.get("sunlightMode") as "full_shade" | "hours";
  const hoursRaw = formData.get("sunlightHours");
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    sunlightMode: mode === "full_shade" ? "full_shade" : "hours",
    sunlightHours:
      mode === "full_shade"
        ? null
        : Math.min(10, Math.max(1, Number(hoursRaw) || 6)),
  };
}

export function createLocation(form: LocationFormData): number {
  const data = load();
  const id = data.nextLocationId;
  data.locations.push({
    id,
    name: form.name,
    description: form.description,
    sunlightMode: form.sunlightMode,
    sunlightHours: form.sunlightHours,
    createdAt: new Date().toISOString(),
  });
  data.nextLocationId += 1;
  save(data);
  return id;
}

export function updateLocation(id: number, form: LocationFormData) {
  const data = load();
  const idx = data.locations.findIndex((l) => l.id === id);
  if (idx === -1) return;
  data.locations[idx] = {
    ...data.locations[idx],
    name: form.name,
    description: form.description,
    sunlightMode: form.sunlightMode,
    sunlightHours: form.sunlightHours,
  };
  save(data);
}

/** @param moveToLocationId null = choose later, -1 handled as later in UI */
export function deleteLocationAndReassign(
  id: number,
  moveToLocationId: number | null,
) {
  const data = load();
  data.locations = data.locations.filter((l) => l.id !== id);
  for (const p of data.myPlants) {
    if (p.locationId === id) {
      p.locationId = moveToLocationId;
    }
  }
  save(data);
}

export function deleteLocation(id: number) {
  deleteLocationAndReassign(id, null);
}

export function assignPlantToLocation(plantId: number, locationId: number) {
  const data = load();
  const idx = data.myPlants.findIndex((p) => p.id === plantId);
  if (idx === -1) return;
  data.myPlants[idx] = {
    ...data.myPlants[idx],
    locationId,
    updatedAt: new Date().toISOString(),
  };
  save(data);
}

export function getPlantsByLocation(locationId: number) {
  return getMyPlants().filter((p) => p.locationId === locationId);
}

export function getLocationName(locationId: number | null): string | null {
  if (!locationId) return null;
  return getLocation(locationId)?.name ?? null;
}

export function getMyPlants(status?: string): MyPlant[] {
  const { myPlants } = load();
  const sorted = [...myPlants].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  if (status) return sorted.filter((p) => p.status === status);
  return sorted;
}

export function getMyPlant(id: number) {
  const data = load();
  const plant = data.myPlants.find((p) => p.id === id);
  if (!plant) return null;
  const images = data.images
    .filter((i) => i.plantId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const catalog = plantCatalog.find((c) => c.id === plant.catalogPlantId) ?? null;
  const location = plant.locationId
    ? data.locations.find((l) => l.id === plant.locationId) ?? null
    : null;
  return { plant, images, catalog, location };
}

export function getCatalogPlants() {
  return plantCatalog.map((p) => ({ id: p.id, name: p.name }));
}

export function createPlant(form: PlantFormData): number {
  const data = load();
  const now = new Date().toISOString();
  const id = data.nextPlantId;
  data.myPlants.push({
    id,
    ...form,
    successNotes: form.successNotes ?? null,
    problemNotes: form.problemNotes ?? null,
    lastFertilizedDate: form.lastFertilizedDate ?? null,
    lastFertilizerUsed: form.lastFertilizerUsed ?? null,
    createdAt: now,
    updatedAt: now,
  });
  data.nextPlantId += 1;
  save(data);
  return id;
}

export function updatePlant(id: number, form: PlantFormData) {
  const data = load();
  const idx = data.myPlants.findIndex((p) => p.id === id);
  if (idx === -1) return;
  data.myPlants[idx] = {
    ...data.myPlants[idx],
    ...form,
    updatedAt: new Date().toISOString(),
  };
  save(data);
}

export function deletePlant(id: number) {
  const data = load();
  data.myPlants = data.myPlants.filter((p) => p.id !== id);
  data.images = data.images.filter((i) => i.plantId !== id);
  save(data);
}

export function addPlantImage(plantId: number, dataUrl: string, caption?: string) {
  const data = load();
  data.images.push({
    id: data.nextImageId,
    plantId,
    dataUrl,
    caption: caption ?? null,
    createdAt: new Date().toISOString(),
  });
  data.nextImageId += 1;
  save(data);
}

export function deletePlantImage(imageId: number) {
  const data = load();
  data.images = data.images.filter((i) => i.id !== imageId);
  save(data);
}

export function parsePlantForm(
  formData: FormData,
  mode: "add" | "edit",
): PlantFormData {
  const catalogPlantId = Number(formData.get("catalogPlantId"));
  if (!catalogPlantId) {
    throw new Error("Plant type is required.");
  }
  const locationRaw = formData.get("locationId");
  const locationId =
    locationRaw === "later" || locationRaw === "" || locationRaw == null
      ? null
      : Number(locationRaw);

  const potRaw = formData.get("potSizeLiters");
  const potStageRaw = formData.get("potStage");

  const base: PlantFormData = {
    name: String(formData.get("name") || "").trim(),
    catalogPlantId,
    status: String(formData.get("status") || "active"),
    plantedDate: String(formData.get("plantedDate") || "") || null,
    locationId,
    potSizeLiters: potRaw ? Number(potRaw) : null,
    notes: String(formData.get("notes") || "") || null,
    successNotes: null,
    problemNotes: null,
    lastFertilizedDate: null,
    lastFertilizerUsed: null,
    currentProblems: null,
    potStage:
      potStageRaw === "starter" || potStageRaw === "final"
        ? potStageRaw
        : null,
  };

  if (mode === "edit") {
    base.successNotes = String(formData.get("successNotes") || "") || null;
    base.problemNotes = String(formData.get("problemNotes") || "") || null;
    base.currentProblems =
      String(formData.get("currentProblems") || "") || null;
    const status = base.status;
    if (status === "active") {
      base.lastFertilizedDate =
        String(formData.get("lastFertilizedDate") || "") || null;
      base.lastFertilizerUsed =
        String(formData.get("lastFertilizerUsed") || "") || null;
    } else {
      base.lastFertilizedDate = null;
      base.lastFertilizerUsed = null;
    }
  }

  return base;
}
