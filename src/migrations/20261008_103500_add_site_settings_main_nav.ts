import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "site_settings_main_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings_main_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_main_nav_parent_id_fk') THEN
      ALTER TABLE "site_settings_main_nav" ADD CONSTRAINT "site_settings_main_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_main_nav_locales_parent_id_fk') THEN
      ALTER TABLE "site_settings_main_nav_locales" ADD CONSTRAINT "site_settings_main_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_main_nav"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "site_settings_main_nav_order_idx" ON "site_settings_main_nav" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_main_nav_parent_id_idx" ON "site_settings_main_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_main_nav_locales_locale_parent_id_unique" ON "site_settings_main_nav_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_main_nav" CASCADE;
  DROP TABLE "site_settings_main_nav_locales" CASCADE;`)
}
