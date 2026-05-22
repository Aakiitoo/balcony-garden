import {
  plantCatalog,
  diseases,
  fertilizers,
  companions,
} from "@/lib/data/reference";
import { companionKeyFromCatalogName } from "@/lib/garden";
import { getCatalogById } from "@/lib/data/reference";
import { getMyPlant } from "@/lib/store";

export function resolveCatalogId(params: {
  catalog?: string | null;
  plant?: string | null;
}): { catalogId: number | null; label: string | null } {
  if (params.plant) {
    const data = getMyPlant(Number(params.plant));
    if (data?.catalog) {
      return {
        catalogId: data.catalog.id,
        label: `${data.plant.name} (${data.catalog.name})`,
      };
    }
  }
  if (params.catalog) {
    const id = Number(params.catalog);
    const cat = getCatalogById(id);
    if (cat) return { catalogId: id, label: cat.name };
  }
  return { catalogId: null, label: null };
}

export function getSunlightForCatalog(catalogId: number) {
  return plantCatalog.find((p) => p.id === catalogId) ?? null;
}

export function getDiseasesForCatalog(catalogId: number) {
  return diseases.filter(
    (d) =>
      d.plantCatalogId === null || d.plantCatalogId === catalogId,
  );
}

export function getFertilizersForCatalog(catalogId: number) {
  return fertilizers.filter((f) => f.plantCatalogId === catalogId);
}

export function getCompanionsForCatalog(catalogId: number, filter?: "good" | "bad") {
  const key = companionKeyFromCatalogName(
    plantCatalog.find((p) => p.id === catalogId)?.name ?? "",
  );
  let list = companions.filter((c) => c.plantA === key || c.plantB === key);
  if (filter) list = list.filter((c) => c.relationship === filter);
  return list;
}

export function tipsHref(
  section: "sunlight" | "diseases" | "fertilizers" | "companions",
  catalogId: number,
) {
  return `/guides/${section}?catalog=${catalogId}`;
}
