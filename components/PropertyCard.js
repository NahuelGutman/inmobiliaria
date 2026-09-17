import Link from "next/link";
import Image from "next/image";

const ESTADOS_LABEL = {
  disponible: null, // no hace falta mostrar badge para el caso normal
  reservada: "Reservada",
  vendida: "Vendida",
  alquilada: "Alquilada",
};

function formatearPrecio(propiedad) {
  if (propiedad.consultar_precio) return "Consultar precio";
  if (!propiedad.precio) return "Consultar precio";
  return `${propiedad.moneda} ${Number(propiedad.precio).toLocaleString(
    "es-AR"
  )}`;
}

export default function PropertyCard({ propiedad, imagenUrl }) {
  const badgeEstado = ESTADOS_LABEL[propiedad.estado];

  return (
    <Link
      href={`/propiedades/${propiedad.slug}`}
      className="group block overflow-hidden rounded-sm border border-stone bg-white"
    >
      <div className="relative h-48 w-full bg-stone">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={propiedad.titulo}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate">
            Sin imagen
          </div>
        )}
        {badgeEstado && (
          <span className="absolute left-3 top-3 rounded-sm bg-ink/80 px-2 py-1 text-xs text-paper">
            {badgeEstado}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-brass">
          {propiedad.operacion} · {propiedad.tipo}
        </p>
        <h3 className="mt-1 font-display text-lg text-ink">
          {propiedad.titulo}
        </h3>
        <p className="mt-1 text-sm text-slate">{propiedad.ciudad}</p>
        <p className="mt-3 font-body text-sm font-medium text-forest">
          {formatearPrecio(propiedad)}
        </p>
      </div>
    </Link>
  );
}
