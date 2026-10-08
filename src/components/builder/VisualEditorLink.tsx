"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import Link from "next/link";
import React from "react";

export default function VisualEditorLink() {
  const { id } = useDocumentInfo();

  if (!id) {
    return (
      <div style={{ padding: '1rem', background: 'rgba(255, 165, 0, 0.1)', border: '1px solid orange', borderRadius: '4px', marginBottom: '2rem' }}>
        <em>Save this page first to access the Visual Editor.</em>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Visual Page Builder</strong>
      </div>
      <Link
        href={`/builder/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '10px 15px',
          backgroundColor: 'var(--theme-elevation-800)',
          color: 'var(--theme-elevation-0)',
          textAlign: 'center',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          border: '1px solid var(--theme-elevation-800)'
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Open Elementor-Style Editor ↗
      </Link>
      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--theme-elevation-500)' }}>
        Opens the drag-and-drop canvas in a new tab.
      </p>
    </div>
  );
}
