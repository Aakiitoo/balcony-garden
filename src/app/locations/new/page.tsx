import { LocationForm } from "@/components/LocationForm";

export default function NewLocationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-950">Create new location</h1>
      <p className="text-stone-600">
        Add a balcony spot or planter area you can assign to plants later.
      </p>
      <LocationForm />
    </div>
  );
}
