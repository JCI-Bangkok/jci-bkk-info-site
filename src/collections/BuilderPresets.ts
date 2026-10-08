import type { CollectionConfig } from 'payload';
import { canEditContent } from './hooks/editorial';
import { validateBuilderLayout } from '@/lib/builder/layout-utils';

export const BuilderPresets: CollectionConfig = {
  slug: 'builder-presets', labels: { singular: 'Saved Section', plural: 'Saved Sections' },
  admin: { group: 'Design', useAsTitle: 'title', description: 'Reusable copies of sections or layouts. Insertions are independent copies, not linked global components.' },
  access: { read: canEditContent, create: canEditContent, update: canEditContent, delete: canEditContent },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'puckLayout', type: 'json', required: true, validate: (value: unknown) => { try { validateBuilderLayout(value); return true; } catch (error) { return error instanceof Error ? error.message : 'Invalid layout'; } } },
  ],
};
