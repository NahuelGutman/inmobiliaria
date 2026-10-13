// Helpers de formato compartidos por el sitio y el panel admin.

export function formatearPrecio(propiedad) {
  if (propiedad.consultar_precio || !propiedad.precio) return "Consultar precio";
  const monto = Number(propiedad.precio).toLocaleString("es-AR");
  return propiedad.moneda === "USD" ? `USD ${monto}` : `$ ${monto}`;
}

export function caracteristicas(p) {
  return [
    p.habitaciones != null && `${p.habitaciones} hab`,
    p.banos != null && `${p.banos} baños`,
    p.cocheras != null && `${p.cocheras} coch`,
    p.superficie_total != null && `${p.superficie_total} m²`,
  ].filter(Boolean);
}
