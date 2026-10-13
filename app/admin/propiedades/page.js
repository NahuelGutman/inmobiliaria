import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyRowActions from "@/components/admin/PropertyRowActions";
import { formatearPrecio } from "@/lib/format";

async function getPropiedades() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select(
      "id, titulo, precio, moneda, consultar_precio, tipo, operacion, estado, imagenes_propiedades(url, es_principal)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

function imagenPrincipal(propiedad) {
  const imagenes = propiedad.imagenes_propiedades || [];
  return imagenes.find((img) => img.es_principal)?.url || imagenes[0]?.url;
}

function Miniatura({ propiedad, className }) {
  const url = imagenPrincipal(propiedad);
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className={`${className} rounded-sm object-cover`} />
  ) : (
    <div className={`${className} rounded-sm bg-stone`} />
  );
}

export default async function AdminPropiedadesPage() {
  const propiedades = await getPropiedades();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          Propiedades
        </h1>
        <Link href="/admin/propiedades/nueva" className="btn-primary">
          + Nueva propiedad
        </Link>
      </div>

      {propiedades.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          Todavía no hay propiedades cargadas.
        </div>
      ) : (
        <>
          {/* Celulares: tarjetas */}
          <ul className="mt-8 space-y-3 md:hidden">
            {propiedades.map((p) => (
              <li key={p.id} className="flex gap-4 rounded-sm border border-stone bg-white p-3">
                <Miniatura propiedad={p} className="h-20 w-24 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{p.titulo}</p>
                  <p className="text-sm capitalize text-slate">
                    {p.operacion} · {p.tipo} · {p.estado}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{formatearPrecio(p)}</p>
                  <div className="mt-2">
                    <PropertyRowActions propiedad={p} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Escritorio: tabla */}
          <div className="mt-8 hidden overflow-hidden rounded-sm border border-stone bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone bg-paper text-xs uppercase tracking-wider text-slate">
                  <th className="px-4 py-3 font-semibold">Imagen</th>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Operación</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map((p) => (
                  <tr key={p.id} className="border-b border-stone/60 last:border-0">
                    <td className="px-4 py-3">
                      <Miniatura propiedad={p} className="h-12 w-16" />
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{p.titulo}</td>
                    <td className="px-4 py-3 text-ink">{formatearPrecio(p)}</td>
                    <td className="px-4 py-3 capitalize text-ink">{p.tipo}</td>
                    <td className="px-4 py-3 capitalize text-ink">{p.operacion}</td>
                    <td className="px-4 py-3 capitalize text-ink">{p.estado}</td>
                    <td className="px-4 py-3">
                      <PropertyRowActions propiedad={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
