import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import LogoutButton from "@/components/admin/LogoutButton";
import PropertyRowActions from "@/components/admin/PropertyRowActions";

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

export default async function AdminPropiedadesPage() {
  const propiedades = await getPropiedades();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Propiedades</h1>
        <LogoutButton />
      </div>

      <div className="mt-6">
        <Link
          href="/admin/propiedades/nueva"
          className="inline-block rounded-sm bg-forest px-5 py-2.5 text-sm text-paper hover:bg-forestLight"
        >
          + Nueva propiedad
        </Link>
      </div>

      {propiedades.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-stone p-12 text-center text-sm text-slate">
          Todavía no hay propiedades cargadas.
        </div>
      ) : (
        <table className="mt-10 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone text-slate">
              <th className="py-2">Imagen</th>
              <th className="py-2">Título</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Operación</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.map((p) => (
              <tr key={p.id} className="border-b border-stone/60">
                <td className="py-3">
                  {imagenPrincipal(p) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagenPrincipal(p)}
                      alt=""
                      className="h-12 w-16 rounded-sm object-cover"
                    />
                  ) : (
                    <div className="h-12 w-16 rounded-sm bg-stone" />
                  )}
                </td>
                <td className="py-3 text-ink">{p.titulo}</td>
                <td className="py-3 text-ink">
                  {p.consultar_precio
                    ? "Consultar"
                    : `${p.moneda} ${p.precio?.toLocaleString("es-AR")}`}
                </td>
                <td className="py-3 capitalize text-ink">{p.tipo}</td>
                <td className="py-3 capitalize text-ink">{p.operacion}</td>
                <td className="py-3 capitalize text-ink">{p.estado}</td>
                <td className="py-3">
                  <PropertyRowActions propiedad={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
