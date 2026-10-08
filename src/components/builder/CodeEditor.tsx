"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

const languages = {
  html,
  css,
  javascript,
  typescript: () => javascript({ typescript: true, jsx: true }),
  tsx: () => javascript({ typescript: true, jsx: true }),
  json,
  text: () => []
};

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '360px',
  title,
  allowExpand = true,
}: {
  value: string;
  onChange: (value: string) => void;
  language?: keyof typeof languages;
  readOnly?: boolean;
  height?: string;
  title?: string;
  allowExpand?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle ESC key to collapse the editor
  useEffect(() => {
    if (!isExpanded) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isExpanded]);

  const getLanguageSupport = languages[language] || languages.javascript;
  const lineCount = (value || '').split('\n').length;
  const displayTitle = title || `${language.toUpperCase()} Editor`;

  return (
    <div className="relative group w-full">
      {/* Inline Toolbar with Expander Button */}
      {allowExpand && (
        <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 text-xs text-slate-300 rounded-t border-t border-x border-slate-700 select-none">
          <span className="font-mono text-[11px] flex items-center gap-1.5 text-slate-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {displayTitle}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 text-[11px] font-medium transition shadow-sm border border-slate-600"
            title="Expand code editor into a large modal"
          >
            <svg className="w-3 h-3 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Expand
          </button>
        </div>
      )}

      {/* Main CodeMirror Container */}
      <div className={allowExpand ? "rounded-b overflow-hidden border-b border-x border-slate-700" : "rounded overflow-hidden border border-slate-700"}>
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[getLanguageSupport()]}
          theme="dark"
          height={height}
          editable={!readOnly}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            autocompletion: true,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
          }}
          aria-label={`${language} code editor`}
        />
      </div>

      {/* Fullscreen Expander Modal (rendered via Portal to avoid sidebar overflow clipping) */}
      {isExpanded && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-6xl h-[88vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800 border-b border-slate-700 select-none">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  {displayTitle}
                </span>
                <span className="text-xs text-slate-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                  {lineCount} lines • {language.toUpperCase()}
                </span>
                {readOnly && (
                  <span className="text-xs text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    Read-Only
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[10px]">Esc</kbd> to exit
                </span>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                  Done (Collapse)
                </button>
              </div>
            </div>

            {/* Modal Body with Full-Height CodeMirror */}
            <div className="flex-1 overflow-hidden bg-slate-950">
              <CodeMirror
                value={value}
                onChange={onChange}
                extensions={[getLanguageSupport()]}
                theme="dark"
                height="calc(88vh - 60px)"
                editable={!readOnly}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  autocompletion: true,
                  highlightActiveLine: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  indentOnInput: true,
                }}
                aria-label={`${language} code editor expanded`}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
