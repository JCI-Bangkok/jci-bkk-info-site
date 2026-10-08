import { transform } from 'sucrase';

export type CodeSource = {
  html: string;
  css: string;
  javascript: string;
  typescript?: string;
};

function escapeHTML(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

/**
 * Cybersecurity: Text-only CMS bindings; strictly blocks prototype pollution
 * and never evaluates expressions.
 */
export function bindCodeHTML(source: string, documentData: unknown) {
  return source.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    let value: unknown = documentData;
    for (const key of path.split('.')) {
      if (['__proto__', 'prototype', 'constructor'].includes(key) || !value || typeof value !== 'object' || !Object.hasOwn(value, key)) return '';
      value = (value as Record<string, unknown>)[key];
    }
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? escapeHTML(value) : '';
  });
}

/**
 * Cybersecurity & Compilation: Transpile TypeScript / TSX to safe JavaScript
 * using Sucrase without invoking eval() or Node compiler child processes.
 */
export function transpileTypeScript(tsCode: string): { code: string; error?: string } {
  if (!tsCode || !tsCode.trim()) return { code: '' };
  try {
    const res = transform(tsCode, {
      transforms: ['typescript', 'jsx'],
      jsxRuntime: 'classic',
      production: true,
    });
    return { code: res.code };
  } catch (err: any) {
    const errorMsg = err?.message || 'TypeScript transpilation error';
    return { code: '', error: errorMsg };
  }
}

/**
 * Cybersecurity: Generates a sandboxed HTML document string with strict CSP.
 * - default-src 'none': Disallows loading external objects and plugins
 * - script-src 'unsafe-inline': Scripts run only from the inline payload
 * - connect-src 'none': Strictly blocks exfiltration via fetch, XHR, WebSocket, or Beacon
 * - form-action 'none': Blocks phishing forms and form hijacking
 */
export function codeDocument(source: CodeSource, documentData: unknown) {
  const styles = (source.css || '').replace(/<\/style/gi, '<\\/style');
  
  // 1. Process custom JavaScript
  let scriptContent = source.javascript || '';

  // 2. Transpile and append TypeScript if present
  let tsCompileError = '';
  if (source.typescript && source.typescript.trim()) {
    const transpileResult = transpileTypeScript(source.typescript);
    if (transpileResult.error) {
      tsCompileError = transpileResult.error;
    } else if (transpileResult.code) {
      scriptContent += `\n/* Transpiled TypeScript */\n${transpileResult.code}`;
    }
  }

  // 3. Escape closing script tags to prevent script-breakout attacks
  const safeScript = scriptContent.replace(/<\/script/gi, '<\\/script');

  // 4. Render error overlay if TypeScript failed to compile
  const errorBanner = tsCompileError
    ? `<div style="background:#fee2e2;border:1px solid #f87171;color:#b91c1c;padding:12px;margin:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;"><strong>[TypeScript Compilation Error]</strong>\n${escapeHTML(tsCompileError)}</div>`
    : '';

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https: data:; font-src https: data:; connect-src 'none'; form-action 'none';"><style>body{margin:0;font-family:system-ui,sans-serif}*{box-sizing:border-box}${styles}</style></head><body>${errorBanner}${bindCodeHTML(source.html || '', documentData)}<script>try{${safeScript}}catch(err){console.error("Dynamic code error:",err);var d=document.createElement("div");d.style.cssText="background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:8px;margin:8px;border-radius:4px;font-family:monospace;font-size:12px;";d.textContent="[Runtime Error] "+(err&&err.message?err.message:err);document.body.prepend(d);}</script></body></html>`;
}
