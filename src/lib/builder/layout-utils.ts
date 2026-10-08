import type { Data } from '@puckeditor/core';

export function validateBuilderLayout(value: unknown): asserts value is Data {
  if (!value || typeof value !== 'object') throw new Error('Layout must be a JSON object.');
  const data = value as Data;
  if (!Array.isArray(data.content) || !data.root || typeof data.root !== 'object') throw new Error('Include content (array) and root (object).');
  const versions = (data.root.props as Record<string, unknown> | undefined)?.pluginVersions;
  if (versions && (typeof versions !== 'object' || Array.isArray(versions) || Object.values(versions).some(version => typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)))) throw new Error('Plugin versions must be an object of semantic version strings.');
  if (data.zones && (typeof data.zones !== 'object' || Array.isArray(data.zones))) throw new Error('Zones must be an object of block arrays.');
  const ids = new Set<string>();
  for (const blocks of [data.content, ...Object.values(data.zones || {})]) {
    if (!Array.isArray(blocks)) throw new Error('Each zone must contain an array.');
    for (const block of blocks) {
      if (!block || typeof block.type !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(block.type)) throw new Error('Every block needs a valid component type.');
      if (!block.props || typeof block.props.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(block.props.id)) throw new Error('Every block needs a stable props.id using letters, numbers, hyphens, or underscores.');
      if (ids.has(block.props.id)) throw new Error(`Duplicate block ID: ${block.props.id}`);
      ids.add(block.props.id);
      if (['Tabs', 'Accordion'].includes(block.type) && block.props.items !== undefined) {
        if (!Array.isArray(block.props.items) || block.props.items.some((item: any) => !item || typeof item.title !== 'string' || typeof item.content !== 'string')) throw new Error(`${block.type} items must contain title and content strings.`);
      }
      if (block.type === 'DynamicCode') {
        const source = block.props.source;
        if (!source || ['html', 'css', 'javascript'].some(key => typeof source[key] !== 'string')) throw new Error('DynamicCode needs HTML, CSS, and JavaScript strings in props.source.');
        if (typeof block.props.height !== 'number' || block.props.height < 100 || block.props.height > 2400) throw new Error('DynamicCode height must be between 100 and 2400 pixels.');
      }
    }
  }
  if (ids.size > 1000) throw new Error('A layout can contain at most 1000 blocks.');
  if (JSON.stringify(value).length > 2_000_000) throw new Error('Layout exceeds the 2 MB limit.');
}

/** Insert a complete section/tree without collisions with existing IDs or zones. */
export function appendBuilderLayout(current: Data, incoming: Data, newId: () => string = () => crypto.randomUUID()): Data {
  validateBuilderLayout(incoming);
  const map = new Map<string, string>();
  const existing = new Set([ ...current.content, ...Object.values(current.zones || {}).flat() ].map(block => block.props.id));
  for (const block of [...incoming.content, ...Object.values(incoming.zones || {}).flat()]) {
    let id = newId();
    for (let attempts = 0; existing.has(id); attempts++) { if (attempts >= 10) throw new Error('Unable to allocate a unique block ID.'); id = newId(); }
    existing.add(id);
    map.set(block.props.id, id);
  }
  const copy = (blocks: Data['content']) => blocks.map(block => ({ ...block, props: { ...structuredClone(block.props), id: map.get(block.props.id)! } }));
  const zones = { ...current.zones };
  for (const [key, blocks] of Object.entries(incoming.zones || {})) {
    const split = key.indexOf(':');
    const owner = key.slice(0, split);
    if (split < 1 || !map.has(owner)) throw new Error(`Orphan zone: ${key}`);
    zones[`${map.get(owner)}${key.slice(split)}`] = copy(blocks);
  }
  return { ...current, content: [...current.content, ...copy(incoming.content)], zones };
}

export function extractBuilderSection(data: Data, id: string): Data {
  const blocks = [...data.content, ...Object.values(data.zones || {}).flat()];
  const root = blocks.find(block => block.props.id === id);
  if (!root) throw new Error('Select a block to save a section.');
  const zones: NonNullable<Data['zones']> = {};
  const seen = new Set<string>();
  function collect(owner: string) {
    if (seen.has(owner)) return;
    seen.add(owner);
    for (const [key, children] of Object.entries(data.zones || {})) {
      if (!key.startsWith(`${owner}:`)) continue;
      zones[key] = structuredClone(children);
      for (const child of children) collect(child.props.id);
    }
  }
  collect(id);
  return { root: { props: {} }, content: [structuredClone(root)], zones };
}
