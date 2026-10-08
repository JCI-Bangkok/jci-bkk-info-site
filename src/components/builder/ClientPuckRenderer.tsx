"use client";
import React from 'react';
import { Render, type Data } from '@puckeditor/core';
import { buildBuilderConfig, builderPlugins } from '@/lib/builder/config';
import { migrateBuilderPlugins } from '@/lib/builder/plugin-migrations';
import { DocumentContext } from './DocumentContext';
import { useBuilderRuntime } from './RuntimeProvider';

export function ClientPuckRenderer({ data, documentData }: { data: Data; documentData?: any }) {
  const runtime = useBuilderRuntime();
  const preparedData = migrateBuilderPlugins(data, builderPlugins, runtime.enabledPlugins);
  return <DocumentContext.Provider value={documentData || null}><Render config={buildBuilderConfig(runtime.enabledPlugins, preparedData, false)} data={preparedData} /></DocumentContext.Provider>;
}
