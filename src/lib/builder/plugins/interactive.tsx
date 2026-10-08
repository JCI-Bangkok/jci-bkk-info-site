"use client";
import { useId, useState } from 'react';
import type { Config } from '@puckeditor/core';
import { defineBuilderPlugin } from '../plugin-types';

type Entry = { title: string; content: string };
function Tabs({ items }: { items: Entry[] }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const index = Math.min(active, Math.max(0, items.length - 1));
  return <div><div role="tablist" aria-label="Content tabs" className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-3">{items.map((item, i) => <button key={i} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={i === index} tabIndex={i === index ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => {
    const next = event.key === 'ArrowRight' ? (i + 1) % items.length : event.key === 'ArrowLeft' ? (i - 1 + items.length) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null;
    if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus(); }
  }} className={`rounded-lg px-4 py-3 font-semibold ${index === i ? 'bg-[var(--jci-blue)] text-white' : 'bg-[var(--paper-soft)]'}`}>{item.title}</button>)}</div>{items.map((item, i) => <div key={i} role="tabpanel" tabIndex={0} id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={index !== i} className="py-6 leading-7 whitespace-pre-line">{item.content}</div>)}</div>;
}
const entries = { type: 'array' as const, arrayFields: { title: { type: 'text' as const }, content: { type: 'textarea' as const } }, defaultItemProps: { title: 'New item', content: 'Your content' }, getItemSummary: (item: Entry) => item.title };
const components: Config['components'] = {
  Accordion: { label: 'Accordion / FAQ', fields: { items: entries }, defaultProps: { items: [{ title: 'How can I participate?', content: 'Join an event or contact the chapter.' }] }, render: ({ items }) => <div className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)]">{(items || []).map((item: Entry, index: number) => <details key={index} className="p-5"><summary className="cursor-pointer font-semibold">{item.title}</summary><p className="mt-4 whitespace-pre-line leading-7 text-[var(--muted)]">{item.content}</p></details>)}</div> },
  Tabs: { label: 'Tabs', fields: { items: entries }, defaultProps: { items: [{ title: 'Overview', content: 'Introduce your chapter.' }, { title: 'Get involved', content: 'Discover upcoming activities.' }] }, render: ({ items }) => <Tabs items={items || []} /> },
};
export const interactivePlugin = defineBuilderPlugin({ id: 'jci.interactive', name: 'Interactive Content', version: '1.0.0', apiVersion: 1, category: 'Interactive Content', description: 'Keyboard-accessible tabs and accordions.', components });
