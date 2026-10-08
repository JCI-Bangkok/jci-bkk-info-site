"use client";
import { useDocumentData } from './DocumentContext';
import { readBinding } from '@/lib/builder/bindings';

export function BindingControls({ value, onChange, keys, readOnly }: { value: Record<string, string>; onChange: (value: Record<string, string>) => void; keys: string[]; readOnly?: boolean }) {
  const data = useDocumentData();
  return <fieldset disabled={readOnly} className="space-y-3"><legend className="mb-2 text-sm font-semibold">Dynamic CMS values</legend><p className="text-xs text-slate-500">Enter a data path, for example title or settings.siteName. A missing value uses the block&apos;s text.</p>{keys.map(key => <label key={key} className="block text-xs">{key}<input value={value?.[key] || ''} placeholder="settings.siteName" onChange={event => onChange({ ...value, [key]: event.target.value })} className="mt-1 w-full rounded border p-2 text-sm" /><span className="mt-1 block text-slate-500">{value?.[key] ? readBinding(data, value[key]) || 'No matching value — using fallback.' : 'Static content'}</span></label>)}</fieldset>;
}
