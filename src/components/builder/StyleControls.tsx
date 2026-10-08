"use client";
import { useState } from 'react';
import type { BlockStyle, DeviceStyle } from '@/lib/builder/styles';

export function StyleControls({ value, onChange, readOnly }: { value: BlockStyle; onChange: (value: BlockStyle) => void; readOnly?: boolean }) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const style = value || {};
  const current = style[device] || {};
  function update(key: keyof DeviceStyle, next: unknown) { onChange({ ...style, [device]: { ...current, [key]: next } }); }
  const fieldClass = 'w-full rounded border border-slate-300 bg-white p-2 text-sm';
  return <fieldset disabled={readOnly} className="space-y-4">
    <legend className="mb-3 text-sm font-semibold">Appearance & responsive styles</legend>
    <div className="flex gap-1">{(['desktop', 'tablet', 'mobile'] as const).map(item => <button type="button" key={item} aria-pressed={item === device} onClick={() => setDevice(item)} className={`rounded border px-2 py-2 text-xs ${item === device ? 'bg-sky-700 text-white' : ''}`}>{item}</button>)}</div>
    <p className="text-xs text-slate-500">Blank values inherit. Desktop applies everywhere; tablet applies at 1023px and below; mobile at 767px and below.</p>
    <div className="grid grid-cols-2 gap-3">
      {(['padding', 'margin', 'fontSize'] as const).map(key => <label key={key} className="text-xs">{key === 'fontSize' ? 'Font size' : key} (px)<input aria-label={`${device} ${key}`} type="number" min="0" max={key === 'fontSize' ? 200 : 400} className={fieldClass} value={current[key] ?? ''} onChange={event => update(key, event.target.value === '' ? undefined : Number(event.target.value))} /></label>)}
      <label className="text-xs">Alignment<select className={fieldClass} value={current.textAlign || ''} onChange={event => update('textAlign', event.target.value || undefined)}><option value="">Inherit</option><option>left</option><option>center</option><option>right</option></select></label>
    </div>
    <label className="block text-xs">Visibility<select className={fieldClass} value={current.hidden === undefined ? '' : current.hidden ? 'hidden' : 'visible'} onChange={event => update('hidden', event.target.value === '' ? undefined : event.target.value === 'hidden')}><option value="">Inherit</option><option value="visible">Visible</option><option value="hidden">Hidden on this device</option></select></label>
    <div className="grid grid-cols-2 gap-3">
      {(['background', 'color', 'borderColor'] as const).map(key => <label key={key} className="text-xs">{key}<input className={fieldClass} placeholder="#0c2340 or var(--jci-blue)" value={style[key] || ''} onChange={event => onChange({ ...style, [key]: event.target.value })} /></label>)}
      {(['borderWidth', 'radius', 'maxWidth'] as const).map(key => <label key={key} className="text-xs">{key} (px)<input className={fieldClass} type="number" min="0" max={key === 'borderWidth' ? 20 : key === 'radius' ? 200 : 2400} value={style[key] ?? ''} onChange={event => onChange({ ...style, [key]: event.target.value === '' ? undefined : Number(event.target.value) })} /></label>)}
    </div>
    <label className="block text-xs">Entrance motion<select className={fieldClass} value={style.animation || 'none'} onChange={event => onChange({ ...style, animation: event.target.value as BlockStyle['animation'] })}><option value="none">None</option><option value="fade">Fade in</option><option value="rise">Rise in</option></select></label>
    <button type="button" className="text-xs text-sky-700 underline" onClick={() => onChange({ ...style, [device]: {} })}>Reset {device} overrides</button>
  </fieldset>;
}
