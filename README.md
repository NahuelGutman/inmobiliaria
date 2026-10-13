# Inmobiliaria

Sitio de venta y alquiler de propiedades (Next.js 14 + Tailwind + Supabase).

## Cómo correrlo localmente

1. `npm install`
2. Copiar `.env.local.example` a `.env.local` y completar con tus datos de Supabase
   (o copiar tu `.env.local` actual).
3. `npm run dev`
4. Abrir http://localhost:3000

El panel de administración está en `/admin`.

## Video del inicio

El video de fondo del hero es `public/hero.mp4`. Para cambiarlo, reemplazá ese
archivo por el nuevo (idealmente un loop de 10–20 segundos, liviano, sin audio).

## Filtros

El inicio y `/propiedades` comparten los mismos filtros (`components/PropertyFilters.js`):
operación, ubicación, tipo, habitaciones, baños, cocheras y precio máximo.
El precio máximo se compara siempre dentro de la moneda elegida (USD o ARS).
