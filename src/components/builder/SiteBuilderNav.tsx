"use client";

import React from 'react';
import Link from 'next/link';

export function SiteBuilderNav() {
  return (
    <div className="nav-group" style={{ marginTop: '2rem' }}>
      <h4 className="nav-group__title" style={{ paddingLeft: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--theme-elevation-400)' }}>
        Site Editor
      </h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        <li>
          <Link
            href="/admin/collections/templates"
            style={{
              display: 'block',
              padding: '0.5rem 1rem',
              color: 'var(--theme-elevation-1000)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            FSE Templates 🎨
          </Link>
        </li>
      </ul>
    </div>
  );
}
