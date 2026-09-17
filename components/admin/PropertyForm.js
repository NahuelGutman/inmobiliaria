"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slugify";

const ESTADOS = ["disponible", "reservada", "vendida", "alquilada"];

// Genera un slug único consultando la base. Si ya existe, agrega -2, -3, etc.
async function generarSlugUnico(titulo, propiedadIdActual) {
  const base = slugify(titulo);
  let slug = base;
  let contador = 2;

  while (true) {
    let query = supabase.from("propiedades").select("id").eq("slug", slug);
    if (propiedadIdActual) {
      query = query.neq("id", propiedadIdActual);
    }
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${contador}`;
    contador++;
  }
}

export default function PropertyForm({ modo, propiedad, imagenesIniciales }) {
  const router = useRouter();
  const esEdicion = modo === "editar";

  const [form, setForm] = useState({
    titulo: propiedad?.titulo || "",
    descripcion: propiedad?.descripcion || "",
    operacion: propiedad?.operacion || "venta",
    tipo: propiedad?.tipo || "casa",
    precio: propiedad?.precio || "",
    moneda: propiedad?.moneda || "ARS",
    consultar_precio: propiedad?.consultar_precio || false,
    ciudad: propiedad?.ciudad || "",
    direccion: propiedad?.direccion || "",
    habitaciones: propiedad?.habitaciones || "",
    banos: propiedad?.banos || "",
    cocheras: propiedad?.cocheras || "",
    superficie_total: propiedad?.superficie_total || "",
    estado: propiedad?.estado || "disponible",
    destacada: propiedad?.destacada || false,
  });

  // Imágenes que ya existían en la propiedad (solo aplica en modo edición)
  const [imagenesExistentes, setImagenesExistentes] = useState(
    imagenesIniciales || []
  );
  // Imágenes nuevas seleccionadas, todavía no subidas
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  // Clave de la imagen marcada como principal: "existente-<id>" o "nueva-<index>"
  const [principal, setPrincipal] = useState(() => {
    const actual = imagenesIniciales?.find((img) => img.es_principal);
    return actual ? `existente-${actual.id}` : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleSeleccionarImagenes(e) {
    const archivos = Array.from(e.target.files || []);
    const nuevas = archivos.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImagenesNuevas((prev) => {
      const actualizado = [...prev, ...nuevas];
      // si todavía no hay principal, la primera imagen nueva pasa a serlo
      if (!principal && imagenesExistentes.length === 0 && actualizado.length > 0) {
        setPrincipal(`nueva-0`);
      }
      return actualizado;
    });
    e.target.value = "";
  }

  function quitarImagenNueva(index) {
    setImagenesNuevas((prev) => prev.filter((_, i) => i !== index));
    if (principal === `nueva-${index}`) setPrincipal(null);
  }

  function marcarImagenExistenteParaBorrar(id) {
    setImagenesExistentes((prev) =>
      prev.map((img) => (img.id === id ? { ...img, _eliminar: true } : img))
    );
    if (principal === `existente-${id}`) setPrincipal(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim() || !form.ciudad.trim()) {
      setError("Título y ciudad son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const datosPropiedad = {
        titulo: form.titulo,
        descripcion: form.descripcion || null,
        operacion: form.operacion,
        tipo: form.tipo,
        precio: form.consultar_precio ? null : Number(form.precio) || null,
        moneda: form.moneda,
        consultar_precio: form.consultar_precio,
        ciudad: form.ciudad,
        direccion: form.direccion || null,
        habitaciones: form.habitaciones ? Number(form.habitaciones) : null,
        banos: form.banos ? Number(form.banos) : null,
        cocheras: form.cocheras ? Number(form.cocheras) : null,
        superficie_total: form.superficie_total
          ? Number(form.superficie_total)
          : null,
        estado: form.estado,
        destacada: form.destacada,
      };

      let propiedadId = propiedad?.id;

      if (esEdicion) {
        // Si cambió el título, regeneramos el slug para mantenerlo prolijo
        if (form.titulo !== propiedad.titulo) {
          datosPropiedad.slug = await generarSlugUnico(form.titulo, propiedadId);
        }
        const { error: updateError } = await supabase
          .from("propiedades")
          .update(datosPropiedad)
          .eq("id", propiedadId);
        if (updateError) throw updateError;
      } else {
        datosPropiedad.slug = await generarSlugUnico(form.titulo, null);
        const { data: nueva, error: insertError } = await supabase
          .from("propiedades")
          .insert(datosPropiedad)
          .select("id")
          .single();
        if (insertError) throw insertError;
        propiedadId = nueva.id;
      }

      // Borrar imágenes marcadas para eliminar (storage + tabla)
      const aEliminar = imagenesExistentes.filter((img) => img._eliminar);
      for (const img of aEliminar) {
        const path = img.url.split("/propiedades/")[1];
        if (path) {
          await supabase.storage.from("propiedades").remove([path]);
        }
        await supabase.from("imagenes_propiedades").delete().eq("id", img.id);
      }

      // Subir imágenes nuevas
      const imagenesSubidas = [];
      for (let i = 0; i < imagenesNuevas.length; i++) {
        const { file } = imagenesNuevas[i];
        const extension = file.name.split(".").pop();
        const path = `${propiedadId}/${Date.now()}-${i}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("propiedades")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("propiedades").getPublicUrl(path);

        imagenesSubidas.push({ url: publicUrl, key: `nueva-${i}` });
      }

      if (imagenesSubidas.length > 0) {
        const { data: insertadas, error: insertImgError } = await supabase
          .from("imagenes_propiedades")
          .insert(
            imagenesSubidas.map((img, i) => ({
              propiedad_id: propiedadId,
              url: img.url,
              orden: i,
              es_principal: false,
            }))
          )
          .select("id, url");
        if (insertImgError) throw insertImgError;

        insertadas.forEach((row, i) => {
          imagenesSubidas[i].id = row.id;
        });
      }

      // Resolver cuál queda como imagen principal
      let idPrincipal = null;
      if (principal?.startsWith("existente-")) {
        idPrincipal = principal.replace("existente-", "");
      } else if (principal?.startsWith("nueva-")) {
        const index = Number(principal.replace("nueva-", ""));
        idPrincipal = imagenesSubidas[index]?.id || null;
      }

      if (idPrincipal) {
        await supabase
          .from("imagenes_propiedades")
          .update({ es_principal: false })
          .eq("propiedad_id", propiedadId);
        await supabase
          .from("imagenes_propiedades")
          .update({ es_principal: true })
          .eq("id", idPrincipal);
      }

      router.push("/admin/propiedades");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error al guardar la propiedad.");
      setLoading(false);
    }
  }

  const imagenesVisibles = imagenesExistentes.filter((img) => !img._eliminar);

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-10">
      {error && (
        <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Información */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">Información</legend>

        <Campo label="Título">
          <input
            type="text"
            required
            value={form.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
            className={inputClass}
          />
        </Campo>

        <Campo label="Descripción">
          <textarea
            rows={4}
            value={form.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            className={inputClass}
          />
        </Campo>

        <div className="grid grid-cols-2 gap-4">
          <Campo label="Tipo de operación">
            <select
              value={form.operacion}
              onChange={(e) => handleChange("operacion", e.target.value)}
              className={inputClass}
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </Campo>

          <Campo label="Tipo de propiedad">
            <select
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
              className={inputClass}
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="local">Local</option>
            </select>
          </Campo>
        </div>
      </fieldset>

      {/* Precio */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">Precio</legend>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.consultar_precio}
            onChange={(e) =>
              handleChange("consultar_precio", e.target.checked)
            }
          />
          Consultar precio (no mostrar un monto)
        </label>

        {!form.consultar_precio && (
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Precio">
              <input
                type="number"
                min="0"
                value={form.precio}
                onChange={(e) => handleChange("precio", e.target.value)}
                className={inputClass}
              />
            </Campo>
            <Campo label="Moneda">
              <select
                value={form.moneda}
                onChange={(e) => handleChange("moneda", e.target.value)}
                className={inputClass}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </Campo>
          </div>
        )}
      </fieldset>

      {/* Ubicación */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">Ubicación</legend>
        <Campo label="Ciudad">
          <input
            type="text"
            required
            value={form.ciudad}
            onChange={(e) => handleChange("ciudad", e.target.value)}
            className={inputClass}
          />
        </Campo>
        <Campo label="Dirección">
          <input
            type="text"
            value={form.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            className={inputClass}
          />
        </Campo>
      </fieldset>

      {/* Características */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">
          Características
        </legend>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Campo label="Habitaciones">
            <input
              type="number"
              min="0"
              value={form.habitaciones}
              onChange={(e) => handleChange("habitaciones", e.target.value)}
              className={inputClass}
            />
          </Campo>
          <Campo label="Baños">
            <input
              type="number"
              min="0"
              value={form.banos}
              onChange={(e) => handleChange("banos", e.target.value)}
              className={inputClass}
            />
          </Campo>
          <Campo label="Cocheras">
            <input
              type="number"
              min="0"
              value={form.cocheras}
              onChange={(e) => handleChange("cocheras", e.target.value)}
              className={inputClass}
            />
          </Campo>
          <Campo label="Superficie total (m²)">
            <input
              type="number"
              min="0"
              value={form.superficie_total}
              onChange={(e) =>
                handleChange("superficie_total", e.target.value)
              }
              className={inputClass}
            />
          </Campo>
        </div>
      </fieldset>

      {/* Estado y destacada */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">
          Estado y visibilidad
        </legend>
        <Campo label="Estado">
          <select
            value={form.estado}
            onChange={(e) => handleChange("estado", e.target.value)}
            className={inputClass}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </Campo>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.destacada}
            onChange={(e) => handleChange("destacada", e.target.checked)}
          />
          Destacada (aparece en la home)
        </label>
      </fieldset>

      {/* Imágenes */}
      <fieldset className="space-y-4">
        <legend className="font-display text-lg text-ink">Imágenes</legend>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSeleccionarImagenes}
          className="text-sm"
        />

        {(imagenesVisibles.length > 0 || imagenesNuevas.length > 0) && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {imagenesVisibles.map((img) => (
              <ImagenPreview
                key={`existente-${img.id}`}
                src={img.url}
                esPrincipal={principal === `existente-${img.id}`}
                onElegirPrincipal={() => setPrincipal(`existente-${img.id}`)}
                onEliminar={() => marcarImagenExistenteParaBorrar(img.id)}
              />
            ))}
            {imagenesNuevas.map((img, index) => (
              <ImagenPreview
                key={`nueva-${index}`}
                src={img.previewUrl}
                esPrincipal={principal === `nueva-${index}`}
                onElegirPrincipal={() => setPrincipal(`nueva-${index}`)}
                onEliminar={() => quitarImagenNueva(index)}
              />
            ))}
          </div>
        )}
      </fieldset>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-forest px-6 py-2.5 text-sm text-paper hover:bg-forestLight disabled:opacity-60"
        >
          {loading
            ? "Guardando..."
            : esEdicion
            ? "Guardar cambios"
            : "Crear propiedad"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-sm border border-stone bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-forest";

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate">{label}</span>
      {children}
    </label>
  );
}

function ImagenPreview({ src, esPrincipal, onElegirPrincipal, onEliminar }) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-stone">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-32 w-full object-cover" />
      <div className="flex items-center justify-between gap-1 bg-white p-1.5 text-xs">
        <button
          type="button"
          onClick={onElegirPrincipal}
          className={esPrincipal ? "font-semibold text-forest" : "text-slate"}
        >
          {esPrincipal ? "★ Principal" : "Elegir principal"}
        </button>
        <button
          type="button"
          onClick={onEliminar}
          className="text-red-600 hover:underline"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}
