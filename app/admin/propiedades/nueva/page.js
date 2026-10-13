import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NuevaPropiedadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/admin/propiedades" className="text-sm text-slate hover:text-ink">
        ← Volver a propiedades
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">
        Nueva propiedad
      </h1>
      <PropertyForm modo="crear" />
    </div>
  );
}
