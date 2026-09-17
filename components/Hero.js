import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-stone bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-body text-sm uppercase tracking-widest text-brass">
            Venta y alquiler de propiedades
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
            Encontrá el lugar donde empieza tu próxima etapa
          </h1>
          <p className="mt-5 max-w-md font-body text-slate">
            Casas, departamentos, terrenos y locales seleccionados, con
            acompañamiento personalizado en cada paso.
          </p>
          <Link
            href="/propiedades"
            className="mt-8 inline-block rounded-sm bg-forest px-7 py-3 font-body text-sm text-paper transition hover:bg-forestLight"
          >
            Ver propiedades
          </Link>
        </div>

                <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-64 w-full rounded-sm object-cover md:h-80"
        />
      </div>
    </section>
  );
}
