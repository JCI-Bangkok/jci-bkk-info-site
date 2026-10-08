"use client";

import React from "react";
import Image from "next/image";
import { EventHeader } from '@/components/builder/EventHeader';
import { useDocumentData } from "@/components/builder/DocumentContext";
import { mediaUrl } from "@/lib/media";
import { PaginatedGrid } from "@/components/paginated-grid";
import { EventCalendar } from "@/components/event-calendar";
import { getDictionary } from "@/lib/i18n";
import { ContactForm } from '@/app/(frontend)/[locale]/contact/contact-form';

function formatBangkokTime(dateString: string, locale: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const formattedDate = date.toLocaleDateString(
    locale === "th" ? "th-TH" : "en-US",
    {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: locale === "th" ? "short" : "long",
      day: "numeric",
    }
  );

  const timePart = date.toISOString().substring(11, 16);
  if (timePart === "00:00") return formattedDate;

  const timeString = date.toLocaleTimeString(
    locale === "th" ? "th-TH" : "en-US",
    {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale !== "th",
    }
  );

  return `${formattedDate} • ${timeString}`;
}

function hasSpecificBangkokTime(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const timePart = date.toISOString().substring(11, 16);
  return timePart !== "00:00";
}

export function DynamicEventHeader() {
  const data = useDocumentData();
  if (!data?.title) return <div className="p-8 text-center bg-gray-100">[Event Header Placeholder]</div>;
  return <EventHeader event={data} locale={data.currentLocale || 'en'} />;
}

export function DynamicEventGallery() {
  const data = useDocumentData();
  if (!data || !data.title) {
    return <div className="p-8 text-center bg-gray-100">[Event Gallery Placeholder]</div>;
  }
  const event = data;
  const locale = data.currentLocale || 'en';

  return (
    <>
      {event.secondaryPosters && event.secondaryPosters.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pt-4 pb-2 lg:px-8">
            <article className="paper-frame p-5 sm:p-7">
              <h2 className="font-display text-2xl leading-tight text-[var(--ink)] mb-5">
                {locale === 'th' ? 'โปสเตอร์เพิ่มเติม' : 'Additional Posters'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.secondaryPosters.map((image: { alt?: string }, idx: number) => {
              const url = mediaUrl(image);
              if (!url) return null;
              return (
                <div key={idx} className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[var(--line)] shadow-lg group bg-[var(--paper-soft)]">
                  <Image src={url} alt={image.alt || event.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              );
            })}
          </div>
          </article>
        </section>
      )}

      {event.eventPhotos && event.eventPhotos.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 lg:px-8 lg:pb-24">
          <article className="paper-frame p-7">
            <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-6">
              {locale === 'th' ? 'ภาพบรรยากาศ' : 'Event Gallery'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.eventPhotos.map((image: { alt?: string }, idx: number) => {
                const url = mediaUrl(image);
                if (!url) return null;
                return (
                  <div key={idx} className="relative aspect-square w-full rounded-xl overflow-hidden border border-[var(--line)] shadow-sm group bg-[var(--paper-soft)]">
                    <Image src={url} alt={image.alt || event.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      )}
    </>
  );
}

import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { RichText } from "@/components/rich-text";

const categoryLabelsTh: Record<string, string> = {
  community: 'พัฒนาชุมชน',
  youth: 'พัฒนาเยาวชน',
  sustainability: 'ความยั่งยืน',
  entrepreneurship: 'ผู้ประกอบการ',
  international: 'ความร่วมมือระหว่างประเทศ',
}

const categoryLabelsEn: Record<string, string> = {
  community: 'Community Impact',
  youth: 'Youth Development',
  sustainability: 'Sustainability',
  entrepreneurship: 'Entrepreneurship',
  international: 'International Cooperation',
}

export function DynamicProjectHeader() {
  const data = useDocumentData();
  if (!data || !data.title) return <div className="p-8 text-center bg-gray-100">[Project Header Placeholder]</div>;
  
  const project = data;
  const locale = data.currentLocale || 'en';
  const categoryLabels = locale === 'th' ? categoryLabelsTh : categoryLabelsEn;

  return (
    <PageIntro
      title={project.title}
      lead={project.problemStatement}
      aside={
        <div className="space-y-3 text-sm text-[var(--muted)]">
          <p className="font-semibold text-[var(--jci-blue)]">
            {categoryLabels[project.category] || project.category}
          </p>
          <p>{locale === 'th' ? 'ปีที่ดำเนินโครงการ:' : 'Project Year:'} {project.year}</p>
        </div>
      }
    />
  );
}

export function DynamicProjectImpact() {
  const data = useDocumentData();
  if (!data || !data.title) return <div className="p-8 text-center bg-gray-100">[Project Impact Placeholder]</div>;
  
  const project = data;
  const locale = data.currentLocale || 'en';

  return (
    <div className="space-y-5">
      <article className="paper-frame p-7 bg-[var(--jci-blue)] text-white border-none">
        <h2 className="font-display text-3xl leading-none mb-6">
          {locale === 'th' ? 'ผลลัพธ์ที่ได้' : 'Project Impact'}
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2">
              {locale === 'th' ? 'กลุ่มผู้ได้รับประโยชน์' : 'Beneficiaries'}
            </p>
            <p className="text-lg font-medium">{project.targetBeneficiaries}</p>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-2">
              {locale === 'th' ? 'ผลกระทบเชิงบวก' : 'Key Impact'}
            </p>
            <div className="[&_*]:!text-white"><RichText content={project.outcomes} /></div>
          </div>
        </div>
      </article>
      
      <article className="paper-frame p-7">
        <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
          {locale === 'th' ? 'ร่วมสร้างสรรค์กับเรา' : 'Build with us'}
        </h2>
        <p className="text-sm text-[var(--muted)] leading-6">
          {locale === 'th' 
            ? 'สนใจร่วมเป็นส่วนหนึ่งหรือเป็นพันธมิตรในโครงการพัฒนาสังคมและพัฒนาเยาวชนกับ JCI Bangkok ติดต่อเราเพื่อพูดคุยถึงโอกาสในการร่วมงาน' 
            : 'Interested in partnering with JCI Bangkok on community impact or youth development projects? Get in touch to discuss collaboration opportunities.'}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="button-primary mt-6 text-center block text-sm"
        >
          {locale === 'th' ? 'เป็นพันธมิตรกับเรา' : 'Partner with us'}
        </Link>
      </article>
    </div>
  );
}

export function DynamicBoardMembers() {
  const data = useDocumentData();
  if (!data || !data.members) {
    return <div className="p-8 text-center bg-gray-100">[Board Members Directory Placeholder]</div>;
  }
  const { year, members, regularMembers, presidentName, metadata } = data;
  const locale = data.currentLocale || 'en';

  return (
    <>
      <PageIntro
        title={locale === 'th' ? `คณะกรรมการบริหารปี ${year}` : `${year} board of directors`}
        lead={metadata?.summary || ''}
        aside={
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              {locale === 'th' ? 'ธีมประจำปี' : 'Annual theme'}
            </p>
            <p className="font-display text-3xl leading-none text-[var(--ink)]">
              {metadata?.theme || ''}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {locale === 'th' ? 'นายกสมาคม:' : 'Local President:'} {presidentName}
            </p>
          </div>
        }
      />
      <section className="mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {(members || []).map((member: any) => (
            <li
              key={member.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white transition-shadow hover:shadow-[0_18px_45px_rgba(19,15,45,0.06)]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--paper-soft)]">
                {member.photo && typeof member.photo === 'object' && member.photo.url ? (
                  <Image
                    src={mediaUrl(member.photo) || member.photo.url}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-display text-[var(--muted)] opacity-20">
                    JCI
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl leading-none text-[var(--ink)]">
                  {member.name}
                </h3>
                <p className="mt-2 font-medium text-[var(--jci-blue)]">
                  {member.position}
                </p>
                
                {(member.companyRole || member.yearJoined) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {member.companyRole && <span>{member.companyRole}</span>}
                    {member.companyRole && member.yearJoined && <span>&bull;</span>}
                    {member.yearJoined && <span>Joined {member.yearJoined}</span>}
                  </div>
                )}

                <div className="mt-4 flex flex-1 flex-col">
                  {member.bio && (
                    <div className="relative mt-4 text-sm leading-6 text-[var(--ink-soft)] italic before:content-['\x22'] before:absolute before:-left-3 before:-top-2 before:text-3xl before:text-[var(--jci-blue)] before:opacity-30 ml-3">
                      <RichText content={member.bio} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {regularMembers && regularMembers.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 lg:px-8 lg:pb-32 border-t border-[var(--line)] pt-24 mt-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[var(--ink)]">
              {locale === 'th' ? 'ทำเนียบสมาชิก JCI Bangkok' : 'JCI Bangkok Member Directory'}
            </h2>
            <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto">
              {locale === 'th' ? 'เหล่าสมาชิกผู้ขับเคลื่อนองค์กรและสร้างพลังการเปลี่ยนแปลง' : 'The active members driving our chapter and creating positive change.'}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {regularMembers.map((member: any) => (
              <li key={member.id} className="flex flex-col items-center group text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[var(--paper-soft)] relative mb-4">
                  {member.photo && typeof member.photo === 'object' && member.photo.url ? (
                    <Image 
                      src={mediaUrl(member.photo) || member.photo.url} 
                      alt={member.name} 
                      fill 
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-display text-[var(--muted)] opacity-20">
                      JCI
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-[var(--ink)] text-sm sm:text-base">{member.name}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">{member.companyRole || (locale === 'th' ? 'สมาชิกทั่วไป' : 'Active Member')}</p>
                {member.yearJoined && (
                  <p className="text-[10px] uppercase tracking-wider text-[var(--jci-blue)] font-bold mt-2">Joined {member.yearJoined}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

const articleCategoryLabelsTh: Record<string, string> = {
  general: 'ทั่วไป',
  announcement: 'ประกาศ',
  event: 'ข่าวกิจกรรม',
  project: 'โครงการ',
  editorial: 'บทความพิเศษ',
  training: 'การฝึกอบรม',
  international: 'กิจกรรมสากล',
};

const articleCategoryLabelsEn: Record<string, string> = {
  general: 'General',
  announcement: 'Announcement',
  event: 'Event',
  project: 'Project',
  editorial: 'Editorial',
  training: 'Training',
  international: 'International',
};

export function DynamicArticleLayout() {
  const article = useDocumentData();
  if (!article || !article.title) return <div className="p-8 text-center bg-gray-100">[Article Layout Placeholder]</div>;

  const locale = article.currentLocale || 'en';
  const defaultAuthor = locale === 'th' ? 'ทีมงาน JCI Bangkok' : 'JCI Bangkok Team';
  const authorName = article.authorDisplayName || defaultAuthor;
  const coverImage = article.coverImage && typeof article.coverImage === 'object' ? article.coverImage : null;
  const articleCategoryLabels = locale === 'th' ? articleCategoryLabelsTh : articleCategoryLabelsEn;

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
            {article.publishDate && (
              <p>{locale === 'th' ? 'เผยแพร่เมื่อ:' : 'Published:'} {formatBangkokTime(article.publishDate, locale).split(' • ')[0]}</p>
            )}
          </div>
        }
      />
      <section className="section-space mx-auto grid w-full max-w-7xl gap-5 px-5 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          {coverImage && coverImage.url && (
            <div className="relative w-full h-[28rem] rounded-[2rem] overflow-hidden border border-[var(--line)]">
              <Image
                src={mediaUrl(coverImage)!}
                alt={coverImage.alt || article.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
          {((article.relatedEvent && typeof article.relatedEvent === 'object' && article.relatedEvent.status !== 'draft') ||
            (article.relatedProject && typeof article.relatedProject === 'object')) && (
            <article className="paper-frame p-7">
              <h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-4">
                {locale === 'th' ? 'เนื้อหาที่เกี่ยวข้อง' : 'Related content'}
              </h2>
              <div className="space-y-4">
                {article.relatedEvent && typeof article.relatedEvent === 'object' && article.relatedEvent.status !== 'draft' && (
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
                      href={`/${locale}/events/projects/${article.relatedProject.slug}`}
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
              {locale === 'th' ? 'ข่าวสาร JCI Bangkok' : 'JCI Bangkok News'}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-6">
              {locale === 'th'
                ? 'ติดตามข่าวสารและข้อมูลอัปเดตจาก JCI Bangkok เพื่อรับข่าวสารเกี่ยวกับกิจกรรมในพื้นที่ การฝึกอบรม และโครงการพัฒนาสังคมของเรา'
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

export function DynamicEventsList() {
  const data = useDocumentData();
  const locale = data?.currentLocale || 'en';
  const dict = getDictionary(locale);
  const activities = data?.activities || [];
  const today = data?.today || new Date().toISOString().substring(0, 10);

  const groups = [
    { id: 'upcoming', title: dict.events.upcoming, items: activities.filter((item: any) => item.upcoming) },
    { id: 'past', title: locale === 'th' ? 'กิจกรรมและโครงการที่ผ่านมา' : 'Past Events & Projects', items: activities.filter((item: any) => !item.upcoming && item.kind !== 'update').sort((a: any, b: any) => (b.date || String(b.year)).localeCompare(a.date || String(a.year))) },
    { id: 'updates', title: locale === 'th' ? 'ข่าวสารเพิ่มเติม' : 'Chapter Updates', items: activities.filter((item: any) => item.kind === 'update') },
  ];

  return (
    <div className="w-full">
      <section id="calendar" className="mx-auto max-w-7xl scroll-mt-40 px-5 py-10 lg:px-8">
        <h2 className="mb-5 text-2xl font-semibold">{locale === 'th' ? 'ปฏิทินกิจกรรม' : 'Event Calendar'}</h2>
        <EventCalendar events={activities.filter((item: any) => item.kind === 'event')} locale={locale} today={today} />
      </section>
      {groups.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-40 border-t border-[var(--line)]">
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <h2 className="mb-5 text-2xl font-semibold">{group.title}</h2>
            <PaginatedGrid items={group.items} locale={locale} itemsPerPage={6} />
            {group.items.length > 6 && (
              <details className="mt-6 rounded-xl border border-[var(--line)] p-5">
                <summary className="cursor-pointer font-semibold">{locale === 'th' ? 'ดูรายการทั้งหมด' : 'Browse the full archive'}</summary>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.items.map((item: any) => (
                    <li key={item.id}><Link href={item.href} className="text-[var(--jci-blue)] hover:underline">{item.title}</Link></li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function DynamicProjectsList() {
  const data = useDocumentData();
  const locale = data?.currentLocale || 'en';
  const projects = (data?.activities || []).filter((item: any) => item.kind === 'project');
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
      <h2 className="mb-5 text-2xl font-semibold">{locale === 'th' ? 'โครงการของเรา' : 'Our Projects'}</h2>
      <PaginatedGrid items={projects} locale={locale} itemsPerPage={6} />
    </section>
  );
}

export function DynamicMemberGrid() {
  const data = useDocumentData();
  const locale = data?.currentLocale || 'en';
  const members = data?.members || [];
  const year = data?.activeYear;
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold">{locale === 'th' ? 'คณะกรรมการ' : 'Board Members'}{year ? ` ${year}` : ''}</h2>
      {members.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: any) => {
          const photo = mediaUrl(member.photo);
          return <article key={member.id || member.name}>
            {photo && <div className="relative aspect-[3/4] overflow-hidden rounded-lg"><Image src={photo} alt={member.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" /></div>}
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3><p className="mt-1 text-sm text-[var(--jci-blue)]">{member.position}</p>
          </article>
        })}
      </div> : <p className="text-[var(--muted)]">{locale === 'th' ? 'ยังไม่มีรายชื่อสมาชิก' : 'No members are available yet.'}</p>}
    </section>
  );
}

export function DynamicContactForm() {
  const data = useDocumentData();
  return <section className="mx-auto w-full max-w-3xl px-5 py-10 lg:px-8"><ContactForm locale={data?.currentLocale === 'th' ? 'th' : 'en'} /></section>;
}

export function DynamicHero() {
  const data = useDocumentData();
  const locale = data?.currentLocale || 'en';
  const settings = data?.settings || {};
  const image = mediaUrl(settings.homeHeroImage);
  const title = settings.siteName || 'JCI Bangkok';
  const subtitle = settings.currentYearTheme || (locale === 'th' ? 'พัฒนาผู้นำ สร้างการเปลี่ยนแปลง' : 'Developing leaders, creating positive change.');
  return <section className="relative isolate overflow-hidden bg-[var(--jci-black)] px-5 py-24 text-white lg:px-8 lg:py-32">
    {image && <Image src={image} alt="" fill className="-z-20 object-cover opacity-30" sizes="100vw" />}
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--jci-black)] via-[var(--jci-black)]/85 to-[var(--jci-black)]/40" />
    <div className="mx-auto max-w-7xl"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">{locale === 'th' ? 'เจซีไอ กรุงเทพฯ' : 'JCI Bangkok'}</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight lg:text-7xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{subtitle}</p></div>
  </section>;
}
