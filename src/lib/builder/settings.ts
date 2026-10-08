import { getPayload } from 'payload';
import config from '@/payload.config';
import { enabledPluginIds } from './plugin-catalog';
import { cache } from 'react';

export const getBuilderSettings = cache(async () => {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'builder-settings' });
  return { enabledPlugins: enabledPluginIds((settings.plugins || []).map(plugin => ({ pluginId: plugin.pluginId, enabled: plugin.enabled !== false }))) };
});
