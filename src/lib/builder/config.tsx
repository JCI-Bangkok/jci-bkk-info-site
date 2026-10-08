"use client";

import { useDocumentData } from "@/components/builder/DocumentContext";
import { RichText } from "@/components/rich-text";
import { DynamicEventHeader, DynamicEventGallery, DynamicProjectHeader, DynamicProjectImpact, DynamicBoardMembers, DynamicArticleLayout, DynamicEventsList, DynamicProjectsList, DynamicMemberGrid, DynamicContactForm, DynamicHero, LegacyDynamicBlock } from "./dynamic-blocks";

import type { Config, Data, ComponentConfig } from "@puckeditor/core";
import React from "react";
import { DynamicCodeField, DynamicCodePreview } from '@/components/builder/DynamicCode';
import { CodeEditor } from '@/components/builder/CodeEditor';
import { LegacyPageField } from '@/components/builder/LegacyPageField';
import type { CodeSource } from './code-document';
import { StyleControls } from '@/components/builder/StyleControls';
import { StyledBlock } from '@/components/builder/StyledBlock';
import { BindingControls } from '@/components/builder/BindingControls';
import { readBinding, safeBuilderHref } from './bindings';
import { enabledPluginIds } from './plugin-catalog';
import { defineBuilderPlugin } from './plugin-types';
import { createPluginRegistry } from './plugin-registry';
import { contentPlugin } from './plugins/content';
import { interactivePlugin } from './plugins/interactive';
import { embedsPlugin } from './plugins/embeds';
import { BlockBoundary } from '@/components/builder/BlockBoundary';
import { GlobalHeaderBlock, GlobalFooterBlock } from '@/components/builder/GlobalChromeBlocks';
import { legacyPageTypes } from './legacy-page-types';

type Props = {
  Section: {
    background: "white" | "gray" | "dark";
    padding: "none" | "small" | "medium" | "large";
  };
  Columns: {
    layout: "1-1" | "1-2" | "2-1" | "1-1-1";
    gap: "small" | "medium" | "large";
  };
  Hero: {
    title: string;
    description: string;
    align: "left" | "center" | "right";
  };
  Text: {
    content: string;
    align: "left" | "center" | "right";
    size: "small" | "normal" | "large";
  };
  Button: {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
    align: "left" | "center" | "right";
  };
  Image: {
    url: string;
    alt: string;
    caption?: string;
  };
  DynamicTitle: {
    align: "left" | "center" | "right";
  };
  DynamicContent: Record<string, never>;
  DynamicEventHeader: Record<string, never>;
  DynamicEventGallery: Record<string, never>;
  DynamicProjectHeader: Record<string, never>;
  DynamicProjectImpact: Record<string, never>;
  DynamicBoardMembers: Record<string, never>;
  DynamicArticleLayout: Record<string, never>;
  DynamicEventsList: Record<string, never>;
  DynamicProjectsList: Record<string, never>;
  DynamicMemberGrid: Record<string, never>;
  DynamicContactForm: Record<string, never>;
  DynamicHero: Record<string, never>;
  LegacyDynamic: { functionName: string; sectionTitle: string; intro: string; visible: boolean };
  LegacyPage: { pageType: string; visible: boolean; customCode?: string };
  GlobalHeader: { showNavigation: boolean; showLanguageSwitch: boolean; ctaLabel: string; ctaHref: string; style: 'floating' | 'solid' | 'minimal' };
  GlobalFooter: { showNavigation: boolean; showSocialLinks: boolean; heading: string; copyright: string };
  CodeBlock: { code: string; language: "html" | "css" | "javascript" | "json" | "text"; title?: string };
  DynamicCode: { source: CodeSource; height: number };
};

function DynamicTitleRenderer({ align }: { align: 'left' | 'center' | 'right' }) {
  const doc = useDocumentData();
  return <h1 style={{ textAlign: align }} className="text-4xl font-bold">{doc?.title || 'Dynamic Title Placeholder'}</h1>;
}

function LegacyPagePreview({ pageType, visible }: { pageType: string; visible: boolean }) {
  const data = useDocumentData();
  if (!visible) return null;
  if (data?.legacyPages?.[pageType]) return data.legacyPages[pageType];
  const query = new URLSearchParams({ locale: data?.currentLocale === 'th' ? 'th' : 'en' });
  if (data?.slug) query.set('slug', data.slug);
  if (data?.year || data?.activeYear) query.set('year', String(data.year || data.activeYear));
  const previewUrl = `/builder-preview/legacy/${encodeURIComponent(pageType)}?${query}`;
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm my-4">
      <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs text-slate-600 border-b border-slate-200">
        <span className="font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Original Page: <span className="font-mono text-blue-700">{pageType}.tsx</span>
        </span>
        <span className="text-slate-500 text-[11px] font-sans">
          Click anywhere to select & configure in Right Menu →
        </span>
      </div>
      <div className="relative w-full">
        <iframe
          title={`Original ${pageType} design`}
          src={previewUrl}
          className="w-full border-0 bg-white pointer-events-none"
          style={{ height: '80vh', minHeight: '600px' }}
        />
        {/* Click capture overlay: allows clicks to select the Puck block and open the Right Menu */}
        <div
          className="absolute inset-0 cursor-pointer pointer-events-auto"
          title="Click to select block and open TypeScript editor in Right Menu"
        />
      </div>
    </div>
  );
}

function DynamicContentRenderer() {
  const doc = useDocumentData();
  if (!doc || (!doc.body && !doc.fullDescription)) return <div className="p-4 bg-gray-100 italic">[Dynamic Content Placeholder]</div>;
  if (doc.eventDate && doc.fullDescription) return <section className="mx-auto w-full max-w-7xl px-5 pt-5 pb-12 lg:px-8 lg:pt-8 lg:pb-16"><article className="paper-frame p-7"><h2 className="font-display text-3xl leading-none text-[var(--ink)] mb-6">{doc.currentLocale === 'th' ? 'รายละเอียดกิจกรรม' : 'Event Details'}</h2><RichText content={doc.fullDescription} /></article></section>;
  return <RichText content={doc.body || doc.fullDescription} />;
}

const coreConfig: Config<Props> = {
  components: {
    DynamicCode: {
      label: 'Dynamic Code — HTML / CSS / JS',
      fields: {
        source: { type: 'custom', label: 'Code & Live Preview', render: ({ value, onChange, readOnly }) => <DynamicCodeField value={value} onChange={onChange} readOnly={readOnly} /> },
        height: { type: 'number', label: 'Preview height (px)', min: 100, max: 2400 },
      },
      defaultProps: { source: { html: '<section><h1>{{title}}</h1><p>Build your dynamic block here.</p></section>', css: 'section { padding: 32px; background: #0c2340; color: white; }', javascript: '' }, height: 480 },
      render: ({ source, height }) => <DynamicCodePreview source={source} height={height} />,
    },
    Section: {
      fields: {
        background: {
          type: "select",
          options: [
            { label: "White", value: "white" },
            { label: "Light Gray", value: "gray" },
            { label: "Dark", value: "dark" },
          ],
        },
        padding: {
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
        },
      },
      defaultProps: {
        background: "white",
        padding: "medium",
      },
      render: ({ background, padding, puck: { renderDropZone: DropZone } }) => {
        const bgClasses = {
          white: "bg-white text-slate-900",
          gray: "bg-slate-50 text-slate-900",
          dark: "bg-slate-900 text-white",
        };
        const padClasses = {
          none: "py-0",
          small: "py-8",
          medium: "py-16",
          large: "py-24",
        };
        return (
          <section className={`${bgClasses[background]} ${padClasses[padding]} px-6`}>
            <div className="mx-auto max-w-7xl">
              <DropZone zone="content" />
            </div>
          </section>
        );
      },
    },

    Columns: {
      fields: {
        layout: {
          type: "select",
          options: [
            { label: "50 / 50", value: "1-1" },
            { label: "33 / 66", value: "1-2" },
            { label: "66 / 33", value: "2-1" },
            { label: "33 / 33 / 33", value: "1-1-1" },
          ],
        },
        gap: {
          type: "select",
          options: [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
        },
      },
      defaultProps: {
        layout: "1-1",
        gap: "medium",
      },
      render: ({ layout, gap, puck: { renderDropZone: DropZone } }) => {
        const gapClasses = {
          small: "gap-4",
          medium: "gap-8",
          large: "gap-12",
        };
        
        const gridClasses = {
          "1-1": "grid-cols-1 md:grid-cols-2",
          "1-2": "grid-cols-1 md:grid-cols-[1fr_2fr]",
          "2-1": "grid-cols-1 md:grid-cols-[2fr_1fr]",
          "1-1-1": "grid-cols-1 md:grid-cols-3",
        };

        return (
          <div className={`grid ${gridClasses[layout]} ${gapClasses[gap]}`}>
            <div className="w-full"><DropZone zone="col-1" /></div>
            <div className="w-full"><DropZone zone="col-2" /></div>
            {layout === "1-1-1" && <div className="w-full"><DropZone zone="col-3" /></div>}
          </div>
        );
      },
    },

    Hero: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        title: "Catchy Headline",
        description: "A short description to introduce your product or service.",
        align: "center",
      },
      render: ({ title, description, align }) => {
        return (
          <div style={{ textAlign: align }} className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{title}</h1>
            <p className="text-xl opacity-90 max-w-2xl" style={{ margin: align === 'center' ? '0 auto' : '0' }}>
              {description}
            </p>
          </div>
        );
      },
    },

    Text: {
      fields: {
        content: { type: "textarea" },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        size: {
          type: "select",
          options: [
            { label: "Small", value: "small" },
            { label: "Normal", value: "normal" },
            { label: "Large", value: "large" },
          ],
        },
      },
      defaultProps: {
        content: "Edit this text block...",
        align: "left",
        size: "normal",
      },
      render: ({ content, align, size }) => {
        const sizes = {
          small: "text-sm",
          normal: "text-base",
          large: "text-lg",
        };
        return (
          <div className={`mb-6 ${sizes[size]}`} style={{ textAlign: align }}>
            <p className="leading-relaxed">{content}</p>
          </div>
        );
      },
    },

    Image: {
      fields: {
        url: { type: "text" },
        alt: { type: "text" },
        caption: { type: "text" },
      },
      defaultProps: {
        url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200",
        alt: "Placeholder image",
      },
      render: ({ url, alt, caption }) => (
        <figure className="mb-8">
          <img src={url} alt={alt} className="w-full h-auto rounded-lg shadow-md object-cover" />
          {caption && <figcaption className="mt-3 text-center text-sm opacity-70">{caption}</figcaption>}
        </figure>
      ),
    },

    Button: {
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Primary (Solid)", value: "primary" },
            { label: "Secondary (Muted)", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        label: "Click Here",
        href: "#",
        variant: "primary",
        align: "left",
      },
      render: ({ label, href, variant, align }) => {
        const baseStyle = "inline-flex px-6 py-3 rounded-md font-medium transition-colors duration-200";
        const variants = {
          primary: "bg-blue-600 text-white hover:bg-blue-700",
          secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
          outline: "border-2 border-slate-300 hover:border-slate-400 bg-transparent",
        };
        return (
          <div style={{ textAlign: align }} className="mb-6">
            <a href={safeBuilderHref(href)} className={`${baseStyle} ${variants[variant]}`}>
              {label}
            </a>
          </div>
        );
      },
    },

    DynamicTitle: {
      fields: {
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: { align: "left" },
      render: ({ align }) => <DynamicTitleRenderer align={align} />
    },

    DynamicContent: {
      fields: {},
      defaultProps: {},
      render: () => <DynamicContentRenderer />
    },

    DynamicEventHeader: { fields: {}, defaultProps: {}, render: () => <DynamicEventHeader /> },
    DynamicEventGallery: { fields: {}, defaultProps: {}, render: () => <DynamicEventGallery /> },
    DynamicProjectHeader: { fields: {}, defaultProps: {}, render: () => <DynamicProjectHeader /> },
    DynamicProjectImpact: { fields: {}, defaultProps: {}, render: () => <DynamicProjectImpact /> },
    DynamicBoardMembers: { fields: {}, defaultProps: {}, render: () => <DynamicBoardMembers /> },
    DynamicArticleLayout: { fields: {}, defaultProps: {}, render: () => <DynamicArticleLayout /> },
    DynamicEventsList: { fields: {}, defaultProps: {}, render: () => <DynamicEventsList /> },
    DynamicProjectsList: { fields: {}, defaultProps: {}, render: () => <DynamicProjectsList /> },
    DynamicMemberGrid: { fields: {}, defaultProps: {}, render: () => <DynamicMemberGrid /> },
    DynamicContactForm: { fields: {}, defaultProps: {}, render: () => <DynamicContactForm /> },
    DynamicHero: { fields: {}, defaultProps: {}, render: () => <DynamicHero /> },
    LegacyPage: {
      label: 'Original Page Design',
      fields: {
        pageType: { type: 'select', label: 'Original page', options: legacyPageTypes.map(value => ({ label: value, value })) },
        visible: { type: 'radio', options: [{ label: 'Visible', value: true }, { label: 'Hidden', value: false }] },
        customCode: {
          type: 'custom',
          label: 'TypeScript / TSX Code',
          render: ({ value, onChange, readOnly }) => (
            <LegacyPageField value={value} onChange={onChange} readOnly={readOnly} />
          ),
        },
      },
      defaultProps: { pageType: 'home', visible: true, customCode: '' },
      render: props => <LegacyPagePreview {...props} />,
    },
    LegacyDynamic: {
      label: 'Legacy Dynamic Function',
      fields: {
        functionName: { type: 'select', label: 'Function', options: [
          { label: 'Hero', value: 'hero' }, { label: 'Events list', value: 'eventsList' }, { label: 'Projects list', value: 'projectsList' },
          { label: 'Member grid', value: 'memberGrid' }, { label: 'Contact form', value: 'contactForm' }, { label: 'CMS content', value: 'content' },
          { label: 'Article layout', value: 'articleLayout' }, { label: 'Event header', value: 'eventHeader' }, { label: 'Event gallery', value: 'eventGallery' },
          { label: 'Project header', value: 'projectHeader' }, { label: 'Project impact', value: 'projectImpact' }, { label: 'Board members', value: 'boardMembers' },
        ] },
        sectionTitle: { type: 'text', label: 'Section title' }, intro: { type: 'textarea', label: 'Section introduction' },
        visible: { type: 'radio', label: 'Visibility', options: [{ label: 'Visible', value: true }, { label: 'Hidden', value: false }] },
      },
      defaultProps: { functionName: 'content', sectionTitle: '', intro: '', visible: true },
      render: props => <LegacyDynamicBlock {...props} />,
    },
    GlobalHeader: {
      label: 'Site Header',
      fields: {
        style: { type: 'select', options: [{ label: 'Solid', value: 'solid' }, { label: 'Floating', value: 'floating' }, { label: 'Minimal', value: 'minimal' }] },
        showNavigation: { type: 'radio', options: [{ label: 'Show navigation', value: true }, { label: 'Hide navigation', value: false }] },
        showLanguageSwitch: { type: 'radio', options: [{ label: 'Show language switch', value: true }, { label: 'Hide language switch', value: false }] },
        ctaLabel: { type: 'text', label: 'Action label' }, ctaHref: { type: 'text', label: 'Action URL' },
      },
      defaultProps: { style: 'solid', showNavigation: true, showLanguageSwitch: true, ctaLabel: 'Become a member', ctaHref: '/membership' },
      render: props => <GlobalHeaderBlock {...props} />,
    },
    GlobalFooter: {
      label: 'Site Footer',
      fields: {
        heading: { type: 'textarea', label: 'Introduction' }, copyright: { type: 'text' },
        showNavigation: { type: 'radio', options: [{ label: 'Show navigation', value: true }, { label: 'Hide navigation', value: false }] },
        showSocialLinks: { type: 'radio', options: [{ label: 'Show social links', value: true }, { label: 'Hide social links', value: false }] },
      },
      defaultProps: { heading: 'Developing leaders for a changing world.', copyright: '© 2026 JCI Bangkok. All Rights Reserved.', showNavigation: true, showSocialLinks: true },
      render: props => <GlobalFooterBlock {...props} />,
    },
    CodeBlock: {
      fields: {
        title: { type: 'text' },
        language: { type: 'select', options: [
          { label: 'HTML', value: 'html' }, { label: 'CSS', value: 'css' },
          { label: 'JavaScript', value: 'javascript' }, { label: 'JSON', value: 'json' }, { label: 'Plain text', value: 'text' },
        ] },
        code: { type: 'custom', render: ({ value, onChange, readOnly }) => <CodeEditor value={value || ''} onChange={onChange} readOnly={readOnly} language="text" /> },
      },
      defaultProps: { title: 'Code example', language: 'html', code: '<section>Editable code sample</section>' },
      render: ({ title, language, code }) => (
        <figure className="my-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
          <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-300">
            <span>{title || 'Code'}</span><span className="text-sky-300">{language}</span>
          </figcaption>
          <pre className="overflow-x-auto p-5 text-sm leading-6"><code>{code}</code></pre>
        </figure>
      ),
    },
  },
};

const { DynamicCode, CodeBlock, ...coreComponents } = coreConfig.components;
const codePlugin = defineBuilderPlugin({ id: 'jci.code', name: 'Dynamic Code', version: '1.0.0', apiVersion: 1, category: 'Code & Custom Blocks', description: 'Sandboxed custom code with live preview.', components: { DynamicCode, CodeBlock } });
export const builderPlugins = [contentPlugin, interactivePlugin, embedsPlugin, codePlugin];

const bindings: Record<string, string[]> = { Hero: ['title', 'description'], Text: ['content'], Heading: ['text'], Card: ['title', 'description', 'linkLabel', 'href'], Button: ['label', 'href'], Image: ['url', 'alt', 'caption'] };

function EnhancedBlock({ component, props }: { component: ComponentConfig<any>; props: any }) {
  const data = useDocumentData();
  const values = { ...props };
  for (const key of bindings[props._blockType] || []) {
    const path = props.cmsBindings?.[key];
    if (path) values[key] = readBinding(data, path) ?? props[key];
  }
  const Component = component.render;
  return <StyledBlock id={props.id} style={props.appearance}><Component {...values} /></StyledBlock>;
}

/** One registry builds both editor and public rendering configs. Old names stay stable. */
export function buildBuilderConfig(enabled = enabledPluginIds(), layout?: Data, editor = true): Config {
  const registry = createPluginRegistry(coreComponents, builderPlugins, enabled);
  const all = { ...coreComponents, ...Object.assign({}, ...builderPlugins.map(plugin => plugin.components)) } as Config['components'];
  const components: Config['components'] = {};
  const categories: NonNullable<Config['categories']> = {
    layout: { title: 'Layout', components: ['Section', 'Columns'] },
    basics: { title: 'Basic Content', components: ['Hero', 'Text', 'Image', 'Button'] },
    dynamic: { title: 'CMS & Dynamic Content', components: Object.keys(coreComponents).filter(key => key.startsWith('Dynamic') || key.startsWith('Legacy')) },
    other: { visible: false },
  };
  for (const plugin of builderPlugins) categories[plugin.id] = { title: plugin.category, components: enabled.includes(plugin.id) ? Object.keys(plugin.components) : [] };
  for (const [key, component] of Object.entries(all)) {
    const owner = registry.owners.get(key)!;
    if (owner !== 'core' && !registry.enabled.has(owner)) {
      components[key] = { label: `${component.label || key} (disabled)`, permissions: { insert: false, edit: false }, fields: {}, render: () => editor ? <div className="rounded border border-amber-300 bg-amber-50 p-5 text-sm">{component.label || key} is disabled. Enable {owner} in Builder Settings to restore it. Saved content is retained.</div> : <></> };
      continue;
    }
    components[key] = {
      ...component,
      defaultProps: { ...component.defaultProps, appearance: {}, cmsBindings: {} },
      fields: { ...component.fields, ...(bindings[key] ? { cmsBindings: { type: 'custom', label: 'CMS bindings', render: ({ value, onChange, readOnly }: any) => <BindingControls value={value || {}} onChange={onChange} keys={bindings[key]} readOnly={readOnly} /> } } : {}), appearance: { type: 'custom', label: 'Appearance', render: ({ value, onChange, readOnly }: any) => <StyleControls value={value || {}} onChange={onChange} readOnly={readOnly} /> } },
      render: props => <BlockBoundary label={component.label || key} editor={editor}><EnhancedBlock component={component} props={{ ...component.defaultProps, ...props, _blockType: key }} /></BlockBoundary>,
    };
  }
  for (const block of [ ...(layout?.content || []), ...Object.values(layout?.zones || {}).flat() ]) {
    if (Object.hasOwn(components, block.type)) continue;
    components[block.type] = { fields: {}, permissions: { insert: false, edit: false }, render: () => editor ? <div className="rounded border border-amber-300 p-5">Missing block: {block.type}. Install its plugin to restore it. Content is retained.</div> : <></> };
  }
  return { components, categories, root: {
    fields: {
      accentColor: { type: 'text', label: 'Page accent color (hex)' },
      surfaceColor: { type: 'text', label: 'Page background (hex)' },
    },
    render: ({ children, accentColor, surfaceColor }: any) => <div style={{ ...(typeof accentColor === 'string' && /^#[a-f0-9]{3,8}$/i.test(accentColor) ? { '--jci-blue': accentColor } : {}), ...(typeof surfaceColor === 'string' && /^#[a-f0-9]{3,8}$/i.test(surfaceColor) ? { backgroundColor: surfaceColor } : {}) } as React.CSSProperties}>{children}</div>,
  } };
}

export const builderConfig = buildBuilderConfig();
