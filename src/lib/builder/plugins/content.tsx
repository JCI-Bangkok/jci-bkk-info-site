"use client";
import type { Config } from '@puckeditor/core';
import { defineBuilderPlugin } from '../plugin-types';
import { safeBuilderHref } from '../bindings';
import { sanitizeBuilderRichText } from '../richtext';

const components: Config['components'] = {
  RichTextBlock: { label: 'Rich text', fields: { content: { type: 'richtext' } }, defaultProps: { content: '<p>Write your story with <strong>bold</strong> text, lists, and links.</p>' }, render: ({ content }) => <div className="builder-richtext space-y-4 leading-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[var(--jci-blue)] [&_a]:underline" dangerouslySetInnerHTML={{ __html: sanitizeBuilderRichText(typeof content === 'string' ? content : '') }} /> },
  Heading: {
    label: 'Heading',
    fields: { text: { type: 'text' }, level: { type: 'select', options: [1, 2, 3, 4, 5, 6].map(level => ({ label: `H${level}`, value: `h${level}` })) } },
    defaultProps: { text: 'Your headline', level: 'h2' },
    render: ({ text, level }) => {
      const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h2') as 'h2';
      return <Tag className="text-3xl font-semibold tracking-tight">{text}</Tag>;
    },
  },
  Spacer: { label: 'Spacer', fields: { height: { type: 'number', min: 0, max: 400 } }, defaultProps: { height: 32 }, render: ({ height }) => <div aria-hidden="true" style={{ height: Math.min(400, Math.max(0, height || 0)) }} /> },
  Divider: { label: 'Divider', fields: { color: { type: 'text' } }, defaultProps: { color: '#dbe3ea' }, render: ({ color }) => <hr style={{ border: 0, borderTop: `1px solid ${/^#[0-9a-f]{3,8}$/i.test(color) ? color : '#dbe3ea'}`, margin: '24px 0' }} /> },
  Card: {
    label: 'Card with content slot',
    fields: { title: { type: 'text' }, description: { type: 'textarea' }, linkLabel: { type: 'text' }, href: { type: 'text' } },
    defaultProps: { title: 'Build something meaningful', description: 'Add your content and drop more blocks below.', linkLabel: '', href: '/' },
    render: ({ title, description, linkLabel, href, puck: { renderDropZone: DropZone } }) => <article className="rounded-2xl border border-[var(--line)] bg-white p-6 text-[var(--ink)] shadow-sm"><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-[var(--muted)]">{description}</p><div className="mt-4"><DropZone zone="content" /></div>{linkLabel && <a href={safeBuilderHref(href)} className="mt-4 inline-block font-semibold text-[var(--jci-blue)]">{linkLabel} →</a>}</article>,
  },
};

export const contentPlugin = defineBuilderPlugin({ id: 'jci.content', name: 'Content Essentials', version: '1.0.0', apiVersion: 1, category: 'Content Essentials', description: 'Typography and composable content blocks.', components });
