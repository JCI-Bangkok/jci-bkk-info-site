"use client";
import { createContext, useContext, type ReactNode } from 'react';
import { enabledPluginIds } from '@/lib/builder/plugin-catalog';

export type BuilderRuntime = { enabledPlugins: string[] };
const RuntimeContext = createContext<BuilderRuntime>({ enabledPlugins: enabledPluginIds() });
export function BuilderRuntimeProvider({ enabledPlugins, children }: BuilderRuntime & { children: ReactNode }) {
  return <RuntimeContext.Provider value={{ enabledPlugins }}>{children}</RuntimeContext.Provider>;
}
export function useBuilderRuntime() { return useContext(RuntimeContext); }
