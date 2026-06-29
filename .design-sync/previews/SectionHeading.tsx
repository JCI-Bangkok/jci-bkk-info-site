import { SectionHeading } from 'jci-bkk-info-site';

export function WithAside() {
  return (
    <div className="p-8 bg-white">
      <SectionHeading
        title="Upcoming Events"
        description="Join us at our next leadership workshops, networking nights, and community projects across Bangkok."
        aside={<a href="#" className="button-secondary">View all events →</a>}
      />
    </div>
  );
}

export function WithoutAside() {
  return (
    <div className="p-8 bg-white">
      <SectionHeading
        title="Our Projects"
        description="From environmental initiatives to youth development programmes, see how our members are creating change in Bangkok and beyond."
      />
    </div>
  );
}

export function LongTitle() {
  return (
    <div className="p-8 bg-white">
      <SectionHeading
        title="Board Members & Leadership Team"
        description="Meet the 2026 JCI Bangkok board — 18 young professionals steering our chapter's strategy, partnerships, and impact programmes."
        aside={<span className="section-label">2026 Board</span>}
      />
    </div>
  );
}
