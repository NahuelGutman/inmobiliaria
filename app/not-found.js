import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-extrabold text-ink">404</p>
      <h1 className="mt-2 font-display text-xl font-bold text-ink">
        No encontramos esta página
      </h1>
      <Link href="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
