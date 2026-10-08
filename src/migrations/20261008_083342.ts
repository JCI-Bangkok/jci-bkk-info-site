import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'th');
  ALTER TABLE "pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "pages_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" DROP NOT NULL;
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_title" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "puck_layout" jsonb;
  ALTER TABLE "pages" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "version_puck_layout" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version__status" "enum__pages_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_pages_v" ADD COLUMN "latest" boolean;
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "pages__status_idx";
  DROP INDEX "_pages_v_version_version__status_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "_pages_v_latest_idx";
  ALTER TABLE "pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "pages_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" SET NOT NULL;
  ALTER TABLE "_pages_v_locales" ALTER COLUMN "version_title" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "puck_layout";
  ALTER TABLE "pages" DROP COLUMN "_status";
  ALTER TABLE "_pages_v" DROP COLUMN "version_puck_layout";
  ALTER TABLE "_pages_v" DROP COLUMN "version__status";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_pages_v" DROP COLUMN "latest";
  DROP TYPE "public"."enum__pages_v_published_locale";`)
}
