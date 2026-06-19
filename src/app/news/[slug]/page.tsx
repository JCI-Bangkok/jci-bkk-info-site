import { notFound } from "next/navigation";

import { PageIntro } from "@/components/page-intro";
import { articles, getArticle } from "@/lib/site-data";

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title
  };
}

export default async function ArticleDetailPage({
  params
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <PageIntro
        title={article.title}
        lead={article.summary}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>{article.category}</p>
            <p>{article.author}</p>
            <p>{article.publishedAt}</p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Draft article structure
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            This template is ready to receive CMS-managed rich text, related
            event or project links, SEO metadata, author profiles, and shareable
            recap visuals.
          </p>
        </article>
        <article className="paper-frame p-7">
          <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
            Suggested content blocks
          </h2>
          <ul className="mt-6 space-y-3 text-base leading-7 text-[var(--muted)]">
            <li>Headline, summary, and featured image</li>
            <li>Rich text body with quote pullouts</li>
            <li>Related event or project reference</li>
            <li>SEO title and meta description</li>
          </ul>
        </article>
      </section>
    </>
  );
}
