# Builder plugin development standard

Builder API **1**, initial plugin version **1.0.0**. This is the application's API on top of Puck, not the WordPress plugin API. Optional widgets belong in registered plugins; core layout and current CMS detail blocks remain stable.

## Installed packages

| ID | Blocks | Default |
| --- | --- | --- |
| `jci.content` | Heading, RichTextBlock, Card, Spacer, Divider | Enabled |
| `jci.interactive` | Accordion, Tabs | Enabled |
| `jci.embeds` | VideoEmbed | Enabled |
| `jci.code` | DynamicCode, CodeBlock | Enabled |

## Architecture and files

`plugin-catalog.ts` is serializable metadata shared by CMS and browser. `config.tsx` registers reviewed component packages. `plugin-registry.ts` checks ownership, duplicate IDs/names, API compatibility, and dependencies. A shared config factory supplies editor and public rendering. `plugin-migrations.ts` handles layout upgrades. Paths below are relative to `src/lib/builder`.

Recommended package:

```text
plugins/announcement/
  index.tsx       # client manifest and components
  model.ts        # pure schema validation and transformations
  styles.css      # optional namespaced styles
  README.md       # usage, data requirements, accessibility, upgrades
```

Payload collections/globals, actions, credentials, and API integrations belong in separate server modules. Register them explicitly in Payload or server routes; a client manifest does not dynamically provision database tables or execute server hooks.

## Manifest contract

Required fields: `id`, `name`, `version`, `apiVersion`, `description`, `category`, `components`. IDs use a namespace such as `chapter.announcement`. Versions are numeric `major.minor.patch`. New component keys start with an uppercase letter and should use a vendor prefix, for example `ChapterAnnouncement`. Persisted component keys must stay stable.

Optional fields:

- `dependencies`: IDs that must be installed and enabled; unsatisfied dependencies fail clearly during config construction.
- `editorPlugins`: Puck extensions for panels, overrides, or field transforms, loaded for enabled packages.
- `migrate(layout, fromVersion)`: pure transformation of old layout data, preserving IDs, zone ownership, and unrelated data.

```tsx
"use client";
import type { Config } from '@puckeditor/core';
import { defineBuilderPlugin } from '@/lib/builder/plugin-types';

const components: Config['components'] = {
  ChapterAnnouncement: {
    label: 'Chapter announcement',
    fields: {
      title: { type: 'text' },
      message: { type: 'textarea' },
    },
    defaultProps: {
      title: 'Latest from the chapter',
      message: 'Add an announcement here.',
    },
    render: ({ title, message }) => (
      <aside className="chapter-announcement rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 whitespace-pre-line leading-7">{message}</p>
      </aside>
    ),
  },
};

export const announcementPlugin = defineBuilderPlugin({
  id: 'chapter.announcement',
  name: 'Chapter Announcements',
  version: '1.0.0',
  apiVersion: 1,
  description: 'Reusable chapter announcements.',
  category: 'Chapter Content',
  components,
});
```

## Installation

1. Implement the package using `defineBuilderPlugin`.
2. Import the manifest in `config.tsx` and add it to `builderPlugins`.
3. Add matching metadata to `pluginCatalog` in `plugin-catalog.ts`.
4. Optionally add bindable text-property names to the `bindings` map. Appearance controls are automatically added to every enabled block.
5. Explicitly register any server configuration and include an additive migration. Generate Payload types and apply the migration before deploying consumers of the new tables.
6. Run the release checks and deploy through the normal project workflow.
7. Manage activation in **Design → Builder Settings** or the editor's Plugins tab.

Installation is build-time: reviewed repository code ships with the app. CMS settings store activation and content, not executable bundles. There is no external upload-and-run marketplace in v1.

## Lifecycle and recoverability

The editor and frontend use the same enabled plugin IDs. Root `pluginVersions` records data versions, with legacy layouts starting at `0.0.0`. Enabled plugins upgrade data in memory; a draft save or publish persists the upgraded layout. Viewing the website does not write to the database.

Disabled blocks are removed from the insert palette, retain their original props/zones, and show editor placeholders. Their public output is omitted. Unknown blocks already in saved layouts receive missing-plugin placeholders. Re-enabling or restoring the compatible package recovers output. A toggle must never drop a collection or delete content.

Data from a newer package version is rejected rather than silently downgraded. Test rollback with real saved layouts. Disable a package before removing code; restore the package to recover existing instances. React render errors are isolated by a block boundary in the browser; schema/defaults must still prevent errors during server rendering.

## Controls, layouts, and styling

Use Puck field definitions. Defaults must be complete and JSON-serializable. Custom fields honor `readOnly`, emit a new value via `onChange`, and use named React components for hooks.

For nested content, use the existing `puck.renderDropZone` format. Zones are owned by a block: `blockId:zone-name`. Section extraction includes descendants; insertion generates fresh IDs and remaps zone owners. Do not introduce nested props-based Slots until extraction, import/export, validation, and migrations support them.

Verify at 390px, 820px, and desktop. Style inheritance is desktop → tablet (≤1023px) → mobile (≤767px). Blank overrides inherit; numeric zero remains explicit. Honor reduced motion. Namespace CSS and avoid global body/editor selectors. Keep reusable sections as copies; linked global definitions need a separate reference model.

## CMS data and localization

`useDocumentData` from `components/builder/DocumentContext` provides public data prepared by the server route. Handle empty collections, absent relationships, and unpopulated media. Add public and editor-preview data sources together when introducing a new dynamic source.

Generic bindings read own properties by dot path, reject prototype traversal, and accept scalar values. Missing values use static fallback text. Render bound strings as React text. Validate links with `safeBuilderHref` or a provider parser; a bound string never authorizes raw HTML.

Use `currentLocale` for English/Thai output. CMS layouts are shared across locales in v1; localized data supplies language-specific values. Independently localized layout trees are deferred.

## Security and access

Activation and saved-section writes use Payload `canEditContent`. The builder route permits authenticated non-viewer users and only the `pages`/`templates` collections. Saved sections are not publicly readable. Client controls never replace server access checks.

Rich text uses `sanitizeBuilderRichText` to remove unsafe markup and schemes. Dynamic Code uses an opaque-origin `sandbox="allow-scripts"` iframe whose CSP blocks network requests and form submissions. Do not grant `allow-same-origin`, parent DOM access, or server execution of editor-entered JavaScript. Video URLs are provider-allowlisted.

Layouts are checked server-side for structure, unique IDs, semantic version metadata, Dynamic Code data shape, ≤1,000 blocks, and ≤2 MB. Unknown block names stay recoverable. Plugins must additionally validate their own field values at render time; JSON persistence is not proof of valid props.

## Versioning and migrations

Patch: compatible fixes. Minor: additional fields with defaults. Major: persisted behavior changes requiring migration and rollback planning. Never rename stored keys without a migration.

```ts
migrate: (layout, fromVersion) => {
  // This example assumes all supported old versions used `heading`.
  // Branch on fromVersion when supporting multiple older schemas.
  for (const block of [
    ...layout.content,
    ...Object.values(layout.zones || {}).flat(),
  ]) {
    if (block.type === 'ChapterAnnouncement' && !block.props.title) {
      block.props.title = block.props.heading || 'Chapter announcement';
      delete block.props.heading;
    }
  }
  return layout;
}
```

The runner clones the input before migration and validates the result. Migrations must leave unrelated plugin metadata/content intact and preserve stable IDs. No remote calls or database writes inside a client layout migration.

## Release standard

Run `npm run check:builder`, `npx tsc --noEmit`, focused ESLint, and `npm run build` with database connectivity. Add meaningful checks for custom schema changes, URL parsing, or access behavior.

`npm run check:builder:cms` verifies the actual configured database by creating, reading, updating, and removing its own temporary section record. It does not modify existing saved sections. Run it only against a database where this verification is authorized.

Verify empty data, keyboard use, all preview widths, draft/publish/reload, nested section reuse, import/export, disable/re-enable, and layouts from the prior version. Plugin toggles are site-wide immediate settings; content follows draft/publish. Server schema changes must include migration and generated types.

## Next extension areas

Membership forms, galleries, consent-aware analytics, and approved social embeds fit the plugin model. Shared token collections, linked global components, visual display conditions, scroll timelines, dependency-management UI, and a marketplace need separate lifecycle design.

References: [Webflow props/slots](https://developers.webflow.com/devlink/docs/component-export/design-guidelines/props-slots), [Elementor widgets](https://developers.elementor.com/docs/widgets/), [Puck rich-text fields](https://puckeditor.com/docs/api-reference/fields/richtext).
