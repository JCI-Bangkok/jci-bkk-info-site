# CMS page management

## Where editors work

- **Website content → Pages** manages the page list, public URL, page purpose, publish status, visual layout, localized content, SEO and social sharing.
- **Website content → Navigation** manages the header/footer menu. Prefer a **CMS page** link so it follows future URL changes automatically. Use **Custom URL** for anchors, email, phone and external sites.
- **Design → Templates** manages shared layouts. Header and Footer templates can use the purpose-built **Site Header** and **Site Footer** blocks.
- **Design → Saved Sections** stores reusable builder sections.
- Events, Projects, Articles, Members and Board Members remain dedicated content collections; their listing pages are managed in Pages and their record layouts are managed in Templates.

## Page purpose and URL

`Page purpose` is the stable behavior of a page. `Slug` is its editable public URL without `/en` or `/th`.

For example, an About page can keep `Page purpose: About page` while its slug changes from `about` to `our-story`. The About data and fallback design stay connected, navigation relationships update automatically, and `/en/about` permanently redirects to `/en/our-story`.

Only one page may use each built-in purpose. Any number of Custom pages may be created.

## Migrated built-in purposes

- Home
- About
- Events
- Members
- Membership
- Contact
- PhotoBomb
- News
- Projects
- Board archive

Board-year pages, event details, project details and article details are generated from their corresponding content records and shared templates; they are not duplicated in Pages.

## Publishing safely

1. Edit the page and its English/Thai fields.
2. Set SEO in **SEO & social**.
3. Open the Visual Page Builder and save the layout.
4. Preview both languages and mobile/tablet widths.
5. Publish the page.
6. If changing a slug, verify the old address redirects and any deliberately custom navigation URLs are still correct.

## Editing legacy dynamic functions

Migrated pages contain `Legacy Dynamic Function` blocks. These are safe visual-builder adapters around the reviewed application functions: editors can choose the function, reorder it, change its section title and introduction, or hide it without editing deploy-time TypeScript.

Use the `Dynamic Code — HTML / CSS / JS` block when a page needs custom markup, styling or browser behavior. It provides code, live and split views with CMS bindings and a sandboxed preview. Do not paste application/server code into it; server data access, forms and security-sensitive behavior belong in a reviewed plugin or dynamic function adapter.
# Legacy design parity repair

The generated migration layouts were incomplete. Managed Pages and starter Templates now use the **Original Page Design** (`LegacyPage`) block, which renders the original page code preserved from Git commit `8410ea1` in `src/components/legacy-pages/`. CMS records still control slugs, SEO, publication, layout order, and visibility; content queries and forms remain live.

The visual editor previews this block through an authenticated server preview. Public pages render the original React layout directly, including images, galleries, membership forms, filters, breadcrumbs, and structured data.

This block preserves the complete original design as one block. Its internal sections and TypeScript functions are not individually editable in the visual editor yet. Custom HTML/CSS/JavaScript belongs in Dynamic Code; migrating a legacy section to editable properties must reuse its original markup and behavior before replacing it.

`scripts/repair-legacy-layouts.ts` defaults to a dry run. `--apply` repairs only recognized generated migration records and keeps Payload revisions. The original News, Projects, and Board archive redirects are also preserved.
