"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Resumen", exacto: true },
  { href: "/admin/propiedades", label: "Propiedades" },
];

export default function AdminHeader() {
  const pathname = usePathname();

  // La pantalla de login no muestra el menú del panel
  if (pathname === "/admin/login") return null;

  return (
    <header className="border-b border-stone bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-sm font-extrabold uppercase tracking-widest">
            Panel
          </Link>
          <nav className="flex gap-5 text-sm">
            {links.map((l) => {
              const activo = l.exacto ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={activo ? "font-semibold text-white" : "text-white/60 hover:text-white"}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/" target="_blank" className="text-white/60 hover:text-white">
            Ver sitio ↗
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
