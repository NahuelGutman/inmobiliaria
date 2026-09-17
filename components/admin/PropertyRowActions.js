"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PropertyRowActions({ propiedad }) {
  const router = useRouter();
  const [borrando, setBorrando] = useState(false);

  async function handleEliminar() {
    const confirmado = window.confirm(
      `¿Eliminar "${propiedad.titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    setBorrando(true);

    // Borrar primero los archivos de Storage de esta propiedad
    const { data: imagenes } = await supabase
      .from("imagenes_propiedades")
      .select("url")
      .eq("propiedad_id", propiedad.id);

    if (imagenes?.length) {
      const paths = imagenes
        .map((img) => img.url.split("/propiedades/")[1])
        .filter(Boolean);
      if (paths.length) {
        await supabase.storage.from("propiedades").remove(paths);
      }
    }

    // Al borrar la propiedad, imagenes_propiedades se borra en cascada
    const { error } = await supabase
      .from("propiedades")
      .delete()
      .eq("id", propiedad.id);

    setBorrando(false);

    if (error) {
      alert("No se pudo eliminar la propiedad: " + error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex gap-3 text-sm">
      <Link
        href={`/admin/propiedades/${propiedad.id}/editar`}
        className="text-forest hover:underline"
      >
        Editar
      </Link>
      <button
        onClick={handleEliminar}
        disabled={borrando}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        {borrando ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}
