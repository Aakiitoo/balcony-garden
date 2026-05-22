import type { MyPlant, PlantImage, PlantFormData } from "@/lib/types";
import { plantCatalog } from "@/lib/data/reference";

const STORAGE_KEY = "balcony-garden-v1";

type Persisted = {
  myPlants: MyPlant[];
  images: PlantImage[];
  nextPlantId: number;
  nextImageId: number;
};

function empty(): Persisted {
  return { myPlants: [], images: [], nextPlantId: 1, nextImageId: 1 };
}

function load(): Persisted {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

function save(data: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("balcony-garden-update"));
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
  return { plant, images, catalog };
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

export function parsePlantForm(formData: FormData): PlantFormData {
  const catalogPlantId = Number(formData.get("catalogPlantId"));
  if (!catalogPlantId) {
    throw new Error("Plant type is required.");
  }
  const potRaw = formData.get("potSizeLiters");
  return {
    name: String(formData.get("name") || "").trim(),
    catalogPlantId,
    status: String(formData.get("status") || "active"),
    plantedDate: String(formData.get("plantedDate") || "") || null,
    location: String(formData.get("location") || "") || null,
    potSizeLiters: potRaw ? Number(potRaw) : null,
    potNotes: String(formData.get("potNotes") || "") || null,
    waterSchedule: String(formData.get("waterSchedule") || "") || null,
    waterNotes: String(formData.get("waterNotes") || "") || null,
    notes: String(formData.get("notes") || "") || null,
    successNotes: String(formData.get("successNotes") || "") || null,
    problemNotes: String(formData.get("problemNotes") || "") || null,
  };
}
