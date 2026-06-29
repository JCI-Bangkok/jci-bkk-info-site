import { BrandMark } from 'jci-bkk-info-site';

// Use an inline SVG data URL so the preview doesn't depend on the Next.js dev server
const logoDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 176 64'%3E%3Crect width='176' height='64' fill='none'/%3E%3Ctext x='8' y='42' font-family='sans-serif' font-weight='700' font-size='32' fill='%230097d7'%3EJCI%3C/text%3E%3Ctext x='52' y='42' font-family='sans-serif' font-weight='400' font-size='20' fill='%231f4789'%3E Bangkok%3C/text%3E%3C/svg%3E";

export function EnglishLocale() {
  return (
    <div className="p-6 bg-[var(--paper-soft)]">
      <BrandMark locale="en" logoUrl={logoDataUrl} />
    </div>
  );
}

export function ThaiLocale() {
  return (
    <div className="p-6 bg-[var(--paper-soft)]">
      <BrandMark locale="th" logoUrl={logoDataUrl} />
    </div>
  );
}

export function OnDarkBackground() {
  return (
    <div className="p-6 bg-[var(--jci-black)]">
      <BrandMark locale="en" logoUrl={logoDataUrl} />
    </div>
  );
}
