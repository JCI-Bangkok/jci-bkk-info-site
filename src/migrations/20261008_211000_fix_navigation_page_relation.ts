import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`
    ALTER TABLE "navigation_items" ADD COLUMN IF NOT EXISTS "page_id" integer;
    DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'navigation_items_page_id_pages_id_fk') THEN
      ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null;
    END IF; END $$;
    CREATE INDEX IF NOT EXISTS "navigation_items_page_id_idx" ON "navigation_items" ("page_id");
  `)
}

export async function down({ db }: MigrateDownArgs) {
  await db.execute(sql`
    ALTER TABLE "navigation_items" DROP COLUMN IF EXISTS "page_id";
  `)
}
