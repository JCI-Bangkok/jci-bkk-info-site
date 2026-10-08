import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'home' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'events-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'members-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'about' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'contact' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'membership' BEFORE 'archive';
    ALTER TYPE "public"."enum_templates_type" ADD VALUE IF NOT EXISTS 'photobomb' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'home' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'events-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'members-listing' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'about' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'contact' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'membership' BEFORE 'archive';
    ALTER TYPE "public"."enum__templates_v_version_type" ADD VALUE IF NOT EXISTS 'photobomb' BEFORE 'archive';

    CREATE TABLE "navigation" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE "navigation_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "label_th" varchar,
      "href" varchar NOT NULL
    );
    ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
    CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "navigation_items" CASCADE;
    DROP TABLE "navigation" CASCADE;
  `)
}
