import assert from 'node:assert/strict';
import { getPayload } from 'payload';
import config from '../src/payload.config';
import { starterSections } from '../src/lib/builder/starter-sections';

/** Creates and removes only its own verification record; existing sections stay intact. */
async function check() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'builder-settings' });
  assert.ok(Array.isArray(settings.plugins) || settings.plugins == null);
  const fixture = await payload.create({ collection: 'builder-presets', data: { title: `Builder verification ${Date.now()}`, puckLayout: starterSections[1].layout } });
  try {
    const stored = await payload.findByID({ collection: 'builder-presets', id: fixture.id });
    assert.deepEqual(stored.puckLayout, starterSections[1].layout);
    const updated = await payload.update({ collection: 'builder-presets', id: fixture.id, data: { title: `${fixture.title} updated` } });
    assert.equal(updated.title, `${fixture.title} updated`);
    await assert.rejects(payload.create({ collection: 'builder-presets', overrideAccess: false, data: { title: 'Unauthorized section', puckLayout: starterSections[0].layout } }));
    console.log('CMS builder checks passed: settings schema, nested-section create/read/update, and unauthenticated write protection.');
  } finally {
    await payload.delete({ collection: 'builder-presets', id: fixture.id });
  }
}
check().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1) });
