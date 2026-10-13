import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyForm from "@/components/admin/PropertyForm";

async function getPropiedad(id) {
  const supabase = createSupabaseServerClient();

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();

  if (!propiedad) return null;

  const { data: imagenes } = await supabase
    .from("imagenes_propiedades")
    .select("id, url, es_principal, orden")
    .eq("propiedad_id", id)
    .order("orden", { ascending: true });

  return { propiedad, imagenes: imagenes || [] };
}

export default async function EditarPropiedadPage({ params }) {
  const resultado = await getPropiedad(params.id);

  if (!resultado) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/admin/propiedades" className="text-sm text-slate hover:text-ink">
        ← Volver a propiedades
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">
        Editar propiedad
      </h1>
      <PropertyForm
        modo="editar"
        propiedad={resultado.propiedad}
        imagenesIniciales={resultado.imagenes}
      />
    </div>
  );
}
