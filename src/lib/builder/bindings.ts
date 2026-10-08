export function readBinding(data: unknown, path: string): string | undefined {
  if (typeof path !== 'string' || !path) return undefined;
  let value = data;
  for (const key of path.split('.')) {
    if (['constructor', 'prototype', '__proto__'].includes(key) || !value || typeof value !== 'object' || !Object.hasOwn(value, key)) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : undefined;
}

/** Links can be local paths, anchors, HTTPS/HTTP, email, or phone. */
export function safeBuilderHref(value: string): string {
  if (typeof value !== 'string') return '#';
  const href = value.trim();
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) && !/[\u0000-\u0020]/.test(href) ? href : '#';
}
