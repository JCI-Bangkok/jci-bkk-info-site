-- Migration Reference: Version status synchronization for CMS pages and templates
-- Date: 2026-10-08
-- Purpose: Standardize 'draft' and 'published' as the state of document versions (_status and version__status)

-- Ensure pages._status matches pages.status for existing documents
UPDATE "pages"
SET "_status" = "status"::text::"enum_pages_status"
WHERE ("_status" IS NULL AND "status" IS NOT NULL) OR ("_status"::text != "status"::text);

-- Ensure templates._status matches templates.status for existing documents
UPDATE "templates"
SET "_status" = "status"::text::"enum_templates_status"
WHERE ("_status" IS NULL AND "status" IS NOT NULL) OR ("_status"::text != "status"::text);

-- Backfill _pages_v.version__status from _pages_v.version_status
UPDATE "_pages_v"
SET "version__status" = "version_status"::text::"enum__pages_v_version_status"
WHERE ("version__status" IS NULL AND "version_status" IS NOT NULL) OR ("version__status"::text != "version_status"::text);

-- Backfill _templates_v.version__status from _templates_v.version_status
UPDATE "_templates_v"
SET "version__status" = "version_status"::text::"enum__templates_v_version_status"
WHERE ("version__status" IS NULL AND "version_status" IS NOT NULL) OR ("version__status"::text != "version_status"::text);
