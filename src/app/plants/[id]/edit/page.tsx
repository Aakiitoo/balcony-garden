import { notFound } from "next/navigation";
import { getMyPlant, getCatalogPlants } from "@/lib/actions/plants";
import { PlantForm } from "@/components/PlantForm";

export default async function EditPlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMyPlant(Number(id));
  if (!data) notFound();

  const catalog = await getCatalogPlants();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Edit {data.plant.name}</h1>
      <PlantForm catalog={catalog} plant={data.plant} />
    </div>
  );
}
