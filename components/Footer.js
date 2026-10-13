import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10 px-4 py-14 text-sm sm:px-6">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-extrabold uppercase tracking-wide">
            {siteConfig.nombreInmobiliaria}
          </p>
          <p className="mt-3 text-white/70">
            Casas, departamentos, terrenos y locales en venta y alquiler.
          </p>
        </div>

        <nav className="flex gap-8 text-white/90">
          <Link href="/propiedades?operacion=alquiler" className="hover:opacity-70">Alquilar</Link>
          <Link href="/propiedades?operacion=venta" className="hover:opacity-70">Comprar</Link>
          <Link href="/propiedades" className="hover:opacity-70">Propiedades</Link>
        </nav>

        <p className="w-full border-t border-white/15 pt-6 text-xs text-white/60">
          © {year} {siteConfig.nombreInmobiliaria}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
