"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "/propiedades?operacion=alquiler", label: "Alquilar" },
  { href: "/propiedades?operacion=venta", label: "Comprar" },
  { href: "/propiedades", label: "Propiedades" },
];

export default function Navbar() {
  const pathname = usePathname();
  // En el inicio la barra es transparente y flota sobre el video del hero.
  const sobreVideo = pathname === "/";

  return (
    <header
      className={
        sobreVideo
          ? "absolute inset-x-0 top-0 z-40 text-white"
          : "sticky top-0 z-40 border-b border-stone bg-paper/90 text-ink backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt={siteConfig.nombreInmobiliaria}
            width={200}
            height={51}
            priority
            className={`h-auto w-40 sm:w-[200px] ${sobreVideo ? "brightness-0 invert" : ""}`}
          />
        </Link>

        <nav className="flex items-center gap-5 font-body text-sm font-medium sm:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:opacity-70">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
