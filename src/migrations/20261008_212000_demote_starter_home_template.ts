import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs) {
  await db.execute(sql`UPDATE "templates" SET "status" = 'draft' WHERE "type" = 'home' AND "status" = 'published'`)
}

export async function down({ db }: MigrateDownArgs) {
  // The starter was intentionally demoted so the legacy homepage remains authoritative.
  // Editors can publish a replacement Home template from the CMS.
  await db.execute(sql`UPDATE "templates" SET "status" = 'published' WHERE "type" = 'home' AND "status" = 'draft'`)
}
