import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyCard from "@/components/PropertyCard";

async function getCiudades() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("propiedades")
    .select("ciudad")
    .in("estado", ["disponible", "reservada"]);

  const unicas = [...new Set((data || []).map((p) => p.ciudad))].sort();
  return unicas;
}

async function getPropiedades(searchParams) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("propiedades")
    .select(
      "id, titulo, slug, operacion, tipo, ciudad, precio, moneda, consultar_precio, estado, imagenes_propiedades(url, es_principal)"
    )
    // Por defecto, vendidas y alquiladas no aparecen en el listado principal
    .in("estado", ["disponible", "reservada"])
    .order("created_at", { ascending: false });

  if (searchParams.operacion) {
    query = query.eq("operacion", searchParams.operacion);
  }
  if (searchParams.tipo) {
    query = query.eq("tipo", searchParams.tipo);
  }
  if (searchParams.ciudad) {
    query = query.eq("ciudad", searchParams.ciudad);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function PropiedadesPage({ searchParams }) {
  const [propiedades, ciudades] = await Promise.all([
    getPropiedades(searchParams),
    getCiudades(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Propiedades</h1>

      {/* Filtros: formulario GET simple, funciona sin JavaScript */}
      <form className="mt-8 flex flex-wrap gap-4" method="get">
        <select
          name="operacion"
          defaultValue={searchParams.operacion || ""}
          className="rounded-sm border border-stone bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="">Operación (todas)</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>

        <select
          name="tipo"
          defaultValue={searchParams.tipo || ""}
          className="rounded-sm border border-stone bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="">Tipo (todos)</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
          <option value="local">Local</option>
        </select>

        <select
          name="ciudad"
          defaultValue={searchParams.ciudad || ""}
          className="rounded-sm border border-stone bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="">Ciudad (todas)</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-sm bg-forest px-5 py-2 text-sm text-paper hover:bg-forestLight"
        >
          Filtrar
        </button>

        {(searchParams.operacion || searchParams.tipo || searchParams.ciudad) && (
          <a
            href="/propiedades"
            className="flex items-center text-sm text-slate underline"
          >
            Limpiar filtros
          </a>
        )}
      </form>

      {propiedades.length === 0 ? (
        <div className="mt-12 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          No se encontraron propiedades con esos filtros.
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
    </div>
  );
}
