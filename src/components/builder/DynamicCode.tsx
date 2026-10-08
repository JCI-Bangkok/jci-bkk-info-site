"use client";

import { useState } from 'react';
import { useDocumentData } from './DocumentContext';
import { CodeEditor } from './CodeEditor';
import { codeDocument, type CodeSource } from '@/lib/builder/code-document';

export function DynamicCodePreview({ source, height = 480 }: { source: CodeSource; height?: number }) {
  const data = useDocumentData();
  const normalized = { html: source?.html || '', css: source?.css || '', javascript: source?.javascript || '' };
  return <iframe title="Dynamic code live preview" sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={codeDocument(normalized, data)} style={{ width: '100%', height, border: 0, display: 'block' }} />;
}

export function DynamicCodeField({ value, onChange, readOnly }: { value: CodeSource; onChange: (source: CodeSource) => void; readOnly?: boolean }) {
  const [view, setView] = useState<'code' | 'live' | 'split'>('split');
  const [language, setLanguage] = useState<keyof CodeSource>('html');
  const source = { html: value?.html || '', css: value?.css || '', javascript: value?.javascript || '' };
  return <div>
    <div className="mb-3 flex flex-wrap gap-2" aria-label="Code view">
      {(['code', 'live', 'split'] as const).map(mode => <button type="button" key={mode} aria-pressed={mode === view} onClick={() => setView(mode)} className="rounded border px-3 py-2 text-xs">{mode === 'code' ? 'Code' : mode === 'live' ? 'Live view' : 'Split view'}</button>)}
    </div>
    {view !== 'live' && <>
      <label className="mb-2 block text-xs">Language <select value={language} onChange={event => setLanguage(event.target.value as keyof CodeSource)} className="ml-2 rounded border p-2"><option value="html">HTML</option><option value="css">CSS</option><option value="javascript">JavaScript</option></select></label>
      <CodeEditor value={source[language]} language={language} readOnly={readOnly} onChange={code => onChange({ ...source, [language]: code })} />
    </>}
    {view !== 'code' && <div className="mt-3 overflow-hidden rounded border bg-white"><DynamicCodePreview source={source} height={320} /></div>}
    <p className="mt-2 text-xs leading-5">Use CMS values such as {'{{title}}'} or {'{{settings.siteName}}'}. Scripts run inside the isolated preview.</p>
  </div>;
}
