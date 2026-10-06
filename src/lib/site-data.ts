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
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "/photobomb", label: "PhotoBomb" },
  { href: "/about", label: "About" },
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
    title: "ENTREPRENEUR CLUB 7: YOUNG TO YAK",
    slug: "entrepreneur-club-7-young-to-yak",
    type: "Training",
    date: "August 23, 2026",
    venue: "Formosa Potetato (MRT Phetchaburi)",
    status: "Upcoming",
    summary: "Hands-on Salepage workshop: Design and build your sales landing page with AI, including domain setup and Q&A.",
    highlight: "Learn from Khun Poon Pakpoom, Construction Brain AI Agent Builder at Homitage Co.,Ltd. Includes lunch and roundtable session."
  },
  {
    title: "ENTREPRENEUR CLUB 8: LECTURE BAR",
    slug: "entrepreneur-club-8-lecture-bar",
    type: "Networking",
    date: "September 26, 2026",
    venue: "YELLOW CLOUD CRAFT BEER & BOTTLE SHOP",
    status: "Upcoming",
    summary: "A unique lecture bar experience exploring unexpected business risks (Risk Management You Wish You Knew) with industry experts.",
    highlight: "Featuring Khun Peemai and a panel of experts in a casual bar setting. Limited to 30 seats."
  },
  {
    title: "JCI TOYP 2026: HUMAN ADVANTAGE IN THE AI ERA",
    slug: "jci-toyp-2026",
    type: "Networking",
    date: "October 31, 2026",
    venue: "UTCC อาคาร 5 ชั้น 2 ห้อง 5201",
    status: "Upcoming",
    summary: "Ten Outstanding Young Persons 2026 awards. Discover the Human Advantage in the AI Era: Intelligence, Resilience, Inclusion.",
    highlight: "Meet the 10 outstanding young leaders of 2026 at the University of the Thai Chamber of Commerce."
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
    theme: "Young to Yak - 12 years JCI Bangkok",
    president: "Nattapat Channgarm",
    summary: "Yak Board of Directors",
    members: [
      { name: "Nattapat Channgarm", role: "Local President", company: "", bio: "" },
      { name: "Witchaya Wongwai", role: "Immediate Past President", company: "", bio: "" },
      { name: "Sirinapa Taweepongpinyo", role: "Secretary General", company: "", bio: "" },
      { name: "Krittapas Numnam", role: "Treasurer", company: "", bio: "" },
      { name: "Apichaya Yenjai", role: "VP Business & Entrepreneurship", company: "", bio: "" },
      { name: "Putthipat Lapatphumpat", role: "VP Business & Entrepreneurship", company: "", bio: "" },
      { name: "Bhumphuree Loakhajorn", role: "VP Membership", company: "", bio: "" },
      { name: "Nathachon Tachapisitpong", role: "VP Data Intelligence", company: "", bio: "" },
      { name: "Krit Buaprasert", role: "VP Training & Development", company: "", bio: "" },
      { name: "Piriyapol Prasankh", role: "VP Project", company: "", bio: "" },
      { name: "Nontatat Lekhyananda", role: "VP Partnership", company: "", bio: "" },
      { name: "Sitthiphon Thittitham", role: "VP International Affairs", company: "", bio: "" },
      { name: "Jeerameth Klomsing", role: "VP Europe", company: "", bio: "" },
      { name: "Ponpitcha Charnchaleo", role: "Director Membership", company: "", bio: "" },
      { name: "Pipooh Boonsombat", role: "Director International Affairs", company: "", bio: "" },
      { name: "Yanathip Bhoosawang", role: "Director", company: "", bio: "" },
      { name: "Pakpoom Watcharapipatpant", role: "Director", company: "", bio: "" },
      { name: "Khin La Woon", role: "Secretary Officer", company: "", bio: "" },
      { name: "Saridta Chaiwan", role: "Secretary Officer", company: "", bio: "" }
    ]
  },
  {
    year: "2025",
    theme: "Connect Them All",
    president: "Napat V.",
    summary:
      "A year centered on visible programming, stronger event cadence, and rebuilding chapter momentum.",
    members: [
      { name: "Witchaya Wongwai", role: "Local President", company: "", bio: "" },
      { name: "Akkaranand Akesirinararwich", role: "Immediate Past President", company: "", bio: "" },
      { name: "Nattapat Channgarm", role: "Secretary", company: "", bio: "" },
      { name: "Nathachon Tachapisitpong", role: "Treasurer", company: "", bio: "" },
      { name: "Sirinapa Taweepongpinyo", role: "VP Membership", company: "", bio: "" },
      { name: "Bhumphuree Loakhajorn", role: "VP International Affairs", company: "", bio: "" },
      { name: "Jeerameth Klomsing", role: "VP Project", company: "", bio: "" },
      { name: "Apichaya Yenjai", role: "VP Marketing", company: "", bio: "" },
      { name: "Krittapas Numnam", role: "Director International Affairs", company: "", bio: "" },
      { name: "Yanatib Bhoosawang", role: "Director Project", company: "", bio: "" },
      { name: "Chavangkon Kanjanakuldit", role: "Director Membership", company: "", bio: "" },
      { name: "Putthipat Lapatphumipat", role: "Director International Affairs", company: "", bio: "" },
      { name: "Piriyapol Prasankliew", role: "Director International Affairs", company: "", bio: "" }
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
