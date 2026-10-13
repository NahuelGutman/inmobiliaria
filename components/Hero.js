import { createSupabaseServerClient } from "@/lib/supabaseServer";
import PropertyFilters from "@/components/PropertyFilters";

async function getCiudades() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("propiedades")
    .select("ciudad")
    .in("estado", ["disponible", "reservada"]);

  return [...new Set((data || []).map((p) => p.ciudad).filter(Boolean))].sort();
}

export default async function Hero() {
  const ciudades = await getCiudades();

  return (
    <section className="relative flex min-h-[820px] flex-col justify-end overflow-hidden bg-ink text-white md:min-h-[840px]">
      {/* Video de fondo: reemplazá /public/hero.mp4 por el video de la ciudad */}
      <video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-36 sm:px-6 sm:pb-12 sm:pt-40">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-white/80 sm:text-sm">
          Venta y alquiler de propiedades
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
          Encontrá el lugar donde empieza tu próxima etapa
        </h1>

        <div className="mt-8 sm:mt-10">
          <PropertyFilters ciudades={ciudades} />
        </div>
      </div>
    </section>
  );
}
