export type CodeSource = { html: string; css: string; javascript: string };

function escapeHTML(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

/** Text-only CMS bindings; never evaluate expressions or allow prototype traversal. */
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

export function codeDocument(source: CodeSource, documentData: unknown) {
  const styles = source.css.replace(/<\/style/gi, '<\\/style');
  const script = source.javascript.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https: data:; font-src https: data:; connect-src 'none'; form-action 'none';"><style>body{margin:0;font-family:system-ui,sans-serif}*{box-sizing:border-box}${styles}</style></head><body>${bindCodeHTML(source.html, documentData)}<script>${script}</script></body></html>`;
}
