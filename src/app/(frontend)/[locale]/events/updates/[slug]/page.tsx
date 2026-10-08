import { contentMetadata } from '@/lib/cms-seo'
import { mediaUrl } from '@/lib/media'
import { publishedArticles, getPublicContent } from '@/lib/public-content'
import { absoluteUrl } from '@/lib/seo'
import { notFound } from "next/navigation";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import React from 'react'

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const articleCategoryLabelsTh: Record<string, string> = {
  news: 'ข่าวสาร',
  'event-recap': 'สรุปกิจกรรม',
  'member-story': 'เรื่องราวสมาชิก',
  'president-message': 'สาส์นจากนายกสมาคม',
  'partner-announcement': 'ประกาศพันธมิตร',
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

import { formatBangkokDate } from '@/lib/calendar-date'

function formatDate(dateStr: string, locale: string) {
  return formatBangkokDate(dateStr, locale)
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'articles',
      where: publishedArticles(),
      pagination: false,
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
  const article = await getPublicContent('articles', locale, slug) as any;

  if (!article) notFound();

  return contentMetadata(locale, `/events/updates/${encodeURIComponent(slug)}`, article, { title: article.title, description: article.summary, image: mediaUrl(article.coverImage) }, { publishedTime: article.publishDate, modifiedTime: article.updatedAt });
}

export default async function ArticleDetailPage({
  params
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  const article = await getPublicContent('articles', locale, slug) as any;

  if (!article) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise });
  const templates = await payload.find({
    collection: "templates",
    where: {
      type: {
        equals: "news-single",
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  });
  const template = templates.docs[0];

  if (template && template.puckLayout) {
    const { PuckRenderer } = await import('@/components/builder/PuckRenderer');
    return <PuckRenderer data={template.puckLayout as any} documentData={{...article, currentLocale: locale}} />;
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 text-gray-400">
      <p>No template configured. Please publish a News Article Template in the FSE Visual Builder.</p>
    </div>
  );
}

export const revalidate = 300
