import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyGallery from "@/components/PropertyGallery";
import WhatsappButton from "@/components/WhatsappButton";

async function getPropiedad(slug) {
  const supabase = createSupabaseServerClient();

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!propiedad) return null;

  const { data: imagenes } = await supabase
    .from("imagenes_propiedades")
    .select("id, url, es_principal")
    .eq("propiedad_id", propiedad.id)
    .order("orden", { ascending: true });

  return { propiedad, imagenes: imagenes || [] };
}

function formatearPrecio(propiedad) {
  if (propiedad.consultar_precio || !propiedad.precio) return "Consultar precio";
  return `${propiedad.moneda} ${Number(propiedad.precio).toLocaleString(
    "es-AR"
  )}`;
}

export async function generateMetadata({ params }) {
  const resultado = await getPropiedad(params.slug);
  if (!resultado) return {};
  return {
    title: resultado.propiedad.titulo,
    description: resultado.propiedad.descripcion?.slice(0, 150),
  };
}

export default async function PropiedadDetallePage({ params }) {
  const resultado = await getPropiedad(params.slug);
  if (!resultado) notFound();

  const { propiedad, imagenes } = resultado;

  const caracteristicas = [
    propiedad.habitaciones != null && `${propiedad.habitaciones} habitaciones`,
    propiedad.banos != null && `${propiedad.banos} baños`,
    propiedad.cocheras != null && `${propiedad.cocheras} cocheras`,
    propiedad.superficie_total != null &&
      `${propiedad.superficie_total} m² totales`,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-brass">
        {propiedad.operacion} · {propiedad.tipo}
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink">
        {propiedad.titulo}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {propiedad.ciudad}
        {propiedad.direccion ? ` · ${propiedad.direccion}` : ""}
      </p>

      <div className="mt-8">
        <PropertyGallery imagenes={imagenes} titulo={propiedad.titulo} />
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          {propiedad.descripcion && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {propiedad.descripcion}
            </p>
          )}

          {caracteristicas.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-slate">
              {caracteristicas.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-sm border border-stone bg-white p-6">
          <p className="font-display text-2xl text-forest">
            {formatearPrecio(propiedad)}
          </p>
          <p className="mt-1 text-sm capitalize text-slate">
            Estado: {propiedad.estado}
          </p>
          <div className="mt-6">
            <WhatsappButton tituloPropiedad={propiedad.titulo} />
          </div>
        </div>
      </div>
    </div>
  );
}
