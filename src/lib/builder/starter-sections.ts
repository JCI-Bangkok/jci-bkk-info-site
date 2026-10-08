import type { Data } from '@puckeditor/core';

export const starterSections: { title: string; description: string; plugins: string[]; layout: Data }[] = [
  { title: 'Chapter introduction', description: 'A hero, introduction, and membership call to action.', plugins: [], layout: { root: { props: {} }, content: [{ type: 'Section', props: { id: 'intro', background: 'white', padding: 'large' } }], zones: { 'intro:content': [
    { type: 'Hero', props: { id: 'intro-hero', title: 'JCI Bangkok', description: 'Developing leaders through action.', align: 'left' } },
    { type: 'Button', props: { id: 'intro-cta', label: 'Become a member', href: '/en/membership', variant: 'primary', align: 'left' } },
  ] } } },
  { title: 'Two opportunity cards', description: 'A responsive two-column section with editable cards.', plugins: ['jci.content'], layout: { root: { props: {} }, content: [{ type: 'Section', props: { id: 'opportunities', background: 'gray', padding: 'medium' } }], zones: {
    'opportunities:content': [{ type: 'Columns', props: { id: 'opportunity-columns', layout: '1-1', gap: 'medium' } }],
    'opportunity-columns:col-1': [{ type: 'Card', props: { id: 'leadership-card', title: 'Leadership development', description: 'Learn by leading real projects.', linkLabel: 'Get involved', href: '/en/membership' } }],
    'opportunity-columns:col-2': [{ type: 'Card', props: { id: 'community-card', title: 'Community impact', description: 'Turn ideas into local action.', linkLabel: 'Explore events', href: '/en/events' } }],
  } } },
  { title: 'Frequently asked questions', description: 'An accessible FAQ section.', plugins: ['jci.content', 'jci.interactive'], layout: { root: { props: {} }, content: [{ type: 'Section', props: { id: 'faq-section', background: 'white', padding: 'medium' } }], zones: { 'faq-section:content': [
    { type: 'Heading', props: { id: 'faq-title', text: 'Frequently asked questions', level: 'h2' } },
    { type: 'Spacer', props: { id: 'faq-space', height: 24 } },
    { type: 'Accordion', props: { id: 'faq-items', items: [{ title: 'Who can join?', content: 'Young active citizens aged 18–40.' }, { title: 'How can I get involved?', content: 'Attend an upcoming event or contact the chapter.' }] } },
  ] } } },
];
