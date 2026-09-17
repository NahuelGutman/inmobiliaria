// Configuración centralizada del sitio.
// Cambiar acá el nombre de la inmobiliaria o el número de WhatsApp
// actualiza automáticamente todo el sitio.

export const siteConfig = {
  nombreInmobiliaria: "Inmobiliaria",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5492954000000",
};

// Genera el link de WhatsApp con el mensaje precargado para una propiedad
export function getWhatsappLink(tituloPropiedad) {
  const mensaje = `Hola, estoy interesado en la propiedad: ${tituloPropiedad}.`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    mensaje
  )}`;
}
