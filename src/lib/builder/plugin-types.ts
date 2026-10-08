import type { ComponentConfig, Data } from '@puckeditor/core'
import type { Plugin as PuckPlugin } from '@puckeditor/core'

export interface BuilderPlugin {
  id: string
  name: string
  version: string
  apiVersion: 1
  description: string
  category: string
  dependencies?: string[]
  /** Persistent block names are stable, even if a plugin is disabled. */
  components: Record<string, ComponentConfig<any>>
  /** Optional Puck editor extensions (panels, overrides, and field transforms). */
  editorPlugins?: PuckPlugin[]
  /** Pure upgrade; must preserve IDs and leave the input untouched. */
  migrate?: (layout: Data, fromVersion: string) => Data
}

export function defineBuilderPlugin(plugin: BuilderPlugin): BuilderPlugin {
  if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9-]*)+$/.test(plugin.id)) throw new Error(`Invalid plugin ID: ${plugin.id}`)
  if (!/^\d+\.\d+\.\d+$/.test(plugin.version)) throw new Error(`Invalid plugin version: ${plugin.version}`)
  if (plugin.apiVersion !== 1) throw new Error(`Unsupported builder API version: ${plugin.apiVersion}`)
  if (!Object.keys(plugin.components).length) throw new Error(`Plugin ${plugin.id} must register a component.`)
  for (const name of Object.keys(plugin.components)) {
    if (!/^[A-Z][A-Za-z0-9_-]*$/.test(name)) throw new Error(`Invalid persistent component name: ${name}`)
  }
  return plugin
}
