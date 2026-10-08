-- Migration: Add mainNav to site_settings
-- Date: 2026-10-08

CREATE TABLE "site_settings_main_nav" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"href" varchar NOT NULL
);

CREATE TABLE "site_settings_main_nav_locales" (
	"label" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" varchar NOT NULL
);

ALTER TABLE "site_settings_main_nav" ADD CONSTRAINT "site_settings_main_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_settings_main_nav_locales" ADD CONSTRAINT "site_settings_main_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_main_nav"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "site_settings_main_nav_order_idx" ON "site_settings_main_nav" USING btree ("_order");
CREATE INDEX "site_settings_main_nav_parent_id_idx" ON "site_settings_main_nav" USING btree ("_parent_id");
CREATE UNIQUE INDEX "site_settings_main_nav_locales_locale_parent_id_unique" ON "site_settings_main_nav_locales" USING btree ("_locale","_parent_id");
