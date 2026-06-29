# JCI Bangkok Design System — Conventions

## Components are standalone

No provider wrapper is needed. Each component is self-contained and can be mounted at the top level of any design.

## Styling idiom

Tailwind v4 utility classes + CSS custom property tokens. The canonical tokens are:

| Token | Value | Usage |
|---|---|---|
| `--jci-blue` | `#0097d7` | brand accent, buttons, labels |
| `--jci-black` | `#130f2d` | primary text, dark backgrounds |
| `--ink` | `#1a1a2e` | body text |
| `--muted` | `#6b7694` | secondary / supporting text |
| `--line` | `#e5e8f0` | dividers, borders |
| `--paper` | `#f5f7fc` | page background |
| `--paper-soft` | `#eef2fb` | soft panel backgrounds |
| `--font-body` | Plus Jakarta Sans | body copy, UI labels |
| `--font-accent` | Arvo | display headings |

## Utility classes

These project-level classes are available alongside Tailwind utilities:

- `.button-primary` — filled JCI-blue pill button with white text
- `.button-secondary` — outlined pill button, transparent background
- `.section-label` — small uppercase tracked label in JCI blue
- `.paper-frame` — rounded card with border and paper background
- `.soft-panel` — rounded card with `--paper-soft` background, no border
- `.section-space` — standard vertical section padding

## Usage example

```tsx
// Section with a label, heading, and CTA aside
<SectionHeading
  title="Our Programmes"
  description="Leadership, community, and international exchange — built for young professionals in Bangkok."
  aside={
    <a href="/programmes" className="button-secondary">
      View all
    </a>
  }
/>
```

`SectionHeading` renders in `cardMode: column` — the aside stacks below the heading rather than beside it, so wide aside content (buttons, badges) doesn't overflow the grid cell.
