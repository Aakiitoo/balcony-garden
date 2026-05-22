export type PlantCatalog = {
  id: number;
  name: string;
  category: string;
  sunlightHours: string;
  sunlightType: string;
  sunlightNotes: string | null;
  waterFrequency: string;
  waterNotes: string | null;
  potSizeMinLiters: number | null;
  potSizeNotes: string | null;
  growingTips: string | null;
};

export type MyPlant = {
  id: number;
  name: string;
  catalogPlantId: number;
  status: string;
  plantedDate: string | null;
  location: string | null;
  potSizeLiters: number | null;
  potNotes: string | null;
  waterSchedule: string | null;
  waterNotes: string | null;
  notes: string | null;
  successNotes: string | null;
  problemNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlantImage = {
  id: number;
  plantId: number;
  dataUrl: string;
  caption: string | null;
  createdAt: string;
};

export type Disease = {
  id: number;
  plantCatalogId: number | null;
  name: string;
  symptoms: string;
  prevention: string | null;
  organicTreatment: string;
  chemicalTreatment: string | null;
  recommendation: string;
};

export type Fertilizer = {
  id: number;
  plantCatalogId: number | null;
  name: string;
  type: string;
  npk: string | null;
  growthStage: string;
  frequency: string;
  applicationNotes: string;
};

export type Companion = {
  id: number;
  plantA: string;
  plantB: string;
  relationship: string;
  samePot: boolean;
  notes: string;
};

export type PlantFormData = {
  name: string;
  catalogPlantId: number;
  status: string;
  plantedDate: string | null;
  location: string | null;
  potSizeLiters: number | null;
  potNotes: string | null;
  waterSchedule: string | null;
  waterNotes: string | null;
  notes: string | null;
  successNotes: string | null;
  problemNotes: string | null;
};
