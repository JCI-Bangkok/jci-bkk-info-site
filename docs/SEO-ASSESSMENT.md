# JCI Bangkok SEO assessment and upgrade

Assessment date: 7 October 2026 (Bangkok). Preferred production origin: **https://www.jcibangkok.org**.

> Follow-up: the CMS SEO editor upgrade now requires an explicit database migration. See [CMS SEO upgrade and release guide](CMS-SEO-UPGRADE.md). The snapshots and validation counts below describe the initial technical SEO patch.

## Outcome and scope

The codebase now provides a stronger technical SEO foundation for the English and Thai site. Changes are implemented locally and have not been deployed. The live baseline was captured before these changes; it remains the reference for the existing production site.

This assessment covers public HTML, URL behavior, localization, CMS rendering, content discovery, metadata, structured data and image delivery. It is not a ranking, backlink or keyword-volume audit: no Search Console, analytics, backlink database or production field-performance account was connected. No rankings or rich-result eligibility are guaranteed.

## Observed baseline and changes

| Area | Evidence / finding | Implemented improvement |
| --- | --- | --- |
| Canonical URLs | None on all 14 main pages across English and Thai | Each page has its own absolute HTTPS canonical, including detail pages and board archives |
| Languages | No hreflang on the 14 main pages | Reciprocal English, Thai and English x-default alternate links |
| Titles | Generic labels; membership and PhotoBomb titles were English on Thai pages | Descriptive, localized titles with the JCI Bangkok brand; the homepage now includes the brand too |
| Descriptions | Main pages inherited the same homepage description; detail pages only supplied a title | Distinct descriptions by page; article SEO fields now take precedence over editorial title/summary |
| Social previews | No dedicated page-level preview metadata | Open Graph and Twitter titles, descriptions, image URLs and locale metadata |
| Crawling files | Live robots.txt and sitemap.xml returned HTTP 200 homepage HTML | Real text robots.txt and XML sitemap, with a sitemap reference in robots.txt |
| Sitemap content | No usable XML at the production endpoint | 36 canonical URLs in the verified current dataset; public events, projects, published articles and distinct board years in both languages |
| Public content | Direct event pages could display drafts; direct article pages ignored publish date | Shared visibility filters in detail rendering and metadata; public filters in sitemap and static parameter generation |
| Content freshness | Detail pages relied on CMS hooks alone | Detail pages can revalidate every five minutes; sitemap reads current records per request |
| Project content | Renderer referenced summary/details/beneficiaries/impact/media instead of actual CMS fields | Restored problem statements, activities, target beneficiaries, outcomes and gallery images |
| CMS text | Hand-written rich text renderer dropped nested links, line breaks and some formatting | Payload's maintained renderer preserves the CMS content and server-rendered links |
| Discovery | Client pagination exposed only the first six cards in initial HTML | A visible expandable archive contains server-rendered links to every item in longer groups |
| Structured data | None on the 14 main pages | Homepage Organization and WebSite; Article, Event, WebPage and breadcrumb data on relevant detail pages |
| Navigation | Homepage “Explore” pointed to contact#about | Links directly to the About page |
| Image delivery | Some fill images lacked responsive sizing; article images bypassed the media URL helper | Added sizing hints and normalized article image URLs |
| Admin/API indexing | No dedicated response-level indexing exclusions | X-Robots-Tag noindex, nofollow headers for admin/API and crawler exclusions |
| Missing pages | Live missing detail and unsupported-locale tests returned 404 | Kept 404 handling; added locale validation and strict four-digit board years |
| Old URLs | Existing permanent redirects for news/projects/board routes | Preserved and verified redirects; excluded old paths from sitemap |

Source snapshots: `seo-live-baseline.json` and `seo-local-verified.json` in this directory. The baseline audit follows redirects and records the final URL and content type, so a 200 result alone does not imply a correct robots or sitemap response.

## Validation

- Production build succeeded, including database-backed event, article, project and board pages.
- TypeScript and lint checks passed.
- Unit checks cover invalid locales, branded titles, safe JSON-LD serialization and publication query filters.
- Rendered-page checks passed for 17 pages: the 14 main language pages and representative event, project and article detail pages.
- Verified 36 unique canonical sitemap URLs, correct crawl-file content types, permanent legacy redirects, missing-page 404s and admin noindex headers.
- HTTPS and the HTTP-to-HTTPS redirect were confirmed on the live domain.

Re-run verification with a local production server running:

```sh
npm run build
npm run start -- --port 3100
# In another terminal:
npm run check:seo
python3 scripts/audit-seo.py http://localhost:3100
```

To check a deployment, run `npm run check:seo -- https://www.jcibangkok.org` and `python3 scripts/audit-seo.py https://www.jcibangkok.org`. The test compares canonical URLs with NEXT_PUBLIC_SERVER_URL, defaulting to the preferred origin above.

## Prioritized remaining work

### Before and immediately after deployment

1. Set **NEXT_PUBLIC_SERVER_URL=https://www.jcibangkok.org** in the hosting environment. This is the canonical production origin, including when testing previews. The repository fallback uses this value, but an existing environment override can change it.
2. Deploy the verified code through the site's normal release process. The initial technical SEO patch required no schema changes; the subsequent CMS SEO editor upgrade requires the migrations documented in the CMS release guide.
3. Re-run the checks against production. Verify crawl files, a Thai page, event/article/project pages, response headers and image accessibility.
4. Verify a Search Console domain property, submit **https://www.jcibangkok.org/sitemap.xml**, and inspect representative English and Thai URLs. Check actual indexed canonical choices and language versions after recrawling.
5. Test representative pages in Google's Rich Results Test. Event records currently store a venue name and map link, but no structured postal-address fields. Supply a verified venue address before expecting full event rich-result eligibility. Offers, prices and availability should be added only when supported by accurate source data; they were not invented here. [Google event markup requirements](https://developers.google.com/search/docs/appearance/structured-data/event).
6. If preview deployments are publicly accessible, configure preview-only noindex at the hosting layer. Canonicals are not a substitute for preview indexing controls.

### Content and search intent

These are initial topic hypotheses based on the chapter's existing offerings, not measured keyword-volume or competition findings.

| Search intent | English / Thai topic examples | Primary destination |
| --- | --- | --- |
| Find the chapter | JCI Bangkok; JCI กรุงเทพ; Junior Chamber International Bangkok | Homepage and About |
| Join a leadership community | young leaders Bangkok; สมัครสมาชิก JCI Bangkok; พัฒนาผู้นำรุ่นใหม่ | Membership |
| Attend a relevant event | Bangkok leadership workshops; business networking Bangkok; อบรมผู้นำ กรุงเทพ; กิจกรรมเครือข่ายธุรกิจ | Events and individual events |
| Work on community impact | Bangkok community projects; โครงการเพื่อสังคม กรุงเทพ | Individual project pages |
| Collaborate with the chapter | JCI Bangkok partnership; ร่วมเป็นพันธมิตร JCI | Contact and About |

- Check real queries, impressions and click-through rates in Search Console before committing to topic expansion. Broad networking searches may be competitive and may have a different intent from chapter membership.
- Review seeded projects, articles, member stories and impact claims for factual accuracy. Publish verified chapter work rather than presenting illustrative seed content as evidence of real outcomes.
- Strengthen event pages with a clear audience, agenda, verified speaker biographies, venue directions, registration deadline and price where available. Keep cancelled events accurate and give completed events useful recaps.
- Strengthen project pages with the actual problem, what members did, dates, partners, measurable outcomes and evidence. Add reports or approved photos where available.
- Publish full Thai and English versions of important content. Payload currently permits English fallback when Thai translations are missing; hreflang cannot compensate for untranslated main content.
- Use public author names or an editorial-team attribution. The current user collection has no public author-name field, so articles now use the chapter team rather than exposing administrative email addresses as bylines. Add approved contributor biographies if individual authorship matters.
- Improve image descriptions in the CMS. Filename-generated alt text is often less useful than a concise description of the actual photograph. Decorative images can retain empty alt text.
- Retain the combined Events/Updates hub for now. Separate news/project landing pages should be considered only when there is enough distinct, useful content and measured demand to justify replacing the current redirects.

### Authority and local relevance

- Keep the chapter's identity, website, contact information and social profiles consistent across JCI Thailand, the international network and official chapter channels.
- Seek relevant links from actual project partners, universities, speakers, sponsors and event recaps. No outreach has been sent.
- Add approved organizational history, current leadership, partnership evidence and reports. These establish credibility while helping visitors assess the chapter.
- Consider a Google Business Profile only if the chapter satisfies Google's real-world eligibility requirements. No location or business address was invented. [Google Business Profile eligibility](https://support.google.com/business/answer/3038177).

### Performance and measurement

Responsive image hints and shared metadata/page lookups improve delivery efficiency, but this assessment does **not** claim a measured Core Web Vitals improvement. No Lighthouse score or production field metrics were captured.

- Measure mobile homepage, event, article and membership pages using PageSpeed Insights and Search Console's Core Web Vitals report. Aim for field LCP <= 2.5 seconds, INP <= 200 milliseconds and CLS <= 0.1 at the 75th percentile. [Core Web Vitals thresholds](https://web.dev/articles/vitals).
- Inspect hero image transfer sizes, original media dimensions, gallery loading, server response times and third-party form loading. Optimize measured bottlenecks before broad redesigns.
- Keep image dimensions/sizes appropriate to the actual container. Main hero images already have priority loading; avoid giving priority to many competing images without measurement.
- Check the existing remote image configuration: it allows any HTTPS host. Restrict it to the actual media host(s) when storage requirements are confirmed.
- Review production caching with the CMS workflow. Static details revalidate every five minutes and change hooks invalidate updates, while several main pages are dynamically rendered. Tune based on measured response time and publication requirements.
- Track organic impressions, clicks, meaningful query groups, registrations, membership submissions and partnership enquiries. Compare with a deployment-date baseline; avoid treating a single synthetic “SEO score” as a ranking forecast.

## Suggested cadence

- First week: deploy, verify Search Console, submit sitemap, validate structured data and establish traffic/performance baselines.
- Weeks 2–4: verify translations and seed content; improve the most important event/project/member pages; publish useful recaps from real activities.
- Monthly: review indexing, query performance, organic conversions and Core Web Vitals; prioritize pages with impressions but weak click-through or engagement.

## Guidance used

- [Google Search: developer guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Localized page versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Canonical URL consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Building a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
