import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { articles } from "@/lib/site-data";

export const metadata = {
  title: "News"
};

export default function NewsPage() {
  return (
    <>
      <PageIntro
        title="News, recaps, and chapter perspective."
        lead="This section is designed to support SEO, credibility, and a more human public voice through stories, updates, and useful perspective."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="paper-frame p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {article.category}
              </p>
              <h2 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                {article.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                {article.summary}
              </p>
              <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{article.author}</span>
                <span>{article.publishedAt}</span>
              </div>
              <Link
                href={`/news/${article.slug}`}
                className="mt-6 inline-flex text-sm font-semibold text-[var(--ink)]"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
