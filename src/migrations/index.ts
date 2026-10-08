import * as migration_20261007_072713_cms_baseline from './20261007_072713_cms_baseline';
import * as migration_20261007_073412_cms_seo_editor from './20261007_073412_cms_seo_editor';
import * as migration_20261008_083342 from './20261008_083342';

export const migrations = [
  {
    up: migration_20261007_072713_cms_baseline.up,
    down: migration_20261007_072713_cms_baseline.down,
    name: '20261007_072713_cms_baseline',
  },
  {
    up: migration_20261007_073412_cms_seo_editor.up,
    down: migration_20261007_073412_cms_seo_editor.down,
    name: '20261007_073412_cms_seo_editor',
  },
  {
    up: migration_20261008_083342.up,
    down: migration_20261008_083342.down,
    name: '20261008_083342'
  },
];
