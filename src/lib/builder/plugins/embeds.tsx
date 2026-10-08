"use client";
import { defineBuilderPlugin } from '../plugin-types';

export function videoEmbedURL(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    if (['www.youtube.com', 'youtube.com'].includes(url.hostname)) id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] || null;
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (['vimeo.com', 'www.vimeo.com'].includes(url.hostname) && /^\/\d+$/.test(url.pathname)) return `https://player.vimeo.com/video/${url.pathname.slice(1)}?dnt=1`;
  } catch { /* Editors may be in the middle of entering a URL. */ }
  return null;
}
export const embedsPlugin = defineBuilderPlugin({ id: 'jci.embeds', name: 'Video Embeds', version: '1.0.0', apiVersion: 1, category: 'Media & Embeds', description: 'Privacy-friendly YouTube and Vimeo URLs.', components: {
  VideoEmbed: { label: 'Video embed', fields: { url: { type: 'text' }, title: { type: 'text' } }, defaultProps: { url: '', title: 'Chapter video' }, render: ({ url, title }) => {
    const src = videoEmbedURL(url);
    return src ? <iframe src={src} title={title || 'Video'} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-xl border-0" /> : <div className="rounded-xl border border-dashed p-8 text-center text-sm text-[var(--muted)]">Enter a valid HTTPS YouTube or Vimeo video URL.</div>;
  } },
} });
