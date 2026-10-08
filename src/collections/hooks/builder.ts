import type { CollectionBeforeChangeHook } from 'payload';
import { validateBuilderLayout } from '@/lib/builder/layout-utils';

export const validatePuckLayout: CollectionBeforeChangeHook = ({ data }) => {
  if (data.puckLayout) validateBuilderLayout(data.puckLayout);
  return data;
};

export async function revalidateBuilderTemplates({ doc }: { doc: any }) {
  const { safeRevalidate } = await import('./revalidate');
  for (const locale of ['en', 'th']) await safeRevalidate(`/${locale}`);
  return doc;
}
