import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_templates_type" ADD VALUE 'project-single' BEFORE 'archive';
  ALTER TYPE "public"."enum_templates_type" ADD VALUE 'member-board-year' BEFORE 'archive';
  ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE 'project-single' BEFORE 'archive';
  ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE 'member-board-year' BEFORE 'archive';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_templates_type";
  CREATE TYPE "public"."enum_templates_type" AS ENUM('header', 'footer', 'event-single', 'news-single', 'archive');
  ALTER TABLE "templates" ALTER COLUMN "type" SET DATA TYPE "public"."enum_templates_type" USING "type"::"public"."enum_templates_type";
  ALTER TABLE "_templates_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  DROP TYPE "public"."enum__templates_v_version_type";
  CREATE TYPE "public"."enum__templates_v_version_type" AS ENUM('header', 'footer', 'event-single', 'news-single', 'archive');
  ALTER TABLE "_templates_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__templates_v_version_type" USING "version_type"::"public"."enum__templates_v_version_type";`)
}
