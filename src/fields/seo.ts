import type { Field } from 'payload'
import { validateCanonical } from '@/lib/seo-model'

export function seoField(): Field {
  return {
    name: 'seo', label: 'Search & social sharing', type: 'group',
    admin: { description: 'English and Thai overrides. Empty fields inherit the content defaults shown in the live previews.' },
    fields: [
      { name: 'preview', type: 'ui', admin: { components: { Field: '/components/admin/SeoPreview#SeoPreview' } } },
      { name: 'title', label: 'Search title', type: 'text', localized: true, maxLength: 200, admin: { description: 'Aim for a clear, concise title. JCI Bangkok is appended automatically; search engines may choose a different title.' } },
      { name: 'description', label: 'Search description', type: 'textarea', localized: true, maxLength: 500, admin: { description: 'Summarize this page for visitors. Length guidance appears above; there is no guaranteed display limit.' } },
      { name: 'focusKeyphrase', label: 'Editorial focus phrase', type: 'text', localized: true, maxLength: 100, admin: { description: 'Used only for editorial guidance. It does not create a meta keywords tag or affect rankings directly.' } },
      { type: 'collapsible', label: 'Open Graph & social cards', fields: [
        { name: 'socialTitle', label: 'Social title', type: 'text', localized: true, maxLength: 200, admin: { description: 'Optional. Inherits the search title.' } },
        { name: 'socialDescription', label: 'Social description', type: 'textarea', localized: true, maxLength: 500, admin: { description: 'Optional. Inherits the search description.' } },
        { name: 'image', label: 'Social image', type: 'upload', relationTo: 'media', localized: true, filterOptions: { mimeType: { contains: 'image/' } }, admin: { description: 'Choose a sharp landscape image, ideally 1200 × 630. Falls back to the content image, then the site default.' } },
        { name: 'imageAlt', label: 'Social image description', type: 'text', localized: true, maxLength: 300 },
      ] },
      { type: 'collapsible', label: 'Advanced indexing controls', admin: { initCollapsed: true }, fields: [
        { name: 'canonicalUrl', label: 'Canonical URL override', type: 'text', localized: true, validate: validateCanonical, admin: { description: 'Normally leave empty. Use only when this page intentionally duplicates another URL. Overrides are excluded from the sitemap.' } },
        { name: 'noIndex', label: 'Ask search engines not to index this page', type: 'checkbox', defaultValue: false, admin: { description: 'Applies to both languages and removes the page from the sitemap. The page remains public.' } },
        { name: 'noFollow', label: 'Ask search engines not to follow links on this page', type: 'checkbox', defaultValue: false },
        { name: 'excludeFromSitemap', label: 'Exclude from sitemap', type: 'checkbox', defaultValue: false, admin: { description: 'Applies to both languages. This alone does not prevent indexing.' } },
      ] },
    ],
  }
}

export function editorialTabs(fields: Field[]): Field[] {
  return [{ type: 'tabs', tabs: [
    { label: 'Content', fields },
    { label: 'SEO & social', fields: [seoField()] },
  ] }]
}
