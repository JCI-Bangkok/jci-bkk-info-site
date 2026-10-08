"use client";

import React from 'react';
import { Render, type Data } from "@puckeditor/core";
import { buildBuilderConfig, builderPlugins } from "@/lib/builder/config";
import { migrateBuilderPlugins } from '@/lib/builder/plugin-migrations';
import { DocumentContext } from './DocumentContext';
import { useBuilderRuntime } from './RuntimeProvider';

export { DocumentContext, useDocumentData } from './DocumentContext';

export function PuckRenderer({ data, documentData }: { data: Data, documentData?: any }) {
  const runtime = useBuilderRuntime();
  const preparedData = migrateBuilderPlugins(data, builderPlugins, runtime.enabledPlugins);
  const config = buildBuilderConfig(runtime.enabledPlugins, preparedData, false);
  return (
    <DocumentContext.Provider value={documentData || null}>
      <Render config={config} data={preparedData} />
    </DocumentContext.Provider>
  );
}
