import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.26em] text-[var(--muted)]">404</p>
      <h1 className="mt-4 font-display text-6xl leading-none text-[var(--ink)]">
        This page is not here yet.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)]">
        The structure is ready to grow, but this route does not currently map to
        published content.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white"
      >
        Return home
      </Link>
    </section>
  );
}
