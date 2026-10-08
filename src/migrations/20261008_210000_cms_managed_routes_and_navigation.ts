import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_page_type" AS ENUM('home','about','events','members','membership','contact','photobomb','news','projects','board','custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_version_page_type" AS ENUM('home','about','events','members','membership','contact','photobomb','news','projects','board','custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "page_type" "enum_pages_page_type" DEFAULT 'custom' NOT NULL;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "legacy_slugs" jsonb DEFAULT '[]'::jsonb;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_page_type" "enum__pages_v_version_page_type" DEFAULT 'custom' NOT NULL;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_legacy_slugs" jsonb DEFAULT '[]'::jsonb;
    CREATE INDEX IF NOT EXISTS "pages_page_type_idx" ON "pages" ("page_type");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_page_type_idx" ON "_pages_v" ("version_page_type");

    UPDATE "pages" SET "page_type" = CASE "slug"
      WHEN 'home' THEN 'home'::enum_pages_page_type WHEN 'about' THEN 'about'::enum_pages_page_type
      WHEN 'events' THEN 'events'::enum_pages_page_type WHEN 'members' THEN 'members'::enum_pages_page_type
      WHEN 'membership' THEN 'membership'::enum_pages_page_type WHEN 'contact' THEN 'contact'::enum_pages_page_type
      WHEN 'photobomb' THEN 'photobomb'::enum_pages_page_type WHEN 'news' THEN 'news'::enum_pages_page_type
      WHEN 'projects' THEN 'projects'::enum_pages_page_type WHEN 'about/board' THEN 'board'::enum_pages_page_type
      ELSE 'custom'::enum_pages_page_type END;

    ALTER TABLE "navigation_items" ALTER COLUMN "href" DROP NOT NULL;
    DO $$ BEGIN CREATE TYPE "public"."enum_navigation_items_link_type" AS ENUM('page','custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
    ALTER TABLE "navigation_items" ADD COLUMN IF NOT EXISTS "link_type" "enum_navigation_items_link_type" DEFAULT 'custom';
    ALTER TABLE "navigation_items" ADD COLUMN IF NOT EXISTS "open_in_new_tab" boolean DEFAULT false;
    UPDATE "navigation_items" SET "link_type" = 'custom' WHERE "link_type" IS NULL;
    CREATE TABLE IF NOT EXISTS "navigation_rels" (
      "id" serial PRIMARY KEY NOT NULL, "order" integer, "parent_id" integer NOT NULL, "path" varchar NOT NULL, "pages_id" integer
    );
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'navigation_rels_parent_fk') THEN ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade; END IF; END $$;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'navigation_rels_pages_fk') THEN ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade; END IF; END $$;
    CREATE INDEX IF NOT EXISTS "navigation_rels_parent_idx" ON "navigation_rels" ("parent_id");
    CREATE INDEX IF NOT EXISTS "navigation_rels_path_idx" ON "navigation_rels" ("path");
    CREATE INDEX IF NOT EXISTS "navigation_rels_pages_id_idx" ON "navigation_rels" ("pages_id");

    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'news-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'projects-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'board-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'news-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'projects-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'board-listing' BEFORE 'archive';
  `)
}

export async function down({ db }: MigrateDownArgs) {
  await db.execute(sql`
    DROP TABLE IF EXISTS "navigation_rels";
    ALTER TABLE "navigation_items" DROP COLUMN IF EXISTS "open_in_new_tab";
    ALTER TABLE "navigation_items" DROP COLUMN IF EXISTS "link_type";
    ALTER TABLE "navigation_items" ALTER COLUMN "href" SET NOT NULL;
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_legacy_slugs";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_page_type";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "legacy_slugs";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "page_type";
    DROP TYPE IF EXISTS "public"."enum_navigation_items_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_page_type";
    DROP TYPE IF EXISTS "public"."enum_pages_page_type";
  `)
}
