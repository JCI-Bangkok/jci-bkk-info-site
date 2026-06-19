import Image from "next/image";
import Link from "next/link";
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { opportunities } from "@/lib/site-data";
import React from 'react'

const pathways = [
  { number: "01", title: "Grow as a leader", detail: "Build skills through real responsibility.", href: "/membership" },
  { number: "02", title: "Expand your network", detail: "Meet people across sectors and cultures.", href: "/events" },
  { number: "03", title: "Go global", detail: "Connect to the worldwide JCI movement.", href: "/about" },
  { number: "04", title: "Make an impact", detail: "Turn local ideas into visible action.", href: "/projects" }
] as const;

const eventTypeLabels: Record<string, string> = {
  training: 'Training & Development',
  networking: 'Business & Networking',
  community: 'Community Project',
  general: 'General Meeting',
  international: 'International Event',
  partner: 'Partner Event',
}

const articleCategoryLabels: Record<string, string> = {
  news: 'News',
  'event-recap': 'Event Recap',
  'member-story': 'Member Story',
  'president-message': "President's Message",
  'partner-announcement': 'Partner Announcement',
  knowledge: 'Knowledge Article',
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--jci-blue)]">
      {children}
      <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function getEventDateParts(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = d.toLocaleDateString('en-US', { day: 'numeric' })
    const fullDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return { month, day, fullDate }
  } catch {
    return { month: 'JUL', day: '18', fullDate: 'July 18, 2026' }
  }
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

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // 1. Fetch Events
  const eventsResult = await payload.find({
    collection: 'events',
    limit: 3,
    sort: 'eventDate',
    where: {
      status: {
        equals: 'upcoming',
      },
    },
  })
  
  let homeEvents = eventsResult.docs
  if (homeEvents.length === 0) {
    const fallbackEvents = await payload.find({
      collection: 'events',
      limit: 3,
      sort: '-eventDate',
    })
    homeEvents = fallbackEvents.docs
  }

  // 2. Fetch Projects
  const projectsResult = await payload.find({
    collection: 'projects',
    limit: 3,
    sort: '-year',
  })
  const homeProjects = projectsResult.docs
  const featuredProject = homeProjects.find(p => p.category === 'sustainability') || homeProjects[0]

  // 3. Fetch Member Story
  const storiesResult = await payload.find({
    collection: 'member-stories',
    limit: 3,
  })
  const homeStories = storiesResult.docs
  const featuredStory = homeStories[0]

  // 4. Fetch Articles (News)
  const articlesResult = await payload.find({
    collection: 'articles',
    limit: 3,
    sort: '-publishDate',
  })
  const homeArticles = articlesResult.docs

  // Helpers for images
  const firstEvent = homeEvents[0]
  const firstEventImgUrl = (firstEvent?.coverImage && typeof firstEvent.coverImage === 'object')
    ? firstEvent.coverImage.url
    : "/images/home/leadership-workshop.png"

  const projectImageUrl = (featuredProject?.gallery?.[0]?.image && typeof featuredProject.gallery[0].image === 'object')
    ? featuredProject.gallery[0].image.url
    : "/images/home/community-project.png"

  const storyImageUrl = (featuredStory?.photo && typeof featuredStory.photo === 'object')
    ? featuredStory.photo.url
    : "/images/home/member-story.png"

  return (
    <>
      <section className="hero-grid relative overflow-hidden border-b border-[var(--line)] bg-white">
        <div className="hero-ripple" aria-hidden="true" />
        <div className="mx-auto grid min-h-[38rem] w-full max-w-[90rem] lg:grid-cols-[0.84fr_1.16fr]">
          <div className="relative z-10 flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20">
            <h1 className="max-w-[11ch] text-[clamp(3.5rem,6.3vw,6.9rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[var(--ink)]">
              Lead local. <span className="text-[var(--jci-blue)]">Connect global.</span> Create change.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">
              A Bangkok community where young people build leadership through real projects, meaningful connections, and action that matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/membership" className="button-primary group">
                Become a Member <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="button-secondary group">
                Explore what we do <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[25rem] overflow-hidden lg:min-h-full">
            <Image
              src="/images/home/hero-community.png"
              alt="Young Bangkok professionals connecting at a community event beside the river"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[62%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent lg:block" />
          </div>
        </div>
      </section>

      <nav aria-label="Explore JCI Bangkok by goal" className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map((pathway) => (
            <Link key={pathway.title} href={pathway.href} className="group flex items-center gap-4 border-b border-[var(--line)] px-5 py-6 transition-colors hover:bg-[var(--paper-soft)] sm:border-r lg:border-b-0 lg:last:border-r-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--paper-tint)] text-xs font-bold text-[var(--jci-blue)]">{pathway.number}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[var(--ink)]">{pathway.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{pathway.detail}</span>
              </span>
              <Arrow className="h-5 w-5 shrink-0 text-[var(--jci-blue)] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </nav>

      <section className="section-space bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">Four ways to move forward.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[var(--muted)]">Choose the opportunity that fits where you are now. Every path combines learning with doing.</p>
              <div className="mt-7"><TextLink href="/about">Learn about JCI Bangkok</TextLink></div>
            </div>
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
              {opportunities.map((item, index) => (
                <article key={item.title} className="border-t border-[var(--line)] pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-bold tracking-[0.14em] text-[var(--jci-blue)]">0{index + 1}</p>
                    <span className="text-xs font-semibold text-[var(--muted)]">{item.stat}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {homeEvents.length > 0 && (
        <section className="section-space border-y border-[var(--line)] bg-[var(--paper-soft)]">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="section-label">Events</p>
                <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">Come meet the chapter in real life.</h2>
              </div>
              <TextLink href="/events">View all events</TextLink>
            </div>
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {homeEvents.map((event) => {
                  const { month, day } = getEventDateParts(event.eventDate);
                  return (
                    <Link key={event.slug} href={`/events/${event.slug}`} className="group grid grid-cols-[4.5rem_1fr_auto] gap-4 py-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--jci-blue)]">{month}</p>
                        <p className="mt-1 text-3xl font-semibold text-[var(--ink)]">{day}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--jci-blue)]">{event.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                          {eventTypeLabels[event.eventType] || event.eventType} · {event.venue}
                        </p>
                      </div>
                      <Arrow className="mt-1 h-5 w-5 text-[var(--jci-blue)] transition-transform group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
              {firstEvent && (
                <Link href={`/events/${firstEvent.slug}`} className="image-feature group relative min-h-[26rem] overflow-hidden rounded-[2rem]">
                  {firstEventImgUrl && (
                    <Image
                      src={firstEventImgUrl}
                      alt={firstEvent.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--jci-black)] via-[color:rgba(19,15,45,0.82)] to-transparent p-6 pt-24 text-white sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      Featured event · {getEventDateParts(firstEvent.eventDate).fullDate}
                    </p>
                    <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">{firstEvent.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 line-clamp-2">{firstEvent.shortDescription}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {featuredProject && (
        <section className="section-space bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
              <div>
                <p className="section-label">Community projects</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">Ideas become useful when we act on them.</h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">Member-led projects respond to real Bangkok needs while giving teams room to lead, collaborate, and measure what changed.</p>
                <div className="mt-7"><TextLink href="/projects">Explore all projects</TextLink></div>
              </div>
              <div className="grid overflow-hidden rounded-[2rem] bg-[var(--jci-black)] text-white sm:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-h-[23rem] sm:min-h-[32rem]">
                  {projectImageUrl && (
                    <Image
                      src={projectImageUrl}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 44vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--jci-teal)]">Featured · {featuredProject.year}</p>
                    <h3 className="mt-4 text-3xl font-semibold leading-tight">{featuredProject.title}</h3>
                    <p className="mt-5 text-sm leading-6 text-white/70 line-clamp-4">{featuredProject.problemStatement}</p>
                  </div>
                  <Link href={`/projects/${featuredProject.slug}`} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    See the project <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {featuredStory && (
        <section className="member-story overflow-hidden bg-[var(--paper-tint)]">
          <div className="mx-auto grid w-full max-w-[90rem] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative flex min-h-[31rem] flex-col justify-center px-5 py-16 sm:px-10 lg:px-20">
              <span className="font-accent text-7xl leading-none text-[var(--jci-blue)]">“</span>
              <blockquote className="font-accent max-w-3xl text-3xl leading-[1.28] text-[var(--ink)] sm:text-4xl">{featuredStory.quote}</blockquote>
              <div className="mt-8 border-l-2 border-[var(--jci-blue)] pl-4">
                <p className="font-semibold text-[var(--ink)]">{featuredStory.memberName}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{featuredStory.chapterRole} · Joined {featuredStory.yearJoined}</p>
              </div>
            </div>
            <div className="relative min-h-[28rem] lg:min-h-full">
              {storyImageUrl && (
                <Image
                  src={storyImageUrl}
                  alt={featuredStory.memberName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover object-center"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {homeArticles.length > 0 && (
        <section className="section-space bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 lg:grid-cols-[0.58fr_1.42fr] lg:px-8">
            <div>
              <p className="section-label">Latest stories</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-[var(--ink)]">From the chapter.</h2>
              <div className="mt-7"><TextLink href="/news">Read all news</TextLink></div>
            </div>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {homeArticles.map((article) => (
                <Link key={article.slug} href={`/news/${article.slug}`} className="group grid gap-3 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6">
                  <div className="text-xs font-semibold text-[var(--jci-blue)]">
                    {articleCategoryLabels[article.category] || article.category}
                    <span className="mt-1 block font-normal text-[var(--muted)]">{formatDate(article.publishDate)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-[var(--ink)] transition-colors group-hover:text-[var(--jci-blue)]">{article.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{article.summary}</p>
                  </div>
                  <Arrow className="hidden h-5 w-5 text-[var(--jci-blue)] transition-transform group-hover:translate-x-1 sm:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-[var(--jci-blue)] text-white">
        <div className="cta-ripple" aria-hidden="true" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center lg:px-8">
          <div>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Be part of something bigger.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/80">Join JCI Bangkok and start building your leadership through action, connection, and service.</p>
          </div>
          <Link href="/membership" className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--jci-blue)] transition hover:bg-[var(--jci-black)] hover:text-white">
            Become a Member <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

