import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyGallery from "@/components/PropertyGallery";
import WhatsappButton from "@/components/WhatsappButton";
import { formatearPrecio } from "@/lib/format";

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

  // La imagen principal va primero en la galería
  const ordenadas = [...(imagenes || [])].sort(
    (a, b) => Number(b.es_principal) - Number(a.es_principal)
  );

  return { propiedad, imagenes: ordenadas };
}

export async function generateMetadata({ params }) {
  const resultado = await getPropiedad(params.slug);
  if (!resultado) return {};
  return {
    title: resultado.propiedad.titulo,
    description: resultado.propiedad.descripcion?.slice(0, 150),
  };
}

const ESTADOS_AVISO = {
  reservada: "Esta propiedad está reservada.",
  vendida: "Esta propiedad ya fue vendida.",
  alquilada: "Esta propiedad ya fue alquilada.",
};

export default async function PropiedadDetallePage({ params }) {
  const resultado = await getPropiedad(params.slug);
  if (!resultado) notFound();

  const { propiedad, imagenes } = resultado;
  const aviso = ESTADOS_AVISO[propiedad.estado];

  const datos = [
    ["Habitaciones", propiedad.habitaciones],
    ["Baños", propiedad.banos],
    ["Cocheras", propiedad.cocheras],
    ["Superficie", propiedad.superficie_total != null ? `${propiedad.superficie_total} m²` : null],
  ].filter(([, v]) => v != null);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 lg:pb-20">
      <Link
        href="/propiedades"
        className="text-sm font-semibold text-ink hover:opacity-70"
      >
        ← Volver a propiedades
      </Link>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">
          {propiedad.operacion} · {propiedad.tipo}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
          {propiedad.titulo}
        </h1>
        <p className="mt-2 text-slate">
          {propiedad.ciudad}
          {propiedad.direccion ? ` · ${propiedad.direccion}` : ""}
        </p>
      </div>

      <div className="mt-8">
        <PropertyGallery imagenes={imagenes} titulo={propiedad.titulo} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-14">
        <div className="lg:col-span-2">
          {datos.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-stone bg-stone sm:grid-cols-4">
              {datos.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="bg-white p-5">
                  <dd className="font-display text-2xl font-bold text-ink">{valor}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-wider text-slate">{etiqueta}</dt>
                </div>
              ))}
            </dl>
          )}

          {propiedad.descripcion && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-ink">Descripción</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/90">
                {propiedad.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Tarjeta de contacto: fija al hacer scroll en escritorio */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-sm border border-stone bg-white p-7">
            <p className="text-xs uppercase tracking-wider text-slate">
              {propiedad.operacion === "alquiler" ? "Alquiler" : "Precio de venta"}
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">
              {formatearPrecio(propiedad)}
            </p>
            {aviso && (
              <p className="mt-4 rounded-sm bg-paper px-3 py-2 text-sm text-ink">{aviso}</p>
            )}
            <div className="mt-6">
              <WhatsappButton tituloPropiedad={propiedad.titulo} />
            </div>
          </div>
        </aside>
      </div>

      {/* Barra de contacto fija en celulares */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-extrabold text-ink">
              {formatearPrecio(propiedad)}
            </p>
            {aviso && <p className="truncate text-xs text-slate">{aviso}</p>}
          </div>
          <div className="w-48 shrink-0">
            <WhatsappButton tituloPropiedad={propiedad.titulo} />
          </div>
        </div>
      </div>
    </div>
  );
}
