"use client";

import type { Config } from "@puckeditor/core";
import React from "react";

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
};

export const builderConfig: Config<Props> = {
  components: {
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
            <a href={href} className={`${baseStyle} ${variants[variant]}`}>
              {label}
            </a>
          </div>
        );
      },
    },
  },
};
