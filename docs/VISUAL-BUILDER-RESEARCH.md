# Visual builder research and first implementation

Researched on 8 October 2026 using official product and developer documentation. This is a feature comparison, not a claim of Webflow or Elementor compatibility. Availability varies by product version and plan.

## Findings

Webflow's components combine reusable structure, styling, and motion, configurable through properties, slots, and variants. Updates to shared definitions reach their instances. We adopted controlled composition; linked global instances are a later stage. Source: [Webflow components](https://webflow.com/webflow-way/design-systems/components).

Webflow separates responsive styles from content and hierarchy edits. Its breakpoint inheritance informed our desktop → tablet → mobile overrides, with thresholds matching this site's layouts. Source: [Webflow breakpoints](https://help.webflow.com/hc/en-us/articles/33961300305811-Breakpoints-overview).

Elementor provides device-specific editing, a tree to locate nested elements, and a library for reusable page/container templates. Its widget API separates identity, controls, and frontend output. These informed our style controls, section library, and plugin contract. Sources: [responsive editing](https://elementor.com/help/responsive-editing/), [Structure panel](https://elementor.com/help/navigator/), [template library](https://elementor.com/help/create-templates-for-faster-website-building/), [widget API](https://developers.elementor.com/docs/widgets/).

## Feature comparison and delivered scope

| Capability | Implementation here | Status |
| --- | --- | --- |
| Canvas and nested structure | Existing Puck drag/drop and outline; Sections, Columns, Card content zones | Available |
| Responsive previews | Desktop 1280px, tablet 820px, mobile 390px | Added |
| Responsive styles | Padding, margin, font size, alignment, visibility; inherited device overrides | Added |
| Appearance controls | Background, text color, border, radius, max width | Added |
| Style reuse | Copy, paste, and reset selected-block appearance | Added |
| Design values | Site CSS variables and page accent/background | Available; complete token manager deferred |
| CMS property bindings | Scalar data paths for supported text/image/link properties; static fallback | Added |
| Rich text | Formatting toolbar, lists, links; sanitized HTML | Added |
| Common widgets | Heading, rich text, card, divider, spacer, accordion, tabs, video | Added |
| Reusable sections | CMS-backed selected-section/whole-layout library; fresh IDs on insertion | Added |
| Starter sections | Chapter introduction, two opportunity cards, FAQ | Added |
| Portability | JSON export/import; validated imports append to current content | Added |
| History | Puck undo/redo, also exposed in toolbar | Available |
| Draft/publish | Payload save and publish with error feedback | Available |
| Entrance motion | Fade and rise; reduced-motion support | Added |
| Code/live views | Layout JSON and sandboxed HTML/CSS/JS custom blocks | Available |
| Add-on system | Versioned manifests, dependency/collision checks, CMS activation | Added |
| Linked global components | Shared definitions update all instances | Deferred; saved-section insertions are copies |
| Advanced display conditions | Route-, taxonomy-, or audience-specific rules | Deferred; template-type routing retained |
| Animation timelines | Scroll-triggered choreography and timeline editing | Deferred |
| External marketplace | Arbitrary plugin bundle upload/install | Deferred; reviewed packages ship with application code |
| Collaboration / AI / commerce | Multi-user reviews, generated designs, checkout | Deferred |

## Editor workflow

1. Open a page/template's visual editor.
2. Use **Blocks / Library / Plugins** to search blocks or insert starter/saved sections.
3. Select a block to edit content, optional **CMS bindings**, and **Appearance**.
4. Set desktop styles, then tablet/mobile overrides. A blank field inherits; zero is explicit.
5. Use Page fields for accent/background. Color fields accept hex colors or site variables such as `var(--jci-blue)`.
6. Save a selected block with its nested zones to the CMS library. Every insertion is an independent copy.
7. Save Draft, preview, then publish.

Plugin activation is site-wide and saved immediately, separately from page drafts. Disabled plugin output is omitted publicly; the editor shows a recoverable placeholder and retains the original data.

## Limits of the first version

Typed appearance values are bounded; arbitrary CSS belongs in sandboxed Dynamic Code. CMS bindings read data supplied by server routes rather than issuing unrestricted queries. Entrance motion runs on render, not scroll thresholds. Existing drop-zone serialization is supported; nested props-based Slots need an explicit serializer extension before adoption. Page layouts remain shared across locales, with localized values supplied through CMS bindings.

See [plugin development standard](BUILDER-PLUGIN-DEVELOPMENT.md).
