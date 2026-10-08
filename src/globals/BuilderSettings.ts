import type { GlobalConfig } from 'payload';
import { canEditContent, revalidateSettings } from '@/collections/hooks/editorial';
import { pluginCatalog } from '@/lib/builder/plugin-catalog';

export const BuilderSettings: GlobalConfig = {
  slug: 'builder-settings', label: 'Builder Settings',
  admin: { group: 'Design', description: 'Manage installed builder plugins. Changes affect the editor and website; existing block data is retained.' },
  access: { read: () => true, update: canEditContent },
  hooks: { afterChange: [revalidateSettings] },
  fields: [{ name: 'plugins', type: 'array', fields: [
    { name: 'pluginId', type: 'text', required: true, admin: { description: pluginCatalog.map(plugin => `${plugin.id}: ${plugin.name}`).join('; ') }, validate: (value: unknown) => typeof value === 'string' && pluginCatalog.some(plugin => plugin.id === value) || 'Choose an installed plugin ID.' },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
  ], validate: (value: unknown) => {
    if (!Array.isArray(value)) return true;
    const ids = value.map(item => item.pluginId);
    return new Set(ids).size === ids.length || 'Each plugin can have only one setting.';
  } }],
};
