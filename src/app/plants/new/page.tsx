import { PlantForm } from "@/components/PlantForm";

export default function NewPlantPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Add a plant</h1>
      <p className="text-stone-600">
        Track something you are growing now or plan to plant on your balcony.
      </p>
      <PlantForm />
    </div>
  );
}
