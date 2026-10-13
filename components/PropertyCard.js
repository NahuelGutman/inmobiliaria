import Link from "next/link";
import Image from "next/image";
import { formatearPrecio, caracteristicas } from "@/lib/format";

const ESTADOS_LABEL = {
  disponible: null, // no hace falta mostrar badge para el caso normal
  reservada: "Reservada",
  vendida: "Vendida",
  alquilada: "Alquilada",
};

export default function PropertyCard({ propiedad, imagenUrl }) {
  const badgeEstado = ESTADOS_LABEL[propiedad.estado];
  const specs = caracteristicas(propiedad);

  return (
    <Link
      href={`/propiedades/${propiedad.slug}`}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={propiedad.titulo}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate">
            Sin imagen
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-sm bg-white px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
          {propiedad.operacion}
        </span>
        {badgeEstado && (
          <span className="absolute left-3 top-3 rounded-sm bg-ink px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {badgeEstado}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-brass">
          {propiedad.tipo} · {propiedad.ciudad}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-ink">
          {propiedad.titulo}
        </h3>
        {specs.length > 0 && (
          <p className="mt-1 text-sm text-slate">{specs.join(" · ")}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-stone pt-4">
        <span className="font-display text-lg font-bold text-ink">
          {formatearPrecio(propiedad)}
        </span>
        <span className="text-sm font-semibold text-ink">Ver propiedad →</span>
      </div>
    </Link>
  );
}
