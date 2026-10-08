import 'server-only';
import type { Data } from '@puckeditor/core';
import type { ReactNode } from 'react';
import { ClientPuckRenderer } from './ClientPuckRenderer';
import { renderLegacyPage } from '@/components/legacy-pages/render';

export { DocumentContext, useDocumentData } from './DocumentContext';

export async function PuckRenderer({ data, documentData }: { data: Data, documentData?: any }) {
  const legacyPages: Record<string, ReactNode> = {};
  for (const block of [...(data.content || []), ...Object.values(data.zones || {}).flat()]) {
    if (block.type === 'LegacyPage' && block.props.visible !== false) {
      const pageType = String(block.props.pageType);
      if (!(pageType in legacyPages)) legacyPages[pageType] = await renderLegacyPage(pageType, documentData);
    }
  }
  return <ClientPuckRenderer data={data} documentData={{ ...documentData, legacyPages }} />;
}
