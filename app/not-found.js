import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <p className="font-display text-4xl text-forest">404</p>
      <h1 className="mt-2 font-display text-xl text-ink">
        No encontramos esta página
      </h1>
      <Link
        href="/"
        className="mt-6 inline-block rounded-sm bg-forest px-6 py-2.5 text-sm text-paper hover:bg-forestLight"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
