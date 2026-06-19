# JCI Bangkok Website Project Brief

## Project
Modern NGO website for **JCI Bangkok**, a local organization under **JCI Thailand**, built with:

- Next.js
- Payload CMS
- PostgreSQL
- Tailwind CSS
- Vercel or AWS deployment

## Positioning

JCI Bangkok should be presented as:

> A Bangkok-based local chapter of Junior Chamber International Thailand that develops young leaders through leadership training, business and entrepreneurship opportunities, international cooperation, and community impact projects.

## Organization Hierarchy

```text
Junior Chamber International Global
└── JCI Thailand
    └── JCI Bangkok
```

## Source Research Summary

### JCI Global

JCI global positions itself around leadership development, local action, international connection, and community impact.

Important global messages:

- Mission: provide leadership development opportunities that empower young people to create positive change.
- Vision: be the foremost global network of young leaders.
- JCI members operate across local communities in more than 100 countries.
- Core opportunity areas include:
  - Business & Entrepreneurship
  - International Cooperation
  - Individual Development
  - Community Impact

### JCI Thailand

JCI Thailand positions itself as a nonprofit youth organization for people aged 18 to 40, focused on leadership, skills development, networking, and sustainable community development.

Important Thailand-specific points:

- JCI Thailand began in 1953.
- Members are young people aged 18 to 40.
- JCI Thailand lists 6 local organizations.
- JCI Bangkok is one of the local organizations.
- Membership applications are routed through local chapters.

## Website Goals

### Primary Goals

1. Recruit new members
2. Explain what JCI Bangkok does clearly
3. Showcase credibility under JCI Thailand and JCI Global
4. Promote events and projects
5. Support sponsor and partner visibility
6. Make content easy for the chapter team to update

### Secondary Goals

1. Archive annual board and projects
2. Publish news and member stories
3. Collect membership inquiries
4. Build future member portal foundation

## Target Users

### 1. Potential Members

Age 18 to 40, based in Bangkok, interested in:

- Leadership development
- Business networking
- Public speaking
- Social impact
- International opportunities
- Personal growth

Main question:

> Why should I join JCI Bangkok instead of another networking or volunteer group?

### 2. Sponsors and Partners

Companies, foundations, embassies, universities, and civic organizations.

Main question:

> Is JCI Bangkok credible, active, and aligned with our brand or social impact goals?

### 3. Current Members

Existing JCI Bangkok members who need:

- Event information
- Announcements
- Forms
- Photos
- Project archives
- Committee updates

### 4. JCI Thailand / JCI Global Visitors

People checking local chapter activity, leadership, and brand consistency.

## Key Website Pages

## 1. Home

Purpose:

- Explain JCI Bangkok in 5 seconds.
- Convert visitors into members or event attendees.

Sections:

1. Hero
   - Headline
   - Short subheadline
   - CTA: Become a Member
   - CTA: View Events

2. Affiliation Strip
   - Local chapter under JCI Thailand
   - Part of Junior Chamber International global network

3. What We Do
   - Leadership Development
   - Business & Entrepreneurship
   - International Cooperation
   - Community Impact

4. Featured Events

5. Featured Projects

6. Member Stories

7. Sponsors / Partners

8. Final CTA

Suggested hero copy:

> Develop as a leader. Create impact in Bangkok. Connect with the world.

Subheadline:

> JCI Bangkok is a local chapter of JCI Thailand, empowering young active citizens aged 18 to 40 through leadership development, business opportunities, international cooperation, and community impact projects.

## 2. About JCI Bangkok

Purpose:

- Establish identity and credibility.

Sections:

1. Who We Are
2. Our Role as a Local Chapter
3. Mission and Vision
4. JCI Creed
5. Annual Theme
6. Bangkok Context
7. Link to JCI Thailand and JCI Global

Recommended framing:

> JCI Bangkok translates JCI’s global mission into local action by creating leadership opportunities, projects, and networks for young people in Bangkok.

## 3. Board of Directors

Purpose:

- Show leadership credibility and yearly governance.

CMS fields:

- Name
- Position
- Year
- Photo
- Bio
- Company / role
- LinkedIn
- Email optional
- Display order

Important feature:

- Archive by year

Example URL:

```text
/about/board/2026
/about/board/2025
```

## 4. Events

Purpose:

- Promote upcoming events and document past events.

Event types:

- Training
- Networking
- Community project
- General meeting
- International event
- Partner event

CMS fields:

- Title
- Slug
- Event date
- End date
- Venue
- Google Maps link
- Registration link
- Event type
- Host committee
- Short description
- Full description
- Cover image
- Gallery
- Status: Draft / Upcoming / Completed / Cancelled
- Featured flag

## 5. Projects

Purpose:

- Show impact beyond networking.

Project categories:

- Community Impact
- Youth Development
- Sustainability
- Entrepreneurship
- International Cooperation

CMS fields:

- Title
- Year
- Category
- Problem statement
- Target beneficiaries
- Activities
- Outcomes
- Impact numbers
- SDG tags
- Partners
- Gallery
- Report file
- CTA

## 6. Membership

Purpose:

- Convert potential members.

Sections:

1. Who Can Join
2. Why Join
3. Member Benefits
4. Application Process
5. FAQ
6. Application Form

Eligibility:

- Age 18 to 40
- Interested in personal development and community impact
- Based in or connected to Bangkok

Suggested benefits:

- Leadership practice
- Business and professional network
- Training opportunities
- Community project experience
- International JCI exposure
- Friendship and collaboration

## 7. News and Articles

Purpose:

- SEO, updates, announcements, thought leadership.

Article types:

- News
- Event recap
- Member story
- President message
- Partner announcement
- Knowledge article

CMS fields:

- Title
- Slug
- Author
- Category
- Tags
- Cover image
- Summary
- Body
- Publish date
- SEO title
- SEO description
- Related event or project

## 8. Member Stories

Purpose:

- Make the organization feel human and credible.

CMS fields:

- Member name
- Year joined
- Chapter role
- Profession
- Story title
- Quote
- Full story
- Photo
- Related projects/events

## 9. Sponsors and Partners

Purpose:

- Support fundraising and partnership development.

Sections:

1. Why Partner With JCI Bangkok
2. Partner Categories
3. Current Partners
4. Sponsorship Packages
5. Contact CTA

CMS fields:

- Organization name
- Logo
- Website
- Partner type
- Partnership year
- Description
- Related projects/events

## 10. Contact

Purpose:

- Centralize inquiries.

Forms:

- Membership inquiry
- Partnership inquiry
- Media inquiry
- General contact

Fields:

- Name
- Email
- Phone
- Inquiry type
- Message
- Consent checkbox

## CMS Content Model

## Collections

### Users

Payload CMS admin users.

Roles:

- Super Admin
- President
- Secretary
- Marketing
- Event Manager
- Content Editor
- Viewer

### Pages

For flexible static pages.

Fields:

- Title
- Slug
- Layout blocks
- SEO metadata
- Status

### Events

For all events.

### Projects

For impact initiatives.

### Articles

For news and posts.

### BoardMembers

For annual board profiles.

### MembersStories

For member testimonials.

### Partners

For sponsors and partners.

### Media

For images, documents, and galleries.

### Forms

For membership and contact submissions.

### Settings

Global website settings:

- Site name
- Logo
- Social links
- Contact email
- Footer text
- Current year theme
- Membership form link

## Suggested Payload CMS Folder Structure

```text
src/
  app/
    (frontend)/
      page.tsx
      about/
      events/
      projects/
      membership/
      news/
      contact/
    (payload)/
      admin/
  collections/
    Users.ts
    Pages.ts
    Events.ts
    Projects.ts
    Articles.ts
    BoardMembers.ts
    MemberStories.ts
    Partners.ts
    Forms.ts
    Media.ts
  globals/
    SiteSettings.ts
  blocks/
    HeroBlock.ts
    CTASection.ts
    FeatureGrid.ts
    EventList.ts
    ProjectList.ts
    GalleryBlock.ts
    RichTextBlock.ts
  lib/
    payload.ts
    seo.ts
    routes.ts
```

## Recommended Frontend Routes

```text
/
 /about
 /about/board
 /about/board/[year]
 /events
 /events/[slug]
 /projects
 /projects/[slug]
 /membership
 /news
 /news/[slug]
 /member-stories
 /partners
 /contact
```

## Design Direction

## Visual Style

The site should feel:

- Modern
- Civic
- Professional
- Youthful
- Credible
- Not corporate MLM-like
- Not old NGO template

## Design Principles

1. Use real photos from JCI Bangkok events.
2. Lead with action and impact, not titles.
3. Make membership benefits concrete.
4. Show affiliation with JCI Thailand and JCI Global clearly.
5. Keep event and project pages highly visual.
6. Use annual archive structure because JCI leadership changes yearly.

## Suggested Tone

- Confident
- Welcoming
- Action-oriented
- Public-service minded
- International but locally grounded

Avoid:

- Too much internal JCI jargon
- Overly ceremonial content
- Generic “networking” language
- Excessive title-focused hierarchy

## Initial Homepage Copy

### Hero

```text
Develop as a leader.
Create impact in Bangkok.
Connect with the world.
```

### Subheadline

```text
JCI Bangkok is a local chapter of JCI Thailand, empowering young active citizens aged 18 to 40 through leadership development, business opportunities, international cooperation, and community impact projects.
```

### CTA

```text
Become a Member
View Upcoming Events
```

## Technical Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- next-intl for bilingual support

### CMS

- Payload CMS
- PostgreSQL
- Role-based access control
- Draft / publish workflow
- Media library
- Rich text editor
- Global settings

### Database

- PostgreSQL
- Recommended hosting:
  - Neon for MVP
  - Supabase Postgres
  - AWS RDS for production-grade setup

### Deployment

Recommended MVP:

- Vercel for Next.js
- Neon for PostgreSQL
- UploadThing / S3 for media storage

Recommended production:

- AWS App Runner or ECS
- AWS RDS PostgreSQL
- S3 + CloudFront
- Route 53
- SES for email

## MVP Scope

## Phase 1: Foundation

Deliver:

- Homepage
- About page
- Board page
- Events listing and detail
- Projects listing and detail
- Membership page and inquiry form
- News listing and detail
- Contact page
- Admin CMS

Estimated content collections:

- Events
- Projects
- Articles
- Board Members
- Partners
- Member Stories
- Forms
- Site Settings

## Phase 2: Growth

Add:

- Bilingual Thai / English
- Member directory
- Sponsor package page
- Project impact reports
- Newsletter integration
- Gallery archive
- SEO content hub

## Phase 3: Member Portal

Add:

- Member login
- Member resources
- Event check-in
- Internal announcements
- Committee workspace
- Member profile
- Certificate downloads

## Data Governance

Because this is an NGO membership website, handle personal data carefully.

Required:

- Consent checkbox on forms
- Privacy policy
- Clear purpose of data collection
- Admin access control
- Export/delete contact data process
- Avoid public display of phone numbers unless approved

## SEO Strategy

Primary keywords:

- JCI Bangkok
- JCI Thailand
- Junior Chamber International Thailand
- youth leadership Bangkok
- leadership organization Bangkok
- young professionals Bangkok
- volunteer organization Bangkok
- business networking Bangkok
- community impact Bangkok

Core SEO pages:

- Home
- About JCI Bangkok
- Membership
- Events
- Projects
- News

## Analytics

Track:

- Membership CTA clicks
- Event registration clicks
- Contact form submissions
- Sponsor inquiry submissions
- Newsletter signups
- Most viewed events/projects

Suggested tools:

- Google Analytics 4
- Google Search Console
- Plausible Analytics as privacy-friendly alternative

## Recommended First Build Order

1. Set up Next.js + Payload CMS + PostgreSQL
2. Define content collections
3. Build homepage
4. Build events and projects
5. Build membership funnel
6. Build board archive
7. Add SEO and analytics
8. Add bilingual support
9. Polish design with real JCI Bangkok photos

## Open Questions Before UI Design

1. What is the 2026 annual theme of JCI Bangkok?
2. Who is the target member persona: entrepreneur, professional, student, or mixed?
3. Will membership application be handled by JCI Thailand or JCI Bangkok directly?
4. Does JCI Bangkok need Thai-first, English-first, or bilingual from day one?
5. Is there an existing brand guide from JCI Thailand or JCI Global?
6. Should member directory be public, private, or disabled?
7. Who will manage content after launch?
8. What forms are needed at launch?
9. Do sponsors require package pages or only logo visibility?
10. Are event registrations external, such as Google Form or Ticketmelon, or internal?

## Source References

- JCI Global About: https://jci.cc/about/
- JCI Global What We Do: https://jci.cc/what-we-do/
- JCI Global Homepage: https://jci.cc/
- JCI Thailand: https://jcithailand.com/
- JCI Thailand on JCI Global directory: https://jci.cc/national-org/jci-thailand/
- JCI Thailand Business Directory: https://jcithailand.com/th/business-directory/
- JCI Bangkok page on JCI Thailand: https://jcithailand.com/organization/jci-bangkok/
