import PropertyForm from "@/components/admin/PropertyForm";

export default function NuevaPropiedadPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl text-ink">Nueva propiedad</h1>
      <PropertyForm modo="crear" />
    </div>
  );
}
