"use client";
import type { ReactNode } from 'react';
import { blockStyleCSS, type BlockStyle } from '@/lib/builder/styles';

export function StyledBlock({ id, style, children }: { id: string; style?: BlockStyle; children: ReactNode }) {
  if (!style || !Object.keys(style).length) return <>{children}</>;
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return <div data-builder-block={safeId} data-builder-motion={style.animation || 'none'}>
    <style>{blockStyleCSS(id, style)}{`@keyframes builder-fade{from{opacity:0}to{opacity:1}}@keyframes builder-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}[data-builder-motion="fade"]{animation:builder-fade .45s ease both}[data-builder-motion="rise"]{animation:builder-rise .45s ease both}@media(prefers-reduced-motion:reduce){[data-builder-motion]{animation:none!important}}`}</style>
    {children}
  </div>;
}
