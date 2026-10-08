import * as migration_20261007_072713_cms_baseline from './20261007_072713_cms_baseline';
import * as migration_20261007_073412_cms_seo_editor from './20261007_073412_cms_seo_editor';
import * as migration_20261008_083342 from './20261008_083342';
import * as migration_20261008_093628_templates_collection from './20261008_093628_templates_collection';
import * as migration_20261008_094918 from './20261008_094918';
import * as migration_20261008_103500_add_site_settings_main_nav from './20261008_103500_add_site_settings_main_nav';
import * as migration_20261008_140000_fse_page_templates_and_navigation from './20261008_140000_fse_page_templates_and_navigation';
import * as migration_20261008_180000_builder_plugins_and_presets from './20261008_180000_builder_plugins_and_presets';

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
    name: '20261008_083342',
  },
  {
    up: migration_20261008_093628_templates_collection.up,
    down: migration_20261008_093628_templates_collection.down,
    name: '20261008_093628_templates_collection',
  },
  {
    up: migration_20261008_094918.up,
    down: migration_20261008_094918.down,
    name: '20261008_094918',
  },
  {
    up: migration_20261008_103500_add_site_settings_main_nav.up,
    down: migration_20261008_103500_add_site_settings_main_nav.down,
    name: '20261008_103500_add_site_settings_main_nav'
  },
  {
    up: migration_20261008_140000_fse_page_templates_and_navigation.up,
    down: migration_20261008_140000_fse_page_templates_and_navigation.down,
    name: '20261008_140000_fse_page_templates_and_navigation',
  },
  {
    up: migration_20261008_180000_builder_plugins_and_presets.up,
    down: migration_20261008_180000_builder_plugins_and_presets.down,
    name: '20261008_180000_builder_plugins_and_presets',
  },
];
