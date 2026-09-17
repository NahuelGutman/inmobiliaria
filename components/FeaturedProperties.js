import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyCard from "@/components/PropertyCard";

async function getDestacadas() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("propiedades")
    .select(
      "id, titulo, slug, operacion, tipo, ciudad, precio, moneda, consultar_precio, estado, imagenes_propiedades(url, es_principal)"
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
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-2xl text-ink">
        Propiedades destacadas
      </h2>

      {propiedades.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          Todavía no hay propiedades destacadas cargadas.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
