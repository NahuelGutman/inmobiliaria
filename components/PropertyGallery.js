"use client";

import { useState } from "react";
import Image from "next/image";

export default function PropertyGallery({ imagenes, titulo }) {
  const [activa, setActiva] = useState(0);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-sm border border-stone bg-stone/40 text-sm text-slate">
        Sin imágenes
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-sm border border-stone md:h-[420px]">
        <Image
          src={imagenes[activa].url}
          alt={titulo}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      {imagenes.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {imagenes.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiva(index)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-sm border ${
                index === activa ? "border-forest" : "border-stone"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
