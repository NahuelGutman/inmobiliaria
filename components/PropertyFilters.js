"use client";

import { useState } from "react";

// Filtros reutilizables (inicio y listado). Es un formulario GET:
// al enviarlo navega a /propiedades con los parámetros en la URL.

const OPERACIONES = [
  ["", "Todas"],
  ["venta", "Comprar"],
  ["alquiler", "Alquilar"],
];

const TIPOS = [
  ["casa", "Casa"],
  ["departamento", "Departamento"],
  ["terreno", "Terreno"],
  ["local", "Local"],
];

const FILTROS_ACTIVOS = [
  "operacion",
  "ciudad",
  "tipo",
  "habitaciones",
  "banos",
  "cocheras",
  "precio_max",
];

export default function PropertyFilters({ ciudades = [], values = {} }) {
  const [operacion, setOperacion] = useState(values.operacion || "");
  const [precioMax, setPrecioMax] = useState(values.precio_max || "");
  const [moneda, setMoneda] = useState(
    values.moneda || (values.operacion === "alquiler" ? "ARS" : "USD")
  );
  const [monedaManual, setMonedaManual] = useState(Boolean(values.moneda));

  const hayFiltros = FILTROS_ACTIVOS.some((k) => values[k]);

  // Los alquileres suelen ser en pesos y las ventas en dólares:
  // al cambiar de pestaña sugerimos la moneda, salvo que la haya elegido a mano.
  function elegirOperacion(valor) {
    setOperacion(valor);
    if (!monedaManual) setMoneda(valor === "alquiler" ? "ARS" : "USD");
  }

  return (
    <form
      action="/propiedades"
      method="get"
      className="rounded-sm bg-white text-ink shadow-2xl"
    >
      <div className="flex flex-wrap border-b border-stone text-sm font-semibold">
        {OPERACIONES.map(([valor, texto]) => (
          <label key={texto} className="cursor-pointer">
            <input
              type="radio"
              name={valor ? "operacion" : undefined}
              value={valor}
              checked={operacion === valor}
              onChange={() => elegirOperacion(valor)}
              className="peer sr-only"
            />
            <span className="block border-b-[3px] border-transparent px-5 py-4 text-slate transition peer-checked:border-ink peer-checked:text-ink peer-focus-visible:bg-paper sm:px-7">
              {texto}
            </span>
          </label>
        ))}
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 xl:grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_1.7fr_auto] xl:items-end">
        <div>
          <label htmlFor="f-ciudad" className="label">Ubicación</label>
          <select id="f-ciudad" name="ciudad" defaultValue={values.ciudad || ""} className="input">
            <option value="">Todas las ciudades</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-tipo" className="label">Tipo</label>
          <select id="f-tipo" name="tipo" defaultValue={values.tipo || ""} className="input">
            <option value="">Todos</option>
            {TIPOS.map(([v, t]) => (
              <option key={v} value={v}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-hab" className="label">Habitaciones</label>
          <select id="f-hab" name="habitaciones" defaultValue={values.habitaciones || ""} className="input">
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-banos" className="label">Baños</label>
          <select id="f-banos" name="banos" defaultValue={values.banos || ""} className="input">
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-coch" className="label">Cocheras</label>
          <select id="f-coch" name="cocheras" defaultValue={values.cocheras || ""} className="input">
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-2 xl:col-span-1">
          <label htmlFor="f-precio" className="label">Precio máximo</label>
          <div className="flex gap-2">
            <select
              aria-label="Moneda"
              name={precioMax ? "moneda" : undefined}
              value={moneda}
              onChange={(e) => {
                setMoneda(e.target.value);
                setMonedaManual(true);
              }}
              className="input !w-24 shrink-0"
            >
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
            <input
              id="f-precio"
              name="precio_max"
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="Sin límite"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="input min-w-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-2 xl:col-span-1">
          <button
            type="submit"
            className="h-11 flex-1 rounded-sm bg-ink px-8 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-forestLight xl:flex-none"
          >
            Buscar
          </button>
          {hayFiltros && (
            <a href="/propiedades" className="text-sm text-slate underline">
              Limpiar
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
