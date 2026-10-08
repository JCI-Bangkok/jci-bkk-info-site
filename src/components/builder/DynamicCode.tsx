"use client";

import { useState } from 'react';
import { useDocumentData } from './DocumentContext';
import { CodeEditor } from './CodeEditor';
import { codeDocument, type CodeSource } from '@/lib/builder/code-document';

export function DynamicCodePreview({
  source,
  height = 480,
  isEditor = false,
}: {
  source: CodeSource;
  height?: number;
  isEditor?: boolean;
}) {
  const data = useDocumentData();
  const normalized: CodeSource = {
    html: source?.html || '',
    css: source?.css || '',
    javascript: source?.javascript || '',
    typescript: source?.typescript || '',
  };

  return (
    <div className="relative w-full">
      <iframe
        title="Dynamic code live preview"
        // Cybersecurity: allow-scripts ONLY. Without allow-same-origin, the iframe is treated as an opaque origin (null),
        // blocking access to parent window, cookies, and local/session storage.
        sandbox="allow-scripts allow-top-navigation-by-user-activation allow-forms"
        referrerPolicy="no-referrer"
        srcDoc={codeDocument(normalized, data)}
        style={{ width: '100%', height, border: 0, display: 'block' }}
        className={isEditor ? "pointer-events-none" : "w-full"}
      />
      {/* Click capture overlay: ensures clicking on the canvas block selects it in Puck so right menu opens */}
      {isEditor && (
        <div
          className="absolute inset-0 cursor-pointer pointer-events-auto"
          title="Click to select and edit code in Right Menu"
        />
      )}
    </div>
  );
}

export function DynamicCodeField({
  value,
  onChange,
  readOnly,
}: {
  value: CodeSource;
  onChange: (source: CodeSource) => void;
  readOnly?: boolean;
}) {
  const [view, setView] = useState<'code' | 'live' | 'split'>('code');
  const [language, setLanguage] = useState<keyof CodeSource>('typescript');

  const source: CodeSource = {
    html: value?.html || '',
    css: value?.css || '',
    javascript: value?.javascript || '',
    typescript: value?.typescript || '',
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2" aria-label="Code view">
        <div className="flex gap-1 rounded bg-slate-100 p-0.5">
          {(['code', 'live', 'split'] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              aria-pressed={mode === view}
              onClick={() => setView(mode)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                mode === view
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'code' ? 'Code' : mode === 'live' ? 'Live' : 'Split'}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          🛡️ Sandboxed
        </span>
      </div>

      {view !== 'live' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Language:{' '}
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as keyof CodeSource)}
                className="ml-2 rounded border border-slate-300 bg-white p-1 text-xs text-slate-800"
              >
                <option value="typescript">TypeScript / TSX</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </label>
            <span className="text-[10px] text-slate-400">
              {language === 'typescript' ? 'Auto-transpiled safely' : ''}
            </span>
          </div>

          <CodeEditor
            value={source[language] || ''}
            language={language}
            readOnly={readOnly}
            height={view === 'split' ? '280px' : '360px'}
            title={`Dynamic Code: ${language.toUpperCase()}`}
            allowExpand={true}
            onChange={(code) => onChange({ ...source, [language]: code })}
          />
        </div>
      )}

      {view !== 'code' && (
        <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-inner">
          <DynamicCodePreview source={source} height={view === 'split' ? 240 : 360} />
        </div>
      )}

      <p className="text-[11px] leading-relaxed text-slate-500">
        Use CMS values like <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{'{{title}}'}</code> or{' '}
        <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">{'{{settings.siteName}}'}</code>. Execution is isolated in a sandboxed iframe with strict Content Security Policy.
      </p>
    </div>
  );
}
