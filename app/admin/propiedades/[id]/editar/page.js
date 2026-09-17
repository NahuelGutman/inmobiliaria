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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl text-ink">Editar propiedad</h1>
      <PropertyForm
        modo="editar"
        propiedad={resultado.propiedad}
        imagenesIniciales={resultado.imagenes}
      />
    </div>
  );
}
