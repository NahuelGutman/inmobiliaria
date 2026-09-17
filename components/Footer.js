import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone bg-forest text-paper">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <p className="font-display text-lg">{siteConfig.nombreInmobiliaria}</p>
        <p className="mt-2 text-paper/70">
          Casas, departamentos, terrenos y locales en venta y alquiler.
        </p>
        <p className="mt-6 text-xs text-paper/50">
          © {year} {siteConfig.nombreInmobiliaria}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
