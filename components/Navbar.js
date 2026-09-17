import Link from "next/link";
import { siteConfig } from "@/lib/config";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt={siteConfig.nombreInmobiliaria} width={220} height={56} priority />
      </Link>

        <nav className="flex items-center gap-8 font-body text-sm text-ink">
          <Link href="/" className="hover:text-forest">
            Inicio
          </Link>
          <Link href="/propiedades" className="hover:text-forest">
            Propiedades
          </Link>
        </nav>
      </div>
    </header>
  );
}
