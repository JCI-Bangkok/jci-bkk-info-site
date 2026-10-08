import type { Config } from '@puckeditor/core';
import type { BuilderPlugin } from './plugin-types';

export function createPluginRegistry(core: Config['components'], plugins: BuilderPlugin[], enabled: string[]) {
  const owners = new Map<string, string>();
  const ids = new Set<string>();
  for (const key of Object.keys(core)) owners.set(key, 'core');
  for (const plugin of plugins) {
    if (ids.has(plugin.id)) throw new Error(`Duplicate plugin: ${plugin.id}`);
    ids.add(plugin.id);
    if (plugin.apiVersion !== 1) throw new Error(`Unsupported API for ${plugin.id}`);
    for (const key of Object.keys(plugin.components)) {
      if (owners.has(key)) throw new Error(`Component ${key} already registered by ${owners.get(key)}`);
      owners.set(key, plugin.id);
    }
  }
  for (const plugin of plugins) {
    if (!enabled.includes(plugin.id)) continue;
    for (const dependency of plugin.dependencies || []) {
      if (!ids.has(dependency) || !enabled.includes(dependency)) throw new Error(`Plugin ${plugin.id} needs enabled dependency ${dependency}`);
    }
  }
  return { owners, plugins, enabled: new Set(enabled), getEditorPlugins: () => plugins.filter(plugin => enabled.includes(plugin.id)).flatMap(plugin => plugin.editorPlugins || []) };
}
