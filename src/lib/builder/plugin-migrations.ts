import type { Data } from '@puckeditor/core';
import type { BuilderPlugin } from './plugin-types';
import { validateBuilderLayout } from './layout-utils';

function compareVersions(a: string, b: string) {
  const left = a.split('.').map(Number), right = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) { if (left[i] !== right[i]) return left[i] - right[i]; }
  return 0;
}

export function migrateBuilderPlugins(layout: Data, plugins: BuilderPlugin[], enabled: string[]): Data {
  let next = structuredClone(layout);
  const rootProps = next.root?.props as Record<string, unknown> | undefined;
  const versions: Record<string, string> = { ...(rootProps?.pluginVersions as Record<string, string> || {}) };
  for (const plugin of plugins) {
    if (!enabled.includes(plugin.id)) continue;
    const previous = versions[plugin.id] || '0.0.0';
    // Never reinterpret data written by a newer plugin after a rollback.
    if (compareVersions(previous, plugin.version) > 0) throw new Error(`${plugin.name} data requires v${previous}; installed version is v${plugin.version}.`);
    if (previous !== plugin.version && plugin.migrate) {
      next = plugin.migrate(next, previous);
      validateBuilderLayout(next);
    }
    versions[plugin.id] = plugin.version;
  }
  return { ...next, root: { ...next.root, props: { ...next.root.props, pluginVersions: versions } } } as Data;
}
