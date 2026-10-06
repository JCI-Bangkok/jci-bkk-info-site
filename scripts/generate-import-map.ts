import path from 'path';
import { pathToFileURL } from 'url';

async function main() {
  // Ensure S3 plugin is included in the import map regardless of environment
  process.env.S3_BUCKET = process.env.S3_BUCKET || 'placeholder-for-importmap';

  const mod = await import('../src/payload.config');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMod: any = mod;
  const cfg = await (rawMod.default?.default || rawMod.default);
  
  const generateImportMapPath = path.resolve(
    process.cwd(),
    'node_modules/payload/dist/bin/generateImportMap/index.js'
  );
  const { generateImportMap } = await import(pathToFileURL(generateImportMapPath).href);
  await generateImportMap(cfg, { force: true, log: true });
}

main().catch((err) => {
  console.error('Error generating import map:', err);
  process.exit(1);
});
