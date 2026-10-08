"use client";

import React, { useState, useEffect } from 'react';
import { usePuck } from '@puckeditor/core';
import { CodeEditor } from './CodeEditor';

export function LegacyPageField({
  value,
  onChange,
  readOnly = false,
  pageType: propPageType,
}: {
  value?: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
  pageType?: string;
}) {
  let selectedPageType = propPageType;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { appState } = usePuck();
    if (!selectedPageType && appState?.ui?.itemSelector) {
      const selectedIndex = appState.ui.itemSelector.index;
      const zone = appState.ui.itemSelector.zone;
      const item = zone
        ? appState.data.zones?.[zone]?.[selectedIndex]
        : appState.data.content?.[selectedIndex];
      if (item?.props?.pageType) {
        selectedPageType = item.props.pageType;
      }
    }
  } catch {
    // Fallback if rendered outside Puck context
  }

  const pageType = selectedPageType || 'home';

  const [sourceCode, setSourceCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'original' | 'custom'>(value ? 'custom' : 'original');

  // Fetch original source code when pageType changes
  useEffect(() => {
    let isCancelled = false;
    async function loadSource() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/builder/legacy-source?pageType=${encodeURIComponent(pageType)}`);
        if (!res.ok) {
          throw new Error(`Failed to load source (${res.status} ${res.statusText})`);
        }
        const json = await res.json();
        if (!isCancelled) {
          setSourceCode(json.sourceCode || '// Source code not found');
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err?.message || 'Could not load original TypeScript source');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadSource();
    return () => {
      isCancelled = true;
    };
  }, [pageType]);

  const activeCode = mode === 'custom' ? (value || '') : sourceCode;

  return (
    <div className="space-y-3 pt-1">
      {/* Tab Switcher in Right Menu */}
      <div className="flex items-center justify-between gap-1 border-b border-slate-200 pb-2">
        <div className="flex gap-1 rounded bg-slate-100 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('original')}
            className={`rounded px-2.5 py-1 font-medium transition ${
              mode === 'original'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Original TSX
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('custom');
              if (!value && sourceCode) {
                onChange(sourceCode);
              }
            }}
            className={`rounded px-2.5 py-1 font-medium transition ${
              mode === 'custom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom Override {value ? '●' : ''}
          </button>
        </div>

        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          🔒 Sandboxed
        </span>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>src/components/legacy-pages/{pageType}.tsx</span>
        {mode === 'custom' && value && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset custom override back to the original source code?')) {
                onChange('');
                setMode('original');
              }
            }}
            className="text-amber-700 hover:text-amber-900 font-sans font-medium underline"
          >
            Reset
          </button>
        )}
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-mono">
          {error}
        </div>
      ) : isLoading ? (
        <div className="rounded border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
          Loading TypeScript source...
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-slate-300">
          <CodeEditor
            value={activeCode}
            language="typescript"
            readOnly={readOnly || mode === 'original'}
            height="340px"
            onChange={(newCode) => {
              if (mode === 'custom') {
                onChange(newCode);
              }
            }}
          />
        </div>
      )}

      {mode === 'original' && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Viewing original read-only source</span>
          <button
            type="button"
            onClick={() => {
              onChange(sourceCode);
              setMode('custom');
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Edit as Custom Override →
          </button>
        </div>
      )}

      {mode === 'custom' && (
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Editing custom TypeScript override. Any changes are stored in the page template and previewed with live CMS data.
        </p>
      )}
    </div>
  );
}
