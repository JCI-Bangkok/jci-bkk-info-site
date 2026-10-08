import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "builder_settings" ("id" serial PRIMARY KEY NOT NULL, "updated_at" timestamp(3) with time zone, "created_at" timestamp(3) with time zone);
    CREATE TABLE IF NOT EXISTS "builder_settings_plugins" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" varchar PRIMARY KEY NOT NULL,
      "plugin_id" varchar NOT NULL, "enabled" boolean DEFAULT true
    );
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'builder_settings_plugins_parent_id_fk') THEN
        ALTER TABLE "builder_settings_plugins" ADD CONSTRAINT "builder_settings_plugins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."builder_settings"("id") ON DELETE cascade;
      END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "builder_settings_plugins_order_idx" ON "builder_settings_plugins" ("_order");
    CREATE INDEX IF NOT EXISTS "builder_settings_plugins_parent_id_idx" ON "builder_settings_plugins" ("_parent_id");
    CREATE TABLE IF NOT EXISTS "builder_presets" (
      "id" serial PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "puck_layout" jsonb NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL, "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "builder_presets_updated_at_idx" ON "builder_presets" ("updated_at");
    CREATE INDEX IF NOT EXISTS "builder_presets_created_at_idx" ON "builder_presets" ("created_at");
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "builder_presets_id" integer;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_builder_presets_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_builder_presets_fk" FOREIGN KEY ("builder_presets_id") REFERENCES "public"."builder_presets"("id") ON DELETE cascade;
      END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_builder_presets_id_idx" ON "payload_locked_documents_rels" ("builder_presets_id");
  `);
}

export async function down({ db }: MigrateDownArgs) {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "builder_presets_id";
    DROP TABLE "builder_presets";
    DROP TABLE "builder_settings_plugins";
    DROP TABLE "builder_settings";
  `);
}
