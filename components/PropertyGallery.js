"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function PropertyGallery({ imagenes, titulo }) {
  const [activa, setActiva] = useState(0);
  const [abierta, setAbierta] = useState(false);

  const total = imagenes?.length || 0;

  const anterior = useCallback(
    () => setActiva((i) => (i - 1 + total) % total),
    [total]
  );
  const siguiente = useCallback(
    () => setActiva((i) => (i + 1) % total),
    [total]
  );

  // Teclado en pantalla completa: Esc cierra, flechas navegan
  useEffect(() => {
    if (!abierta) return;
    function onKey(e) {
      if (e.key === "Escape") setAbierta(false);
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [abierta, anterior, siguiente]);

  if (total === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-sm bg-stone text-sm text-slate">
        Sin imágenes
      </div>
    );
  }

  const flecha =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white";

  return (
    <div>
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone sm:aspect-[16/10]">
        <button
          type="button"
          onClick={() => setAbierta(true)}
          aria-label="Ver imagen en pantalla completa"
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={imagenes[activa].url}
            alt={titulo}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1232px"
          />
        </button>

        {total > 1 && (
          <>
            <button type="button" onClick={anterior} aria-label="Imagen anterior" className={`${flecha} left-3`}>
              ‹
            </button>
            <button type="button" onClick={siguiente} aria-label="Imagen siguiente" className={`${flecha} right-3`}>
              ›
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-ink/80 px-2.5 py-1 text-xs text-white">
          {activa + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {imagenes.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiva(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-sm border-2 sm:h-20 sm:w-28 ${
                index === activa ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>
      )}

      {abierta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setAbierta(false)}
        >
          <div
            className="relative h-[85vh] w-[94vw] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagenes[activa].url}
              alt={titulo}
              fill
              className="object-contain"
              sizes="94vw"
            />
          </div>

          <button
            type="button"
            onClick={() => setAbierta(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ×
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); anterior(); }}
                aria-label="Imagen anterior"
                className={`${flecha} left-3 sm:left-6`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); siguiente(); }}
                aria-label="Imagen siguiente"
                className={`${flecha} right-3 sm:right-6`}
              >
                ›
              </button>
            </>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {activa + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}
