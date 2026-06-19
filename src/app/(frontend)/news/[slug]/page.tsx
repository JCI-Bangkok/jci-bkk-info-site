import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    limit: 100,
  })
  return result.docs.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const article = result.docs[0];

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
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const article = result.docs[0];

  if (!article) {
    notFound();
  }

  const authorName = article.author && typeof article.author === 'object'
    ? (article.author.email || 'JCI Bangkok Team')
    : 'JCI Bangkok Team';

  // Get cover image details if populated
  const coverImage = article.coverImage && typeof article.coverImage === 'object'
    ? article.coverImage
    : null;

  return (
    <>
      <PageIntro
        title={article.title}
        lead={article.summary}
        aside={
          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--jci-blue)]">
              {articleCategoryLabels[article.category] || article.category}
            </p>
            <p>Author: {authorName}</p>
            <p>Published: {formatDate(article.publishDate)}</p>
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          {coverImage && coverImage.url && (
            <div className="relative w-full h-[28rem] rounded-[2rem] overflow-hidden border border-[var(--line)]">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
          <article className="paper-frame p-7">
            <RichText content={article.body} />
          </article>
        </div>
        
        <div className="space-y-5">
          {((article.relatedEvent && typeof article.relatedEvent === 'object') || 
            (article.relatedProject && typeof article.relatedProject === 'object')) && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
                Related content
              </h2>
              <div className="space-y-4">
                {article.relatedEvent && typeof article.relatedEvent === 'object' && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Related Event</span>
                    <p className="font-semibold text-[var(--ink)] mt-1">{article.relatedEvent.title}</p>
                    <Link
                      href={`/events/${article.relatedEvent.slug}`}
                      className="text-sm font-semibold text-[var(--jci-blue)] hover:underline mt-2 inline-block"
                    >
                      View Event &rarr;
                    </Link>
                  </div>
                )}
                {article.relatedProject && typeof article.relatedProject === 'object' && (
                  <div className="border-t border-[var(--line)] pt-4">
                    <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Related Project</span>
                    <p className="font-semibold text-[var(--ink)] mt-1">{article.relatedProject.title}</p>
                    <Link
                      href={`/projects/${article.relatedProject.slug}`}
                      className="text-sm font-semibold text-[var(--jci-blue)] hover:underline mt-2 inline-block"
                    >
                      View Project &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </article>
          )}
          
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
              JCI Bangkok News
            </h2>
            <p className="text-sm text-[var(--muted)] leading-6">
              Subscribe to JCI Bangkok updates to receive notifications about our local initiatives, training sessions, and community projects.
            </p>
            <Link
              href="/contact"
              className="button-primary mt-6 text-center block text-sm"
            >
              Get in Touch
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}

