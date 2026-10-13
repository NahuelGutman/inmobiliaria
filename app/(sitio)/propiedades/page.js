import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";

export const metadata = { title: "Propiedades" };

// Los parámetros de la URL pueden llegar como array; tomamos siempre el primero.
function param(searchParams, key) {
  const v = searchParams?.[key];
  return (Array.isArray(v) ? v[0] : v) || "";
}

function numero(valor) {
  if (valor === "") return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

async function getCiudades() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("propiedades")
    .select("ciudad")
    .in("estado", ["disponible", "reservada"]);

  return [...new Set((data || []).map((p) => p.ciudad).filter(Boolean))].sort();
}

async function getPropiedades(filtros) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("propiedades")
    .select(
      "id, titulo, slug, operacion, tipo, ciudad, precio, moneda, consultar_precio, estado, habitaciones, banos, cocheras, superficie_total, imagenes_propiedades(url, es_principal)"
    )
    // Por defecto, vendidas y alquiladas no aparecen en el listado principal
    .in("estado", ["disponible", "reservada"])
    .order("created_at", { ascending: false });

  if (filtros.operacion) query = query.eq("operacion", filtros.operacion);
  if (filtros.tipo) query = query.eq("tipo", filtros.tipo);
  if (filtros.ciudad) query = query.eq("ciudad", filtros.ciudad);

  const hab = numero(filtros.habitaciones);
  if (hab !== null) query = query.gte("habitaciones", hab);
  const banos = numero(filtros.banos);
  if (banos !== null) query = query.gte("banos", banos);
  const cocheras = numero(filtros.cocheras);
  if (cocheras !== null) query = query.gte("cocheras", cocheras);

  // El precio máximo siempre se compara dentro de la misma moneda
  // (alquileres en ARS, ventas en USD), si no, los números no son comparables.
  const precioMax = numero(filtros.precio_max);
  if (precioMax !== null) {
    const moneda = filtros.moneda === "ARS" ? "ARS" : "USD";
    query = query.eq("moneda", moneda).lte("precio", precioMax);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function PropiedadesPage({ searchParams }) {
  const filtros = {
    operacion: param(searchParams, "operacion"),
    tipo: param(searchParams, "tipo"),
    ciudad: param(searchParams, "ciudad"),
    habitaciones: param(searchParams, "habitaciones"),
    banos: param(searchParams, "banos"),
    cocheras: param(searchParams, "cocheras"),
    precio_max: param(searchParams, "precio_max"),
    moneda: param(searchParams, "moneda"),
  };

  const [propiedades, ciudades] = await Promise.all([
    getPropiedades(filtros),
    getCiudades(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
        Propiedades
      </h1>

      <div className="mt-8">
        {/* key: reinicia el estado de los filtros cuando cambia la búsqueda */}
        <PropertyFilters
          key={JSON.stringify(filtros)}
          ciudades={ciudades}
          values={filtros}
        />
      </div>

      <p className="mt-8 text-sm text-slate">
        {propiedades.length === 1
          ? "1 propiedad encontrada"
          : `${propiedades.length} propiedades encontradas`}
      </p>

      {propiedades.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          No se encontraron propiedades con esos filtros.
        </div>
      ) : (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
