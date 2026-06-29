import { CtaBanner } from 'jci-bkk-info-site';

export function WithSecondary() {
  return (
    <CtaBanner
      title="Ready to make a difference?"
      description="Join Bangkok's most active young professionals network. Build leadership, create real-world impact, and connect globally."
      primaryHref="/membership"
      primaryLabel="Become a member"
      secondaryHref="/about"
      secondaryLabel="Learn more"
    />
  );
}

export function PrimaryOnly() {
  return (
    <CtaBanner
      title="Connect. Lead. Create change."
      description="JCI Bangkok brings together young active citizens who want to grow as leaders and give back to their community."
      primaryHref="/join"
      primaryLabel="Join JCI Bangkok"
    />
  );
}
