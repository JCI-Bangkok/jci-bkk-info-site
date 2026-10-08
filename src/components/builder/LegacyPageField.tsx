"use client";

import React, { useState, useEffect } from 'react';
import { usePuck } from '@puckeditor/core';
import { CodeEditor } from './CodeEditor';
import { legacyPageTypes } from '@/lib/builder/legacy-page-types';

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
  const { selectedItem, appState, dispatch } = usePuck();

  // 1. Fully resolve the current item's pageType from Puck state
  let currentItem: any = selectedItem;
  if (!currentItem && appState?.ui?.itemSelector) {
    const { index, zone } = appState.ui.itemSelector;
    if (zone && zone !== 'root' && appState.data.zones?.[zone]) {
      currentItem = appState.data.zones[zone][index];
    } else if (appState.data.content?.[index]) {
      currentItem = appState.data.content[index];
    }
  }
  if (!currentItem && appState?.data?.content) {
    currentItem = appState.data.content.find((item: any) => item.type === 'LegacyPage');
  }

  const pageType = propPageType || currentItem?.props?.pageType || 'home';

  const [sourceCode, setSourceCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'original' | 'custom'>(value ? 'custom' : 'original');

  // Fetch original source code whenever pageType changes
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

  // Synchronize pageType dropdown change with Puck state
  function handleSelectPage(newPageType: string) {
    if (dispatch && appState?.ui?.itemSelector) {
      const { index, zone } = appState.ui.itemSelector;
      const newData = JSON.parse(JSON.stringify(appState.data));
      if (zone && zone !== 'root' && newData.zones?.[zone]?.[index]) {
        newData.zones[zone][index].props.pageType = newPageType;
        dispatch({ type: "setData", data: newData });
      } else if (newData.content?.[index]) {
        newData.content[index].props.pageType = newPageType;
        dispatch({ type: "setData", data: newData });
      }
    }
  }

  const activeCode = mode === 'custom' ? (value || '') : sourceCode;

  return (
    <div className="space-y-3 pt-1">
      {/* Synchronized Original Page Selector */}
      <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          Page Source:
        </label>
        <select
          value={pageType}
          onChange={(e) => handleSelectPage(e.target.value)}
          className="w-full max-w-[200px] text-xs font-mono font-medium rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="Select which original page design to inspect and edit"
        >
          {legacyPageTypes.map((type) => (
            <option key={type} value={type}>
              {type}.tsx
            </option>
          ))}
        </select>
      </div>

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
        <span className="text-blue-700 font-medium">src/components/legacy-pages/{pageType}.tsx</span>
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
          Loading {pageType}.tsx...
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden">
          <CodeEditor
            value={activeCode}
            language="typescript"
            readOnly={readOnly || mode === 'original'}
            height="340px"
            title={`TSX: ${pageType}.tsx ${mode === 'custom' ? '(Override)' : '(Source)'}`}
            allowExpand={true}
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
