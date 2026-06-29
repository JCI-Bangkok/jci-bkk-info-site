import { PageIntro } from 'jci-bkk-info-site';

export function Default() {
  return (
    <PageIntro
      title="Events & Programmes"
      lead="Connect with Bangkok's most active young professionals network. From leadership workshops to international exchanges, every event is a chance to grow."
    />
  );
}

export function WithAside() {
  return (
    <PageIntro
      title="Membership"
      lead="Join over 300 young active citizens building leadership, business opportunity, and community impact in Bangkok."
      aside={
        <div className="space-y-3">
          <p className="section-label">2026 Applications</p>
          <p className="text-2xl font-semibold text-[var(--ink)]">Open now</p>
          <a href="#" className="button-primary inline-flex">Apply today</a>
        </div>
      }
    />
  );
}

export function AboutPage() {
  return (
    <PageIntro
      title="About JCI Bangkok"
      lead="A local chapter of Junior Chamber International — the world's largest network of young active citizens, present in over 100 countries."
    />
  );
}
