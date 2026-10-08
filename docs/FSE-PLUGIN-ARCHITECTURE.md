# FSE plugin extension point

The first plugin system is implemented with a shared versioned registry, CMS activation settings, and saved-data recovery when a plugin is disabled or missing.

Each plugin should declare:

- a stable identifier and version;
- the Puck blocks it provides, including defaults and editor fields;
- its required CMS fields or collections and accompanying migration;
- a server-side renderer or action when it needs data or submission handling;
- a graceful fallback when the plugin is disabled or its data is absent.

Suggested first plugins are `forms` (form chooser, field blocks, submissions), `embeds` (approved YouTube, Facebook, Google Maps, and social embeds), `analytics` (consent-aware tracking blocks), and `campaigns` (UTM-aware CTA and landing-page blocks).

The Code Block displays code examples. Dynamic Code provides editable HTML, CSS, and JavaScript with a live preview, running in a sandboxed iframe with an opaque origin. It cannot access CMS cookies or the parent document, submit forms, or make network requests. CMS bindings interpolate escaped text values only. Do not relax the iframe's sandbox or add `allow-same-origin`.

The builder toolbar's Code / Live action edits the Puck layout JSON, including the properties of existing dynamic React blocks. React source still lives in the repository; the CMS does not compile or execute server code.

See [research and delivered features](VISUAL-BUILDER-RESEARCH.md) and the [plugin development standard](BUILDER-PLUGIN-DEVELOPMENT.md) for the actual manifest, registration, migrations, access rules, and release checks.

Manage installed packages in **Design → Builder Settings** or **Blocks / Library / Plugins** in the editor. The initial packages are Content Essentials, Interactive Content, Video Embeds, and Dynamic Code. Packages are reviewed repository code deployed with the application; server collections, globals, and actions remain explicitly registered in Payload.
