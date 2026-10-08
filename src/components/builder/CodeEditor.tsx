"use client";

import dynamic from 'next/dynamic';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });
const languages = { html, css, javascript, json, text: () => [] };

export function CodeEditor({ value, onChange, language = 'json', readOnly = false }: {
  value: string;
  onChange: (value: string) => void;
  language?: keyof typeof languages;
  readOnly?: boolean;
}) {
  return <CodeMirror value={value} onChange={onChange} extensions={[languages[language]()]} theme="dark" height="360px" editable={!readOnly}
    basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: true, highlightActiveLine: true, bracketMatching: true, closeBrackets: true }}
    aria-label={`${language} code editor`} />;
}
