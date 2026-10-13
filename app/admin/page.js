import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

async function getStats() {
  const supabase = createSupabaseServerClient();

  const [total, disponibles, vendidas, alquiladas] = await Promise.all([
    supabase.from("propiedades").select("id", { count: "exact", head: true }),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "disponible"),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "vendida"),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "alquilada"),
  ]);

  return {
    total: total.count ?? 0,
    disponibles: disponibles.count ?? 0,
    vendidas: vendidas.count ?? 0,
    alquiladas: alquiladas.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total de propiedades", value: stats.total },
    { label: "Disponibles", value: stats.disponibles },
    { label: "Vendidas", value: stats.vendidas },
    { label: "Alquiladas", value: stats.alquiladas },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Resumen
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-sm border border-stone bg-white p-5 sm:p-6"
          >
            <p className="font-display text-4xl font-extrabold text-ink">{card.value}</p>
            <p className="mt-1 text-sm text-slate">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/admin/propiedades/nueva" className="btn-primary">
          + Nueva propiedad
        </Link>
        <Link href="/admin/propiedades" className="btn-outline">
          Ver propiedades
        </Link>
      </div>
    </div>
  );
}
