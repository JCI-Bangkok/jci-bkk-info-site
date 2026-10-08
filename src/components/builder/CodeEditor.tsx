"use client";

import dynamic from 'next/dynamic';
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

export function CodeEditor({ value, onChange, language = 'json', readOnly = false, height = '360px' }: {
  value: string;
  onChange: (value: string) => void;
  language?: keyof typeof languages;
  readOnly?: boolean;
  height?: string;
}) {
  const getLanguageSupport = languages[language] || languages.javascript;
  return <CodeMirror
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
  />;
}
