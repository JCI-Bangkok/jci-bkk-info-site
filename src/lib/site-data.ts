export type Opportunity = {
  title: string;
  summary: string;
  stat: string;
  accent: string;
};

export type EventItem = {
  title: string;
  slug: string;
  type: string;
  date: string;
  venue: string;
  status: "Upcoming" | "Completed";
  summary: string;
  highlight: string;
};

export type ProjectItem = {
  title: string;
  slug: string;
  category: string;
  year: string;
  summary: string;
  beneficiaries: string;
  impact: string;
};

export type StoryItem = {
  name: string;
  role: string;
  yearJoined: string;
  quote: string;
  highlight: string;
};

export type ArticleItem = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  author: string;
  summary: string;
};

export type BoardMember = {
  name: string;
  role: string;
  company: string;
  bio: string;
};

export type BoardYear = {
  year: string;
  theme: string;
  president: string;
  summary: string;
  members: BoardMember[];
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/membership", label: "Membership" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" }
] as const;

export const opportunities: Opportunity[] = [
  {
    title: "Leadership Development",
    summary:
      "Hands-on opportunities to lead committees, facilitate programs, and grow confidence through practical experience.",
    stat: "Ages between 18-40",
    accent: "For young active citizens"
  },
  {
    title: "Business & Entrepreneurship",
    summary:
      "A network for young professionals and founders who want sharper communication, stronger connections, and responsible growth.",
    stat: "Cross-sector",
    accent: "Business, civic, and creative"
  },
  {
    title: "International Cooperation",
    summary:
      "Connections to JCI local chapters, national organizations, and global events that broaden perspective and collaboration.",
    stat: "100+ countries",
    accent: "Global JCI network"
  },
  {
    title: "Community Impact",
    summary:
      "Projects rooted in Bangkok that turn ideas into measurable outcomes for communities, partners, and future leaders.",
    stat: "Local action",
    accent: "Impact with purpose"
  }
];

export const events: EventItem[] = [
  {
    title: "Bangkok Leadership Lab",
    slug: "bangkok-leadership-lab",
    type: "Training",
    date: "July 18, 2026",
    venue: "Creative Hall, Sukhumvit",
    status: "Upcoming",
    summary:
      "A practical leadership intensive focused on facilitation, speaking, and leading across committees.",
    highlight: "Designed for first-time and emerging chapter leaders."
  },
  {
    title: "Impact Mixer with Mission-Driven Founders",
    slug: "impact-mixer-founders",
    type: "Networking",
    date: "August 6, 2026",
    venue: "Riverside Commons, Bangkok",
    status: "Upcoming",
    summary:
      "An evening of founder stories, civic entrepreneurship, and cross-sector introductions for young professionals.",
    highlight: "Blends networking with live case studies from Bangkok builders."
  },
  {
    title: "Community Action Day",
    slug: "community-action-day",
    type: "Community Project",
    date: "May 10, 2026",
    venue: "Khlong Toei District",
    status: "Completed",
    summary:
      "A volunteer activation that paired local partners, members, and youth leaders around a targeted neighborhood initiative.",
    highlight: "Built to demonstrate visible local action, not abstract volunteering."
  }
];

export const projects: ProjectItem[] = [
  {
    title: "Future Skills for Bangkok Youth",
    slug: "future-skills-bangkok-youth",
    category: "Youth Development",
    year: "2026",
    summary:
      "A workshop series connecting communication, leadership, and career-readiness for young people entering the workforce.",
    beneficiaries: "Upper secondary and university-aged participants",
    impact: "Training pathways with volunteer mentors and partner organizations."
  },
  {
    title: "Green District Challenge",
    slug: "green-district-challenge",
    category: "Sustainability",
    year: "2026",
    summary:
      "A community initiative that turns environmental awareness into local action through public campaigns and partnerships.",
    beneficiaries: "Neighborhood communities and civic partners",
    impact: "Creates a visible route from participation to measurable city impact."
  },
  {
    title: "Bangkok Social Enterprise Exchange",
    slug: "bangkok-social-enterprise-exchange",
    category: "Entrepreneurship",
    year: "2025",
    summary:
      "A collaborative platform for founders, members, and partner organizations to exchange ideas around responsible business growth.",
    beneficiaries: "Early-stage founders and young professionals",
    impact: "Bridges networking with mentorship and real collaboration."
  }
];

export const stories: StoryItem[] = [
  {
    name: "Mina S.",
    role: "Member and program lead",
    yearJoined: "2024",
    quote:
      "JCI Bangkok gave me a place to test my leadership in public, with real stakes and a supportive team behind me.",
    highlight: "From event volunteer to committee lead within one year."
  },
  {
    name: "Narin T.",
    role: "Partnership committee",
    yearJoined: "2023",
    quote:
      "I joined for community impact and stayed because the network pushed me to think bigger than my day job.",
    highlight: "Built sponsor conversations into long-term partner relationships."
  },
  {
    name: "Aiko P.",
    role: "International relations",
    yearJoined: "2025",
    quote:
      "The international side of JCI made Bangkok feel connected to something much bigger, while still keeping the work local.",
    highlight: "Led collaboration with visiting delegates and regional partners."
  }
];

export const articles: ArticleItem[] = [
  {
    title: "Why young leaders in Bangkok need practice, not just inspiration",
    slug: "why-young-leaders-need-practice",
    category: "Knowledge Article",
    publishedAt: "June 4, 2026",
    author: "JCI Bangkok Editorial Team",
    summary:
      "A perspective on building confidence through committees, projects, and public-facing responsibility."
  },
  {
    title: "Inside Community Action Day: what local impact looked like on the ground",
    slug: "inside-community-action-day",
    category: "Event Recap",
    publishedAt: "May 18, 2026",
    author: "Projects Committee",
    summary:
      "A recap of how local partners and members worked together on a focused district initiative."
  },
  {
    title: "A new chapter year with a global mission and a Bangkok mindset",
    slug: "new-chapter-year-global-mission-bangkok-mindset",
    category: "President Message",
    publishedAt: "January 15, 2026",
    author: "2026 Local President",
    summary:
      "A message about turning the JCI mission into grounded local opportunities for young active citizens."
  }
];

export const boardYears: BoardYear[] = [
  {
    year: "2026",
    theme: "Lead forward, build local trust.",
    president: "Pimnara L.",
    summary:
      "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok.",
    members: [
      {
        name: "Pimnara L.",
        role: "Local President",
        company: "Strategy and partnerships",
        bio: "Leads the yearly chapter direction, external relations, and board alignment."
      },
      {
        name: "Thanawat C.",
        role: "Executive Vice President",
        company: "Operations",
        bio: "Coordinates chapter execution across committees and annual goals."
      },
      {
        name: "Kanya R.",
        role: "Vice President for Membership",
        company: "People and culture",
        bio: "Drives member journey, onboarding, and retention across the chapter."
      },
      {
        name: "Michele A.",
        role: "Vice President for Projects",
        company: "Community programs",
        bio: "Oversees project design, implementation, and partner coordination."
      }
    ]
  },
  {
    year: "2025",
    theme: "Action that connects.",
    president: "Napat V.",
    summary:
      "A year centered on visible programming, stronger event cadence, and rebuilding chapter momentum.",
    members: [
      {
        name: "Napat V.",
        role: "Local President",
        company: "Business development",
        bio: "Set the yearly strategy and represented the chapter nationally."
      },
      {
        name: "Lisa H.",
        role: "Secretary General",
        company: "Administration",
        bio: "Managed governance, communication flow, and operational continuity."
      },
      {
        name: "Arthit S.",
        role: "Vice President for Events",
        company: "Program design",
        bio: "Led the event calendar across training, networking, and community formats."
      }
    ]
  }
];

export const partners = [
  "JCI Thailand",
  "Community Foundations",
  "University Partners",
  "Embassy Networks",
  "Social Enterprises",
  "Corporate Sponsors"
];

export const siteCopy = {
  title: "JCI Bangkok",
  description:
    "A Bangkok-based local chapter of JCI Thailand developing young leaders through training, entrepreneurship, international cooperation, and community impact."
};

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getBoardYear(year: string) {
  return boardYears.find((entry) => entry.year === year);
}
