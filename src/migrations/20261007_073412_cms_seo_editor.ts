import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_eventdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum__events_v_version_enddate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('training', 'networking', 'community', 'general', 'international', 'partner');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'upcoming', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_sdg_tags" AS ENUM('sdg-1', 'sdg-2', 'sdg-3', 'sdg-4', 'sdg-5', 'sdg-6', 'sdg-7', 'sdg-8', 'sdg-9', 'sdg-10', 'sdg-11', 'sdg-12', 'sdg-13', 'sdg-14', 'sdg-15', 'sdg-16', 'sdg-17');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('community', 'youth', 'sustainability', 'entrepreneurship', 'international');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('news', 'event-recap', 'member-story', 'president-message', 'partner-announcement', 'knowledge');
  CREATE TYPE "public"."enum__articles_v_version_publishdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_content" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyphrase" varchar,
  	"version_seo_social_title" varchar,
  	"version_seo_social_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_image_alt" varchar,
  	"version_seo_canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_version_facebook_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_event_date" timestamp(3) with time zone NOT NULL,
  	"version_eventdate_tz" "enum__events_v_version_eventdate_tz" DEFAULT 'Asia/Bangkok' NOT NULL,
  	"version_event_time" varchar,
  	"version_end_date" timestamp(3) with time zone,
  	"version_enddate_tz" "enum__events_v_version_enddate_tz" DEFAULT 'Asia/Bangkok',
  	"version_venue_address_postal_code" varchar,
  	"version_venue_address_address_country" varchar,
  	"version_offer_price" numeric,
  	"version_offer_currency" varchar DEFAULT 'THB',
  	"version_google_maps_link" varchar,
  	"version_registration_link" varchar,
  	"version_event_type" "enum__events_v_version_event_type" NOT NULL,
  	"version_host_committee" varchar,
  	"version_cover_image_id" integer NOT NULL,
  	"version_status" "enum__events_v_version_status" DEFAULT 'draft',
  	"version_featured" boolean DEFAULT false,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_price" varchar,
  	"version_venue" varchar NOT NULL,
  	"version_venue_address_street_address" varchar,
  	"version_venue_address_address_locality" varchar,
  	"version_venue_address_address_region" varchar,
  	"version_short_description" varchar NOT NULL,
  	"version_full_description" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyphrase" varchar,
  	"version_seo_social_title" varchar,
  	"version_seo_social_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_image_alt" varchar,
  	"version_seo_canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v_version_impact_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_impact_numbers_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_sdg_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_sdg_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_status" "enum__projects_v_version_status" DEFAULT 'draft' NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_year" numeric NOT NULL,
  	"version_category" "enum__projects_v_version_category" NOT NULL,
  	"version_report_file_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_problem_statement" varchar NOT NULL,
  	"version_target_beneficiaries" varchar,
  	"version_activities" jsonb,
  	"version_outcomes" jsonb,
  	"version_partners" varchar,
  	"version_cta" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyphrase" varchar,
  	"version_seo_social_title" varchar,
  	"version_seo_social_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_image_alt" varchar,
  	"version_seo_canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_tags_locales" (
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_status" "enum__articles_v_version_status" DEFAULT 'draft' NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_author_id" integer NOT NULL,
  	"version_category" "enum__articles_v_version_category" NOT NULL,
  	"version_cover_image_id" integer NOT NULL,
  	"version_publish_date" timestamp(3) with time zone NOT NULL,
  	"version_publishdate_tz" "enum__articles_v_version_publishdate_tz" DEFAULT 'Asia/Bangkok' NOT NULL,
  	"version_related_event_id" integer,
  	"version_related_project_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_exclude_from_sitemap" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_author_display_name" varchar,
  	"version_summary" varchar NOT NULL,
  	"version_body" jsonb NOT NULL,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_focus_keyphrase" varchar,
  	"version_seo_social_title" varchar,
  	"version_seo_social_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_image_alt" varchar,
  	"version_seo_canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "seo_no_follow" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "seo_exclude_from_sitemap" boolean DEFAULT false;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_focus_keyphrase" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_social_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_social_description" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_image_alt" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "events" ADD COLUMN "venue_address_postal_code" varchar;
  ALTER TABLE "events" ADD COLUMN "venue_address_address_country" varchar;
  ALTER TABLE "events" ADD COLUMN "offer_price" numeric;
  ALTER TABLE "events" ADD COLUMN "offer_currency" varchar DEFAULT 'THB';
  ALTER TABLE "events" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "seo_no_follow" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "seo_exclude_from_sitemap" boolean DEFAULT false;
  ALTER TABLE "events_locales" ADD COLUMN "venue_address_street_address" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "venue_address_address_locality" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "venue_address_address_region" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_focus_keyphrase" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_social_title" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_social_description" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "events_locales" ADD COLUMN "seo_image_alt" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "status" "enum_projects_status" DEFAULT 'draft' NOT NULL;
  UPDATE "projects" SET "status" = 'published';
  ALTER TABLE "projects" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "seo_no_follow" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "seo_exclude_from_sitemap" boolean DEFAULT false;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_focus_keyphrase" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_social_title" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_social_description" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_image_alt" varchar;
  ALTER TABLE "projects_locales" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "articles" ADD COLUMN "status" "enum_articles_status" DEFAULT 'draft' NOT NULL;
  UPDATE "articles" SET "status" = 'published';
  ALTER TABLE "articles" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "articles" ADD COLUMN "seo_no_follow" boolean DEFAULT false;
  ALTER TABLE "articles" ADD COLUMN "seo_exclude_from_sitemap" boolean DEFAULT false;
  ALTER TABLE "articles_locales" ADD COLUMN "author_display_name" varchar;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_focus_keyphrase" varchar;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_social_title" varchar;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_social_description" varchar;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_image_alt" varchar;
  ALTER TABLE "articles_locales" ADD COLUMN "seo_canonical_url" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "default_social_image_id" integer;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_facebook_posts" ADD CONSTRAINT "_events_v_version_facebook_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_impact_numbers" ADD CONSTRAINT "_projects_v_version_impact_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_impact_numbers_locales" ADD CONSTRAINT "_projects_v_version_impact_numbers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_impact_numbers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_sdg_tags" ADD CONSTRAINT "_projects_v_version_sdg_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_report_file_id_media_id_fk" FOREIGN KEY ("version_report_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_tags" ADD CONSTRAINT "_articles_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_tags_locales" ADD CONSTRAINT "_articles_v_version_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_version_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_related_event_id_events_id_fk" FOREIGN KEY ("version_related_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_related_project_id_projects_id_fk" FOREIGN KEY ("version_related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v_locales" USING btree ("version_seo_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_facebook_posts_order_idx" ON "_events_v_version_facebook_posts" USING btree ("_order");
  CREATE INDEX "_events_v_version_facebook_posts_parent_id_idx" ON "_events_v_version_facebook_posts" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_cover_image_idx" ON "_events_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "_events_v_locales" USING btree ("version_seo_image_id","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_impact_numbers_order_idx" ON "_projects_v_version_impact_numbers" USING btree ("_order");
  CREATE INDEX "_projects_v_version_impact_numbers_parent_id_idx" ON "_projects_v_version_impact_numbers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_impact_numbers_locales_locale_parent_id_" ON "_projects_v_version_impact_numbers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_sdg_tags_order_idx" ON "_projects_v_version_sdg_tags" USING btree ("order");
  CREATE INDEX "_projects_v_version_sdg_tags_parent_idx" ON "_projects_v_version_sdg_tags" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_report_file_idx" ON "_projects_v" USING btree ("version_report_file_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_version_seo_version_seo_image_idx" ON "_projects_v_locales" USING btree ("version_seo_image_id","_locale");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_tags_order_idx" ON "_articles_v_version_tags" USING btree ("_order");
  CREATE INDEX "_articles_v_version_tags_parent_id_idx" ON "_articles_v_version_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_articles_v_version_tags_locales_locale_parent_id_unique" ON "_articles_v_version_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_version_related_event_idx" ON "_articles_v" USING btree ("version_related_event_id");
  CREATE INDEX "_articles_v_version_version_related_project_idx" ON "_articles_v" USING btree ("version_related_project_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_version_seo_version_seo_image_idx" ON "_articles_v_locales" USING btree ("version_seo_image_id","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_default_social_image_id_media_id_fk" FOREIGN KEY ("default_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages_locales" USING btree ("seo_image_id","_locale");
  CREATE INDEX "events_seo_seo_image_idx" ON "events_locales" USING btree ("seo_image_id","_locale");
  CREATE INDEX "projects_seo_seo_image_idx" ON "projects_locales" USING btree ("seo_image_id","_locale");
  CREATE INDEX "articles_seo_seo_image_idx" ON "articles_locales" USING btree ("seo_image_id","_locale");
  CREATE INDEX "site_settings_default_social_image_idx" ON "site_settings_locales" USING btree ("default_social_image_id","_locale");`)
  await db.execute(sql`
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('home', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('Home', 'en'), ('หน้าแรก', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('about', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('About', 'en'), ('เกี่ยวกับเรา', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('events', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('Events', 'en'), ('กิจกรรม', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('members', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('Members', 'en'), ('สมาชิก', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('membership', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('Membership', 'en'), ('สมัครสมาชิก', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('contact', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('Contact', 'en'), ('ติดต่อเรา', 'th')) AS translations(title, locale);
  WITH added AS (INSERT INTO pages (slug, status) VALUES ('photobomb', 'published') ON CONFLICT (slug) DO NOTHING RETURNING id) INSERT INTO pages_locales (title, _locale, _parent_id) SELECT translations.title, translations.locale::_locales, added.id FROM added CROSS JOIN (VALUES ('PhotoBomb', 'en'), ('ภาพกิจกรรม', 'th')) AS translations(title, locale);
  `);

}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_facebook_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_impact_numbers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_impact_numbers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_sdg_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_events_v_version_facebook_posts" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "_projects_v_version_impact_numbers" CASCADE;
  DROP TABLE "_projects_v_version_impact_numbers_locales" CASCADE;
  DROP TABLE "_projects_v_version_sdg_tags" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_articles_v_version_tags" CASCADE;
  DROP TABLE "_articles_v_version_tags_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_seo_image_id_media_id_fk";
  
  ALTER TABLE "events_locales" DROP CONSTRAINT "events_locales_seo_image_id_media_id_fk";
  
  ALTER TABLE "projects_locales" DROP CONSTRAINT "projects_locales_seo_image_id_media_id_fk";
  
  ALTER TABLE "articles_locales" DROP CONSTRAINT "articles_locales_seo_image_id_media_id_fk";
  
  ALTER TABLE "site_settings_locales" DROP CONSTRAINT "site_settings_locales_default_social_image_id_media_id_fk";
  
  DROP INDEX "pages_seo_seo_image_idx";
  DROP INDEX "events_seo_seo_image_idx";
  DROP INDEX "projects_seo_seo_image_idx";
  DROP INDEX "articles_seo_seo_image_idx";
  DROP INDEX "site_settings_default_social_image_idx";
  ALTER TABLE "pages" DROP COLUMN "seo_no_index";
  ALTER TABLE "pages" DROP COLUMN "seo_no_follow";
  ALTER TABLE "pages" DROP COLUMN "seo_exclude_from_sitemap";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_focus_keyphrase";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_social_title";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_social_description";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_image_id";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_image_alt";
  ALTER TABLE "pages_locales" DROP COLUMN "seo_canonical_url";
  ALTER TABLE "events" DROP COLUMN "venue_address_postal_code";
  ALTER TABLE "events" DROP COLUMN "venue_address_address_country";
  ALTER TABLE "events" DROP COLUMN "offer_price";
  ALTER TABLE "events" DROP COLUMN "offer_currency";
  ALTER TABLE "events" DROP COLUMN "seo_no_index";
  ALTER TABLE "events" DROP COLUMN "seo_no_follow";
  ALTER TABLE "events" DROP COLUMN "seo_exclude_from_sitemap";
  ALTER TABLE "events_locales" DROP COLUMN "venue_address_street_address";
  ALTER TABLE "events_locales" DROP COLUMN "venue_address_address_locality";
  ALTER TABLE "events_locales" DROP COLUMN "venue_address_address_region";
  ALTER TABLE "events_locales" DROP COLUMN "seo_title";
  ALTER TABLE "events_locales" DROP COLUMN "seo_description";
  ALTER TABLE "events_locales" DROP COLUMN "seo_focus_keyphrase";
  ALTER TABLE "events_locales" DROP COLUMN "seo_social_title";
  ALTER TABLE "events_locales" DROP COLUMN "seo_social_description";
  ALTER TABLE "events_locales" DROP COLUMN "seo_image_id";
  ALTER TABLE "events_locales" DROP COLUMN "seo_image_alt";
  ALTER TABLE "events_locales" DROP COLUMN "seo_canonical_url";
  ALTER TABLE "projects" DROP COLUMN "status";
  ALTER TABLE "projects" DROP COLUMN "seo_no_index";
  ALTER TABLE "projects" DROP COLUMN "seo_no_follow";
  ALTER TABLE "projects" DROP COLUMN "seo_exclude_from_sitemap";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_title";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_description";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_focus_keyphrase";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_social_title";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_social_description";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_image_id";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_image_alt";
  ALTER TABLE "projects_locales" DROP COLUMN "seo_canonical_url";
  ALTER TABLE "articles" DROP COLUMN "status";
  ALTER TABLE "articles" DROP COLUMN "seo_no_index";
  ALTER TABLE "articles" DROP COLUMN "seo_no_follow";
  ALTER TABLE "articles" DROP COLUMN "seo_exclude_from_sitemap";
  ALTER TABLE "articles_locales" DROP COLUMN "author_display_name";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_focus_keyphrase";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_social_title";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_social_description";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_image_id";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_image_alt";
  ALTER TABLE "articles_locales" DROP COLUMN "seo_canonical_url";
  ALTER TABLE "site_settings_locales" DROP COLUMN "default_social_image_id";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__events_v_version_eventdate_tz";
  DROP TYPE "public"."enum__events_v_version_enddate_tz";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_sdg_tags";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_version_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_publishdate_tz";`)
}
