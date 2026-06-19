-- JCI Bangkok Database Schema Reference
-- Generated automatically from PostgreSQL database

CREATE TABLE articles (
  id INTEGER NOT NULL DEFAULT nextval('articles_id_seq'::regclass),
  title CHARACTER VARYING NOT NULL,
  slug CHARACTER VARYING NOT NULL,
  author_id INTEGER NOT NULL,
  category USER-DEFINED NOT NULL,
  cover_image_id INTEGER NOT NULL,
  summary CHARACTER VARYING NOT NULL,
  body JSONB NOT NULL,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  seo_title CHARACTER VARYING,
  seo_description CHARACTER VARYING,
  related_event_id INTEGER,
  related_project_id INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE articles_tags (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL,
  id CHARACTER VARYING NOT NULL,
  tag CHARACTER VARYING
);

CREATE TABLE board_members (
  id INTEGER NOT NULL DEFAULT nextval('board_members_id_seq'::regclass),
  name CHARACTER VARYING NOT NULL,
  position CHARACTER VARYING NOT NULL,
  year NUMERIC NOT NULL,
  photo_id INTEGER NOT NULL,
  bio JSONB,
  company_role CHARACTER VARYING,
  linkedin CHARACTER VARYING,
  display_order NUMERIC NOT NULL DEFAULT 10,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE events (
  id INTEGER NOT NULL DEFAULT nextval('events_id_seq'::regclass),
  title CHARACTER VARYING NOT NULL,
  slug CHARACTER VARYING NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  venue CHARACTER VARYING NOT NULL,
  google_maps_link CHARACTER VARYING,
  registration_link CHARACTER VARYING,
  event_type USER-DEFINED NOT NULL,
  host_committee CHARACTER VARYING,
  short_description CHARACTER VARYING NOT NULL,
  full_description JSONB,
  cover_image_id INTEGER NOT NULL,
  status USER-DEFINED DEFAULT 'draft'::enum_events_status,
  featured BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE events_gallery (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL,
  id CHARACTER VARYING NOT NULL,
  image_id INTEGER
);

CREATE TABLE forms (
  id INTEGER NOT NULL DEFAULT nextval('forms_id_seq'::regclass),
  name CHARACTER VARYING NOT NULL,
  email CHARACTER VARYING NOT NULL,
  phone CHARACTER VARYING,
  inquiry_type USER-DEFINED NOT NULL,
  message CHARACTER VARYING NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE media (
  id INTEGER NOT NULL DEFAULT nextval('media_id_seq'::regclass),
  alt CHARACTER VARYING NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  url CHARACTER VARYING,
  thumbnail_u_r_l CHARACTER VARYING,
  filename CHARACTER VARYING,
  mime_type CHARACTER VARYING,
  filesize NUMERIC,
  width NUMERIC,
  height NUMERIC,
  focal_x NUMERIC,
  focal_y NUMERIC,
  sizes_thumbnail_url CHARACTER VARYING,
  sizes_thumbnail_width NUMERIC,
  sizes_thumbnail_height NUMERIC,
  sizes_thumbnail_mime_type CHARACTER VARYING,
  sizes_thumbnail_filesize NUMERIC,
  sizes_thumbnail_filename CHARACTER VARYING,
  sizes_card_url CHARACTER VARYING,
  sizes_card_width NUMERIC,
  sizes_card_height NUMERIC,
  sizes_card_mime_type CHARACTER VARYING,
  sizes_card_filesize NUMERIC,
  sizes_card_filename CHARACTER VARYING,
  sizes_hero_url CHARACTER VARYING,
  sizes_hero_width NUMERIC,
  sizes_hero_height NUMERIC,
  sizes_hero_mime_type CHARACTER VARYING,
  sizes_hero_filesize NUMERIC,
  sizes_hero_filename CHARACTER VARYING
);

CREATE TABLE member_stories (
  id INTEGER NOT NULL DEFAULT nextval('member_stories_id_seq'::regclass),
  member_name CHARACTER VARYING NOT NULL,
  year_joined NUMERIC NOT NULL,
  chapter_role CHARACTER VARYING,
  profession CHARACTER VARYING,
  story_title CHARACTER VARYING NOT NULL,
  quote CHARACTER VARYING NOT NULL,
  full_story JSONB,
  photo_id INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE member_stories_rels (
  id INTEGER NOT NULL DEFAULT nextval('member_stories_rels_id_seq'::regclass),
  order INTEGER,
  parent_id INTEGER NOT NULL,
  path CHARACTER VARYING NOT NULL,
  projects_id INTEGER,
  events_id INTEGER
);

CREATE TABLE pages (
  id INTEGER NOT NULL DEFAULT nextval('pages_id_seq'::regclass),
  title CHARACTER VARYING NOT NULL,
  slug CHARACTER VARYING NOT NULL,
  status USER-DEFINED DEFAULT 'draft'::enum_pages_status,
  content JSONB,
  seo_title CHARACTER VARYING,
  seo_description CHARACTER VARYING,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE partners (
  id INTEGER NOT NULL DEFAULT nextval('partners_id_seq'::regclass),
  organization_name CHARACTER VARYING NOT NULL,
  logo_id INTEGER NOT NULL,
  website CHARACTER VARYING,
  partner_type USER-DEFINED NOT NULL,
  partnership_year NUMERIC NOT NULL,
  description CHARACTER VARYING,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE partners_rels (
  id INTEGER NOT NULL DEFAULT nextval('partners_rels_id_seq'::regclass),
  order INTEGER,
  parent_id INTEGER NOT NULL,
  path CHARACTER VARYING NOT NULL,
  projects_id INTEGER,
  events_id INTEGER
);

CREATE TABLE payload_kv (
  id INTEGER NOT NULL DEFAULT nextval('payload_kv_id_seq'::regclass),
  key CHARACTER VARYING NOT NULL,
  data JSONB NOT NULL
);

CREATE TABLE payload_locked_documents (
  id INTEGER NOT NULL DEFAULT nextval('payload_locked_documents_id_seq'::regclass),
  global_slug CHARACTER VARYING,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE payload_locked_documents_rels (
  id INTEGER NOT NULL DEFAULT nextval('payload_locked_documents_rels_id_seq'::regclass),
  order INTEGER,
  parent_id INTEGER NOT NULL,
  path CHARACTER VARYING NOT NULL,
  users_id INTEGER,
  media_id INTEGER,
  pages_id INTEGER,
  events_id INTEGER,
  projects_id INTEGER,
  articles_id INTEGER,
  board_members_id INTEGER,
  member_stories_id INTEGER,
  partners_id INTEGER,
  forms_id INTEGER
);

CREATE TABLE payload_migrations (
  id INTEGER NOT NULL DEFAULT nextval('payload_migrations_id_seq'::regclass),
  name CHARACTER VARYING,
  batch NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE payload_preferences (
  id INTEGER NOT NULL DEFAULT nextval('payload_preferences_id_seq'::regclass),
  key CHARACTER VARYING,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE payload_preferences_rels (
  id INTEGER NOT NULL DEFAULT nextval('payload_preferences_rels_id_seq'::regclass),
  order INTEGER,
  parent_id INTEGER NOT NULL,
  path CHARACTER VARYING NOT NULL,
  users_id INTEGER
);

CREATE TABLE projects (
  id INTEGER NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
  title CHARACTER VARYING NOT NULL,
  slug CHARACTER VARYING NOT NULL,
  year NUMERIC NOT NULL,
  category USER-DEFINED NOT NULL,
  problem_statement CHARACTER VARYING NOT NULL,
  target_beneficiaries CHARACTER VARYING,
  activities JSONB,
  outcomes JSONB,
  partners CHARACTER VARYING,
  report_file_id INTEGER,
  cta CHARACTER VARYING,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE projects_gallery (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL,
  id CHARACTER VARYING NOT NULL,
  image_id INTEGER
);

CREATE TABLE projects_impact_numbers (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL,
  id CHARACTER VARYING NOT NULL,
  value CHARACTER VARYING NOT NULL,
  label CHARACTER VARYING NOT NULL
);

CREATE TABLE projects_sdg_tags (
  order INTEGER NOT NULL,
  parent_id INTEGER NOT NULL,
  value USER-DEFINED,
  id INTEGER NOT NULL DEFAULT nextval('projects_sdg_tags_id_seq'::regclass)
);

CREATE TABLE site_settings (
  id INTEGER NOT NULL DEFAULT nextval('site_settings_id_seq'::regclass),
  site_name CHARACTER VARYING NOT NULL DEFAULT 'JCI Bangkok'::character varying,
  logo_id INTEGER,
  social_links_facebook CHARACTER VARYING,
  social_links_linkedin CHARACTER VARYING,
  social_links_instagram CHARACTER VARYING,
  contact_email CHARACTER VARYING,
  footer_text CHARACTER VARYING,
  current_year_theme CHARACTER VARYING,
  membership_form_link CHARACTER VARYING,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
  id INTEGER NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email CHARACTER VARYING NOT NULL,
  reset_password_token CHARACTER VARYING,
  reset_password_expiration TIMESTAMP WITH TIME ZONE,
  salt CHARACTER VARYING,
  hash CHARACTER VARYING,
  login_attempts NUMERIC DEFAULT 0,
  lock_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users_roles (
  order INTEGER NOT NULL,
  parent_id INTEGER NOT NULL,
  value USER-DEFINED,
  id INTEGER NOT NULL DEFAULT nextval('users_roles_id_seq'::regclass)
);

CREATE TABLE users_sessions (
  _order INTEGER NOT NULL,
  _parent_id INTEGER NOT NULL,
  id CHARACTER VARYING NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

