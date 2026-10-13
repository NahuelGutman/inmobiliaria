import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Layout del sitio público (inicio, listado y detalle).
// El panel /admin tiene su propio layout y no usa esta barra ni este footer.
export default function SitioLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
