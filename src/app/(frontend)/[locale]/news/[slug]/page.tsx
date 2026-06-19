import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";
import React from 'react'

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const articleCategoryLabelsTh: Record<string, string> = {
  news: 'ข่าวสาร',
  'event-recap': 'สรุปผลกิจกรรม',
  'member-story': 'เรื่องราวจากสมาชิก',
  'president-message': 'สาส์นจากนายกสมาคม',
  'partner-announcement': 'ประกาศจากพันธมิตร',
  knowledge: 'บทความความรู้',
}

const articleCategoryLabelsEn: Record<string, string> = {
  news: 'News',
  'event-recap': 'Event Recap',
  'member-story': 'Member Story',
  'president-message': "President's Message",
  'partner-announcement': 'Partner Announcement',
  knowledge: 'Knowledge Article',
}

function formatDate(dateStr: string, locale: string) {
  const code = locale === 'th' ? 'th-TH' : 'en-US'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(code, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'articles',
      limit: 100,
    })
    
    const params: { locale: string; slug: string }[] = []
    for (const locale of ['en', 'th']) {
      for (const article of result.docs) {
        params.push({ locale, slug: article.slug })
      }
    }
    return params;
  } catch (error) {
    console.error("Error generating static params for news [slug]:", error)
    return []
  }
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  const article = result.docs[0];

  if (!article) {
    return { title: locale === 'th' ? "ไม่พบบทความ" : "Article not found" };
  }

  return {
    title: article.title
  };
}

export default async function ArticleDetailPage({
  params
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    locale,
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

  const defaultAuthor = locale === 'th' ? 'ทีมงาน JCI กรุงเทพฯ' : 'JCI Bangkok Team'
  const authorName = article.author && typeof article.author === 'object'
    ? (article.author.email || defaultAuthor)
    : defaultAuthor;

  // Get cover image details if populated
  const coverImage = article.coverImage && typeof article.coverImage === 'object'
    ? article.coverImage
    : null;

  const articleCategoryLabels = locale === 'th' ? articleCategoryLabelsTh : articleCategoryLabelsEn

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
            <p>{locale === 'th' ? 'ผู้เขียน:' : 'Author:'} {authorName}</p>
            <p>{locale === 'th' ? 'เผยแพร่เมื่อ:' : 'Published:'} {formatDate(article.publishDate, locale)}</p>
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
                {locale === 'th' ? 'เนื้อหาที่เกี่ยวข้อง' : 'Related content'}
              </h2>
              <div className="space-y-4">
                {article.relatedEvent && typeof article.relatedEvent === 'object' && (
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      {locale === 'th' ? 'กิจกรรมที่เกี่ยวข้อง' : 'Related Event'}
                    </span>
                    <p className="font-semibold text-[var(--ink)] mt-1">{article.relatedEvent.title}</p>
                    <Link
                      href={`/${locale}/events/${article.relatedEvent.slug}`}
                      className="text-sm font-semibold text-[var(--jci-blue)] hover:underline mt-2 inline-block"
                    >
                      {locale === 'th' ? 'ดูกิจกรรม →' : 'View Event →'}
                    </Link>
                  </div>
                )}
                {article.relatedProject && typeof article.relatedProject === 'object' && (
                  <div className="border-t border-[var(--line)] pt-4">
                    <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
                      {locale === 'th' ? 'โครงการที่เกี่ยวข้อง' : 'Related Project'}
                    </span>
                    <p className="font-semibold text-[var(--ink)] mt-1">{article.relatedProject.title}</p>
                    <Link
                      href={`/${locale}/projects/${article.relatedProject.slug}`}
                      className="text-sm font-semibold text-[var(--jci-blue)] hover:underline mt-2 inline-block"
                    >
                      {locale === 'th' ? 'ดูโครงการ →' : 'View Project →'}
                    </Link>
                  </div>
                )}
              </div>
            </article>
          )}
          
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
              {locale === 'th' ? 'ข่าวสาร JCI กรุงเทพฯ' : 'JCI Bangkok News'}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-6">
              {locale === 'th' 
                ? 'ติดตามข่าวสารและข้อมูลอัปเดตจาก JCI กรุงเทพฯ เพื่อรับข่าวสารเกี่ยวกับกิจกรรมในพื้นที่ การฝึกอบรม และโครงการพัฒนาสังคมของเรา' 
                : 'Subscribe to JCI Bangkok updates to receive notifications about our local initiatives, training sessions, and community projects.'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="button-primary mt-6 text-center block text-sm"
            >
              {locale === 'th' ? 'ติดต่อสอบถาม' : 'Get in Touch'}
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
