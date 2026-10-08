/** Metadata only: safe to import from Payload and browser code. */
export const BUILDER_API_VERSION = 1 as const
export const pluginCatalog = [
  { id: 'jci.content', name: 'Content Essentials', version: '1.0.0', description: 'Headings, rich text, cards, dividers, and spacers.', defaultEnabled: true },
  { id: 'jci.interactive', name: 'Interactive Content', version: '1.0.0', description: 'Accessible accordions and tabs.', defaultEnabled: true },
  { id: 'jci.embeds', name: 'Video Embeds', version: '1.0.0', description: 'YouTube and Vimeo video blocks.', defaultEnabled: true },
  { id: 'jci.code', name: 'Dynamic Code', version: '1.0.0', description: 'Sandboxed HTML, CSS, JavaScript, and code examples.', defaultEnabled: true },
] as const

export type PluginOverride = { pluginId: string; enabled: boolean }
export function enabledPluginIds(overrides: PluginOverride[] = []) {
  return pluginCatalog.filter(plugin => overrides.find(item => item.pluginId === plugin.id)?.enabled ?? plugin.defaultEnabled).map(plugin => plugin.id as string)
}
