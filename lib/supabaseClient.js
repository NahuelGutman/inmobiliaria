import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para usar en componentes de cliente ("use client").
// Usamos createBrowserClient (no el createClient normal de supabase-js) para
// que la sesión se guarde en una cookie y no en localStorage: así el
// middleware y los Server Components pueden leer la misma sesión.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
