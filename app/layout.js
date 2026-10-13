import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: `${siteConfig.nombreInmobiliaria} | Propiedades en venta y alquiler`,
  description:
    "Encontrá casas, departamentos, terrenos y locales en venta y alquiler.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${archivo.variable} ${manrope.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
