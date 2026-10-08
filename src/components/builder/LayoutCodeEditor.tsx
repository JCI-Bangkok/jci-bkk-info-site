"use client";

import { useState } from 'react';
import { Render, usePuck, type Data } from '@puckeditor/core';
import { validateBuilderLayout } from '@/lib/builder/layout-utils';
import { CodeEditor } from './CodeEditor';


export function LayoutCodeEditor() {
  const { appState, dispatch, config } = usePuck();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('');
  const [view, setView] = useState<'code' | 'live' | 'split'>('split');
  let preview: Data | null = null;
  let error = '';
  if (open) {
    try { const data: unknown = JSON.parse(source); validateBuilderLayout(data); preview = data; }
    catch (cause) { error = cause instanceof Error ? cause.message : 'Invalid layout'; }
  }
  return <>
    <button type="button" onClick={() => { setSource(JSON.stringify(appState.data, null, 2)); setOpen(true); }} className="rounded-md border border-slate-300 px-4 py-2 text-sm">Code / Live</button>
    {open && <div role="dialog" aria-modal="true" aria-label="Layout code and live preview" className="fixed inset-0 z-[1000] flex flex-col bg-white" onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div><h2 className="font-semibold">Layout code & live preview</h2><p className="text-sm text-slate-500">Edit blocks and properties in JSON. Apply changes to continue in the visual builder.</p></div>
        <div className="flex gap-2">{(['code', 'live', 'split'] as const).map(mode => <button type="button" key={mode} aria-pressed={view === mode} onClick={() => setView(mode)} className="rounded border px-3 py-2 text-sm">{mode === 'code' ? 'Code' : mode === 'live' ? 'Live view' : 'Split view'}</button>)}</div>
        <div className="flex gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded border px-3 py-2">Cancel</button><button type="button" disabled={!preview} onClick={() => { if (preview) { dispatch({ type: 'setData', data: preview }); setOpen(false); } }} className="rounded bg-sky-700 px-3 py-2 text-white disabled:opacity-40">Apply changes</button></div>
      </div>
      {error && <p role="alert" className="bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className={`grid flex-1 overflow-auto ${view === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {view !== 'live' && <div className="min-w-0 overflow-auto border-r"><CodeEditor value={source} onChange={setSource} language="json" /></div>}
        {view !== 'code' && <div className="min-w-0 overflow-auto bg-white p-4">{preview && <Render config={config} data={preview} />}</div>}
      </div>
    </div>}
  </>;
}
