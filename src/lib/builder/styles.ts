export const builderBreakpoints = { mobile: 767, tablet: 1023 } as const;
export type DeviceStyle = { padding?: number; margin?: number; fontSize?: number; textAlign?: 'left' | 'center' | 'right'; hidden?: boolean };
export type BlockStyle = {
  background?: string; color?: string; borderColor?: string; borderWidth?: number; radius?: number;
  maxWidth?: number; desktop?: DeviceStyle; tablet?: DeviceStyle; mobile?: DeviceStyle;
  animation?: 'none' | 'fade' | 'rise';
};

const color = (value?: string) => value && /^(#[\da-f]{3,8}|transparent|currentColor|var\(--[a-z0-9-]+\))$/i.test(value) ? value : '';
const pixels = (value: unknown, max = 2400) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max ? `${value}px` : '';
function deviceCSS(value: DeviceStyle = {}) {
  return [
    ['padding', pixels(value.padding, 400)], ['margin', pixels(value.margin, 400)], ['font-size', pixels(value.fontSize, 200)],
    ['text-align', ['left', 'center', 'right'].includes(value.textAlign || '') ? value.textAlign : ''],
    ['display', value.hidden ? 'none' : value.hidden === false ? 'block' : ''],
  ].filter(([, val]) => val).map(([key, val]) => `${key}:${val};`).join('');
}

export function blockStyleCSS(id: string, style: BlockStyle) {
  const selector = `[data-builder-block="${id.replace(/[^a-zA-Z0-9_-]/g, '_')}"]`;
  const base = [
    ['background', color(style.background)], ['color', color(style.color)], ['border-color', color(style.borderColor)],
    ['border-width', pixels(style.borderWidth, 20)], ['border-radius', pixels(style.radius, 200)], ['max-width', pixels(style.maxWidth)],
    ['border-style', style.borderWidth ? 'solid' : ''],
  ].filter(([, val]) => val).map(([key, val]) => `${key}:${val};`).join('');
  function typography(value: DeviceStyle = {}) {
    const rules = `${pixels(value.fontSize, 200) ? `font-size:${pixels(value.fontSize, 200)};` : ''}${['left', 'center', 'right'].includes(value.textAlign || '') ? `text-align:${value.textAlign};` : ''}`;
    return rules ? `${selector} :is(h1,h2,h3,h4,h5,h6,p,a){${rules}}` : '';
  }
  return `${selector}{${base}${deviceCSS(style.desktop)}}${typography(style.desktop)}@media(max-width:${builderBreakpoints.tablet}px){${selector}{${deviceCSS(style.tablet)}}${typography(style.tablet)}}@media(max-width:${builderBreakpoints.mobile}px){${selector}{${deviceCSS(style.mobile)}}${typography(style.mobile)}}`;
}
