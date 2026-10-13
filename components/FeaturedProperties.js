import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyCard from "@/components/PropertyCard";

async function getDestacadas() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("propiedades")
    .select(
      "id, titulo, slug, operacion, tipo, ciudad, precio, moneda, consultar_precio, estado, habitaciones, banos, cocheras, superficie_total, imagenes_propiedades(url, es_principal)"
    )
    .eq("destacada", true)
    .in("estado", ["disponible", "reservada"])
    .order("created_at", { ascending: false })
    .limit(3);

  return data || [];
}

export default async function FeaturedProperties() {
  const propiedades = await getDestacadas();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Selección</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Propiedades destacadas
          </h2>
        </div>
        <Link
          href="/propiedades"
          className="border-b-2 border-ink pb-1 text-sm font-semibold text-ink"
        >
          Ver todas
        </Link>
      </div>

      {propiedades.length === 0 ? (
        <div className="mt-12 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          Todavía no hay propiedades destacadas cargadas.
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {propiedades.map((p) => {
            const imagenes = p.imagenes_propiedades || [];
            const imagenUrl =
              imagenes.find((img) => img.es_principal)?.url ||
              imagenes[0]?.url;
            return (
              <PropertyCard key={p.id} propiedad={p} imagenUrl={imagenUrl} />
            );
          })}
        </div>
      )}
    </section>
  );
}
