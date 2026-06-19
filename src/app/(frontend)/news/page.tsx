import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export const metadata = {
  title: "News"
};

const articleCategoryLabels: Record<string, string> = {
  news: 'News',
  'event-recap': 'Event Recap',
  'member-story': 'Member Story',
  'president-message': "President's Message",
  'partner-announcement': 'Partner Announcement',
  knowledge: 'Knowledge Article',
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default async function NewsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    limit: 100,
    sort: '-publishDate',
  })
  
  const articles = result.docs;

  return (
    <>
      <PageIntro
        title="News, recaps, and chapter perspective."
        lead="This section is designed to support SEO, credibility, and a more human public voice through stories, updates, and useful perspective."
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => {
            const authorName = article.author && typeof article.author === 'object'
              ? (article.author.email || 'JCI Bangkok Team')
              : 'JCI Bangkok Team';
              
            return (
              <article key={article.slug} className="paper-frame p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    {articleCategoryLabels[article.category] || article.category}
                  </p>
                  <h2 className="mt-5 font-display text-4xl leading-none text-[var(--ink)]">
                    {article.title}
                  </h2>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)] line-clamp-3">
                    {article.summary}
                  </p>
                </div>
                <div>
                  <div className="mt-6 flex items-center justify-between text-sm text-[var(--muted)] border-t border-[var(--line)] pt-4">
                    <span>{authorName}</span>
                    <span>{formatDate(article.publishDate)}</span>
                  </div>
                  <Link
                    href={`/news/${article.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--jci-blue)] hover:underline"
                  >
                    Read article &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

