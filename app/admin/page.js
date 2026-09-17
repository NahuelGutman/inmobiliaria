import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import LogoutButton from "@/components/admin/LogoutButton";

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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">
          Panel de administración
        </h1>
        <LogoutButton />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-sm border border-stone bg-white p-6"
          >
            <p className="text-3xl font-display text-forest">{card.value}</p>
            <p className="mt-1 text-sm text-slate">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/admin/propiedades"
          className="rounded-sm border border-forest px-5 py-2.5 text-sm text-forest hover:bg-forest hover:text-paper"
        >
          Ver propiedades
        </Link>
        <Link
          href="/admin/propiedades/nueva"
          className="rounded-sm bg-forest px-5 py-2.5 text-sm text-paper hover:bg-forestLight"
        >
          + Nueva propiedad
        </Link>
      </div>
    </div>
  );
}
