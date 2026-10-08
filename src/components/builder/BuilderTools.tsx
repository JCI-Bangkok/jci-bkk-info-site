"use client";
import { useEffect, useRef, useState } from 'react';
import { usePuck, type Data } from '@puckeditor/core';
import { builderPlugins } from '@/lib/builder/config';
import { appendBuilderLayout, extractBuilderSection, validateBuilderLayout } from '@/lib/builder/layout-utils';
import { starterSections } from '@/lib/builder/starter-sections';
import { useBuilderRuntime } from './RuntimeProvider';
import { enabledPluginIds } from '@/lib/builder/plugin-catalog';

type Preset = { id: number; title: string; puckLayout: Data };
export function BuilderTools({ onPluginsChange }: { onPluginsChange: (ids: string[]) => void }) {
  const { appState, config, dispatch, selectedItem, history, getSelectorForId } = usePuck();
  const runtime = useBuilderRuntime();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'blocks' | 'sections' | 'plugins'>('blocks');
  const [search, setSearch] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState<Record<string, unknown> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  async function loadSections() {
    try {
      const response = await fetch('/api/builder-presets?limit=100&sort=-updatedAt', { credentials: 'same-origin' });
      if (!response.ok) throw new Error('Unable to load saved sections. Sign in with an editor account.');
      const result = await response.json();
      setPresets(result.docs || []);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load sections.'); }
  }
  async function saveSection() {
    setBusy(true); setMessage('');
    try {
      const layout = selectedItem ? extractBuilderSection(appState.data, selectedItem.props.id) : appState.data;
      validateBuilderLayout(layout);
      const response = await fetch('/api/builder-presets', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.trim(), puckLayout: layout }) });
      if (!response.ok) throw new Error('Unable to save section. Check your editor access.');
      await loadSections(); setTitle(''); setMessage('Saved to the CMS section library.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save section.'); }
    finally { setBusy(false); }
  }
  function insert(layout: Data) {
    try { dispatch({ type: 'setData', data: appendBuilderLayout(appState.data, layout) }); setMessage('Section inserted. Save Draft to keep it.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to insert section.'); }
  }
  async function togglePlugin(id: string) {
    setBusy(true); setMessage('');
    const plugins = builderPlugins.map(plugin => ({ pluginId: plugin.id, enabled: plugin.id === id ? !runtime.enabledPlugins.includes(id) : runtime.enabledPlugins.includes(plugin.id) }));
    try {
      const response = await fetch('/api/globals/builder-settings', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plugins }) });
      if (!response.ok) throw new Error('Unable to change plugins. Check your editor access.');
      onPluginsChange(enabledPluginIds(plugins)); setMessage('Plugin settings saved. Existing block content is retained.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save plugin settings.'); }
    finally { setBusy(false); }
  }
  function download() {
    const blob = new Blob([JSON.stringify(appState.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'builder-layout.json'; anchor.click(); URL.revokeObjectURL(url);
  }
  const activeBlocks = Object.entries(config.components).filter(([key, component]) => component.permissions?.insert !== false && (component.label || key).toLowerCase().includes(search.toLowerCase()));
  function applyStyle(style: Record<string, unknown>) {
    if (!selectedItem) return;
    const target = getSelectorForId(selectedItem.props.id);
    if (!target) return;
    dispatch({ type: 'replace', destinationIndex: target.index, destinationZone: target.zone || 'root:default-zone', data: { ...selectedItem, props: { ...selectedItem.props, appearance: structuredClone(style) } } });
    setMessage('Style updated. Save Draft to keep it.');
  }
  return <>
    <button type="button" onClick={history.back} disabled={!history.hasPast} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Undo</button>
    <button type="button" onClick={history.forward} disabled={!history.hasFuture} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Redo</button>
    <button type="button" onClick={() => { setOpen(true); setMessage(''); }} className="rounded border px-3 py-2 text-sm">Blocks / Library / Plugins</button>
    <dialog ref={dialog} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} className="m-auto w-[min(960px,94vw)] max-h-[88vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4"><div><h2 className="text-lg font-semibold">Builder library</h2><p className="text-sm text-slate-500">Compose pages from blocks and saved sections.</p></div><button type="button" onClick={() => setOpen(false)} className="rounded border px-3 py-2">Close</button></div>
      <div className="p-6"><nav aria-label="Builder tools" className="mb-5 flex gap-2">{(['blocks', 'sections', 'plugins'] as const).map(item => <button type="button" key={item} aria-pressed={tab === item} onClick={() => { setTab(item); setMessage(''); if (item === 'sections') void loadSections(); }} className={`rounded-lg px-4 py-2 text-sm capitalize ${item === tab ? 'bg-sky-700 text-white' : 'bg-slate-100'}`}>{item}</button>)}</nav>
        <p role="status" className="mb-3 text-sm text-slate-600">{message}</p>
        {tab === 'blocks' && <><div className="mb-4 flex flex-wrap gap-2"><button type="button" disabled={!selectedItem} onClick={() => { setCopiedStyle(structuredClone(selectedItem?.props.appearance || {})); setMessage('Appearance copied. Select another block to paste it.'); }} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Copy style</button><button type="button" disabled={!selectedItem || !copiedStyle} onClick={() => copiedStyle && applyStyle(copiedStyle)} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Paste style</button><button type="button" disabled={!selectedItem} onClick={() => applyStyle({})} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Reset style</button></div><input aria-label="Search blocks" placeholder="Search blocks…" value={search} onChange={event => setSearch(event.target.value)} className="mb-4 w-full rounded-lg border p-3" /><div className="grid gap-3 sm:grid-cols-3">{activeBlocks.map(([key, component]) => <button type="button" key={key} onClick={() => { dispatch({ type: 'insert', componentType: key, destinationIndex: appState.data.content.length, destinationZone: 'root:default-zone' }); setMessage(`${component.label || key} added.`); }} className="rounded-xl border p-4 text-left text-sm font-semibold hover:border-sky-600">{component.label || key}</button>)}</div></>}
        {tab === 'sections' && <><div className="mb-6 flex flex-wrap items-end gap-3"><label className="flex-1 text-sm">Section name<input value={title} onChange={event => setTitle(event.target.value)} className="mt-1 w-full rounded border p-2" placeholder="My reusable section" /></label><button type="button" disabled={!title.trim() || busy} onClick={saveSection} className="rounded bg-sky-700 px-4 py-2 text-white disabled:opacity-40">Save {selectedItem ? 'selected section' : 'whole layout'}</button><button type="button" onClick={download} className="rounded border px-4 py-2">Export JSON</button><label className="cursor-pointer rounded border px-4 py-2">Import JSON<input type="file" accept="application/json,.json" className="sr-only" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; try { if (file.size > 2_000_000) throw new Error('File exceeds 2 MB.'); const layout: unknown = JSON.parse(await file.text()); validateBuilderLayout(layout); insert(layout); } catch (error) { setMessage(error instanceof Error ? error.message : 'Invalid file'); } event.target.value = ''; }} /></label></div>
          <h3 className="mb-3 font-semibold">Starter sections</h3><div className="grid gap-3 sm:grid-cols-3">{starterSections.map(section => <article key={section.title} className="rounded-xl border p-4"><h4 className="font-semibold">{section.title}</h4><p className="mt-2 text-sm text-slate-500">{section.description}</p><button type="button" disabled={section.plugins.some(id => !runtime.enabledPlugins.includes(id))} onClick={() => insert(section.layout)} className="mt-4 rounded border px-3 py-2 text-sm disabled:opacity-40">Insert section</button></article>)}</div>
          <h3 className="mb-3 mt-7 font-semibold">Saved in CMS</h3>{!presets.length && <p className="text-sm text-slate-500">No saved sections yet.</p>}<div className="grid gap-3 sm:grid-cols-3">{presets.map(preset => <article key={preset.id} className="rounded-xl border p-4"><h4 className="font-semibold">{preset.title}</h4><button type="button" onClick={() => insert(preset.puckLayout)} className="mt-3 rounded border px-3 py-2 text-sm">Insert copy</button></article>)}</div>
        </>}
        {tab === 'plugins' && <><p className="mb-5 text-sm text-slate-500">Installed plugins are reviewed code packages. Disabling a plugin hides its output and removes its blocks from the palette; the saved data remains recoverable.</p><div className="grid gap-4 sm:grid-cols-2">{builderPlugins.map(plugin => <article key={plugin.id} className="rounded-xl border p-5"><div className="flex justify-between"><h3 className="font-semibold">{plugin.name}</h3><span className="text-xs text-slate-500">v{plugin.version}</span></div><p className="mt-2 text-sm text-slate-500">{plugin.description}</p><p className="mt-3 text-xs text-slate-500">{Object.keys(plugin.components).join(', ')}</p><button type="button" disabled={busy} onClick={() => togglePlugin(plugin.id)} className={`mt-4 rounded px-3 py-2 text-sm ${runtime.enabledPlugins.includes(plugin.id) ? 'bg-sky-700 text-white' : 'border'}`}>{runtime.enabledPlugins.includes(plugin.id) ? 'Disable' : 'Enable'}</button></article>)}</div></>}
      </div>
    </dialog>
  </>;
}
