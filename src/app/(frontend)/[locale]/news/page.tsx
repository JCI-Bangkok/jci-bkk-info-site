import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { PageIntro } from "@/components/page-intro";
import React from 'react'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'th' ? 'ข่าวสารและบทความ' : 'News'
  };
}

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

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'articles',
    locale,
    limit: 100,
    sort: '-publishDate',
  })
  
  const articles = result.docs;
  const articleCategoryLabels = locale === 'th' ? articleCategoryLabelsTh : articleCategoryLabelsEn

  return (
    <>
      <PageIntro
        title={locale === 'th' ? 'ข่าวสาร สรุปโครงการ และความคิดเห็นสมาคม' : 'News, recaps, and chapter perspective.'}
        lead={locale === 'th' ? 'ส่วนนี้ออกแบบมาเพื่อรองรับด้าน SEO ความน่าเชื่อถือ และเสียงสะท้อนความเป็นมนุษย์ผ่านเรื่องราว ข้อมูลอัปเดต และมุมมองที่มีประโยชน์' : 'This section is designed to support SEO, credibility, and a more human public voice through stories, updates, and useful perspective.'}
      />
      <section className="section-space mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => {
            const defaultAuthor = locale === 'th' ? 'ทีมงาน JCI กรุงเทพฯ' : 'JCI Bangkok Team'
            const authorName = article.author && typeof article.author === 'object'
              ? (article.author.email || defaultAuthor)
              : defaultAuthor;
              
            return (
              <article key={article.slug} className="paper-frame p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
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
                    <span>{formatDate(article.publishDate, locale)}</span>
                  </div>
                  <Link
                    href={`/${locale}/news/${article.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--jci-blue)] hover:underline"
                  >
                    {locale === 'th' ? 'อ่านบทความเพิ่มเติม →' : 'Read article →'}
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
