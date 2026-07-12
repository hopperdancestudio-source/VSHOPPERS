-- Run this script in the Supabase SQL editor to add the new site settings columns.
-- These allow complete management of page heroes and CTA banners from the CMS dashboard.

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS about_hero_eyebrow text not null default 'MORE THAN A STUDIO —',
ADD COLUMN IF NOT EXISTS about_hero_title1 text not null default 'MORE THAN A',
ADD COLUMN IF NOT EXISTS about_hero_title2 text not null default 'STUDIO — A CREW',
ADD COLUMN IF NOT EXISTS classes_hero_eyebrow text not null default 'FIND YOUR STYLE',
ADD COLUMN IF NOT EXISTS classes_hero_title1 text not null default 'FIND YOUR',
ADD COLUMN IF NOT EXISTS classes_hero_title2 text not null default 'STYLE',
ADD COLUMN IF NOT EXISTS classes_hero_description text not null default 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.',
ADD COLUMN IF NOT EXISTS schedule_hero_eyebrow text not null default 'PLAN YOUR WEEK',
ADD COLUMN IF NOT EXISTS schedule_hero_title1 text not null default 'CLASS',
ADD COLUMN IF NOT EXISTS schedule_hero_title2 text not null default 'SCHEDULE',
ADD COLUMN IF NOT EXISTS schedule_hero_description text not null default 'From foundations to mastery. Pick your groove and join the community at our studio.',
ADD COLUMN IF NOT EXISTS gallery_hero_eyebrow text not null default 'MOMENTS IN MOTION',
ADD COLUMN IF NOT EXISTS gallery_hero_title text not null default 'THE GALLERY',
ADD COLUMN IF NOT EXISTS gallery_hero_watermark text not null default 'ENERGY',
ADD COLUMN IF NOT EXISTS contact_hero_eyebrow text not null default 'COME DANCE WITH US',
ADD COLUMN IF NOT EXISTS contact_hero_title1 text not null default 'BOOK YOUR',
ADD COLUMN IF NOT EXISTS contact_hero_title2 text not null default 'FREE TRIAL',
ADD COLUMN IF NOT EXISTS cta_heading text not null default 'Ready to Move?',
ADD COLUMN IF NOT EXISTS cta_btn_label text not null default 'Book Your Spot',
ADD COLUMN IF NOT EXISTS cta_watermark text not null default 'MOVE';

-- Update seed row with defaults
UPDATE site_settings
SET 
  about_hero_eyebrow = 'MORE THAN A STUDIO —',
  about_hero_title1 = 'MORE THAN A',
  about_hero_title2 = 'STUDIO — A CREW',
  classes_hero_eyebrow = 'FIND YOUR STYLE',
  classes_hero_title1 = 'FIND YOUR',
  classes_hero_title2 = 'STYLE',
  classes_hero_description = 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.',
  schedule_hero_eyebrow = 'PLAN YOUR WEEK',
  schedule_hero_title1 = 'CLASS',
  schedule_hero_title2 = 'SCHEDULE',
  schedule_hero_description = 'From foundations to mastery. Pick your groove and join the community at our studio.',
  gallery_hero_eyebrow = 'MOMENTS IN MOTION',
  gallery_hero_title = 'THE GALLERY',
  gallery_hero_watermark = 'ENERGY',
  contact_hero_eyebrow = 'COME DANCE WITH US',
  contact_hero_title1 = 'BOOK YOUR',
  contact_hero_title2 = 'FREE TRIAL',
  cta_heading = 'Ready to Move?',
  cta_btn_label = 'Book Your Spot',
  cta_watermark = 'MOVE'
WHERE id = 1;

-- ============================================================================
-- Social Links Refactor
-- ============================================================================
ALTER TABLE site_settings 
DROP COLUMN IF EXISTS instagram_handle,
ADD COLUMN IF NOT EXISTS instagram_url text not null default '',
ADD COLUMN IF NOT EXISTS youtube_url text not null default '',
ADD COLUMN IF NOT EXISTS whatsapp_url text not null default '',
ADD COLUMN IF NOT EXISTS maps_url text not null default '',
ADD COLUMN IF NOT EXISTS facebook_url text not null default '',
ADD COLUMN IF NOT EXISTS website_url text not null default '';

-- Seed new social URL columns
UPDATE site_settings
SET
  instagram_url = 'https://instagram.com/vs_hoppers_dance_studio',
  youtube_url = 'https://youtube.com/@vshoppers',
  whatsapp_url = 'https://wa.me/918108480373',
  maps_url = 'https://maps.google.com/?q=VS+Hoppers+Dance+Studio'
WHERE id = 1;

-- ============================================================================
-- Page Heroes Refactor (CMS Version 1)
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_heroes (
  page_key text PRIMARY KEY, -- 'home', 'about', 'classes', 'schedule', 'gallery', 'contact'
  eyebrow text NOT NULL DEFAULT '',
  title_line1 text NOT NULL DEFAULT '',
  title_line2 text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  primary_button_text text NOT NULL DEFAULT '',
  primary_button_url text NOT NULL DEFAULT '',
  secondary_button_text text NOT NULL DEFAULT '',
  secondary_button_url text NOT NULL DEFAULT '',
  desktop_image_url text NOT NULL DEFAULT '',
  desktop_video_url text NOT NULL DEFAULT '',
  desktop_video_poster text NOT NULL DEFAULT '',
  mobile_image_url text NOT NULL DEFAULT '',
  mobile_video_url text NOT NULL DEFAULT '',
  mobile_video_poster text NOT NULL DEFAULT '',
  hero_height text NOT NULL DEFAULT 'min-h-[70vh]',
  content_width text NOT NULL DEFAULT 'Large' CHECK (content_width IN ('Small', 'Medium', 'Large', 'Full')),
  desktop_alignment text NOT NULL DEFAULT 'Left' CHECK (desktop_alignment IN ('Left', 'Center', 'Right')),
  mobile_alignment text NOT NULL DEFAULT 'Left' CHECK (mobile_alignment IN ('Left', 'Center', 'Right')),
  vertical_alignment text NOT NULL DEFAULT 'Center' CHECK (vertical_alignment IN ('Top', 'Center', 'Bottom')),
  overlay_color text NOT NULL DEFAULT '#000000',
  overlay_opacity float NOT NULL DEFAULT 0.4,
  gradient_type text NOT NULL DEFAULT 'Linear' CHECK (gradient_type IN ('None', 'Solid', 'Linear', 'Radial')),
  background_position text NOT NULL DEFAULT 'center',
  reveal_animation text NOT NULL DEFAULT 'Reveal' CHECK (reveal_animation IN ('None', 'Fade', 'Slide Up', 'Slide Left', 'Zoom', 'Reveal')),
  show_scroll_indicator boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and setup policies
ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read page_heroes" ON page_heroes;
CREATE POLICY "public read page_heroes" ON page_heroes FOR SELECT USING (true);
DROP POLICY IF EXISTS "authenticated write page_heroes" ON page_heroes;
CREATE POLICY "authenticated write page_heroes" ON page_heroes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed initial records from site_settings / hero_content
INSERT INTO page_heroes (page_key, eyebrow, title_line1, title_line2, description, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url, desktop_image_url, desktop_video_url, desktop_video_poster, mobile_image_url, mobile_video_url, mobile_video_poster, hero_height, content_width, desktop_alignment, mobile_alignment, vertical_alignment, overlay_color, overlay_opacity, gradient_type, background_position, reveal_animation, show_scroll_indicator)
VALUES
  ('home', 'YOUR CITY, YOUR REGION · EST. 2016', 'MOVEMENT IS BETTER', 'WHEN SHARED', '', 'Book a Free Trial', '/contact', 'Watch Us Move', '#gallery', '', '', '', '', '', '', 'min-h-[100vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', true),
  ('about', 'MORE THAN A STUDIO —', 'MORE THAN A', 'STUDIO — A CREW', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('classes', 'FIND YOUR STYLE', 'FIND YOUR', 'STYLE', 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', true),
  ('schedule', 'PLAN YOUR WEEK', 'CLASS', 'SCHEDULE', 'From foundations to mastery. Pick your groove and join the community at our studio.', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('gallery', 'MOMENTS IN MOTION', 'THE GALLERY', 'ENERGY', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('contact', 'COME DANCE WITH US', 'BOOK YOUR', 'FREE TRIAL', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false)
ON CONFLICT (page_key) DO NOTHING;

-- ============================================================================
-- Dynamic Gallery Categories Migration
-- ============================================================================

-- Create gallery_categories table
create table if not exists gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS and setup policies
alter table gallery_categories enable row level security;
drop policy if exists "public read gallery_categories" on gallery_categories;
create policy "public read gallery_categories" on gallery_categories for select using (true);
drop policy if exists "authenticated write gallery_categories" on gallery_categories;
create policy "authenticated write gallery_categories" on gallery_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed categories
insert into gallery_categories (id, name, slug, sort_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Hip-Hop', 'hip-hop', 1),
  ('22222222-2222-2222-2222-222222222222', 'Bollywood', 'bollywood', 2),
  ('33333333-3333-3333-3333-333333333333', 'Contemporary', 'contemporary', 3),
  ('44444444-4444-4444-4444-444444444444', 'Freestyle', 'freestyle', 4),
  ('55555555-5555-5555-5555-555555555555', 'Bhangra', 'bhangra', 5),
  ('66666666-6666-6666-6666-666666666666', 'Kids', 'kids', 6),
  ('77777777-7777-7777-7777-777777777777', 'Workshops', 'workshops', 7),
  ('88888888-8888-8888-8888-888888888888', 'Events', 'events', 8),
  ('99999999-9999-9999-9999-999999999999', 'Performances', 'performances', 9),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Behind The Scenes', 'behind-the-scenes', 10),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TEAM', 'team', 11)
on conflict (slug) do nothing;

-- Add category_id to gallery_items
alter table gallery_items add column if not exists category_id uuid references gallery_categories(id) on delete restrict;

-- Migrate existing records in gallery_items based on category text matching
update gallery_items
set category_id = (
  select id from gallery_categories
  where lower(gallery_categories.name) = lower(gallery_items.category)
     or lower(gallery_categories.slug) = lower(gallery_items.category)
     or (gallery_items.category = 'ALL' and gallery_categories.slug = 'hip-hop')
     limit 1
)
where category_id is null;

-- Make sure team photos are mapped correctly
update gallery_items
set category_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
where category = 'TEAM' and category_id is null;

-- Set a default category_id for anything remaining
update gallery_items
set category_id = '11111111-1111-1111-1111-111111111111'
where category_id is null;

-- Now drop the old category column
alter table gallery_items drop column if exists category;

-- Update status check constraint for trial_leads to allow CRM status options
alter table trial_leads drop constraint if exists trial_leads_status_check;
alter table trial_leads add constraint trial_leads_status_check check (status in ('new', 'contacted', 'trial_booked', 'joined', 'rejected', 'archived', 'converted'));

-- ============================================================================
-- Gallery Hover Image Feature Migration & Database Performance Optimizations
-- ============================================================================

-- Add hover_image_url if not exists
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS hover_image_url text DEFAULT NULL;

-- Migrate data if older hover_media_url column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery_items' AND column_name = 'hover_media_url'
    ) THEN
        UPDATE gallery_items 
        SET hover_image_url = hover_media_url 
        WHERE hover_image_url IS NULL;
    END IF;
END $$;

-- Add indexes if they do not exist
CREATE INDEX IF NOT EXISTS idx_gallery_items_sort_order ON gallery_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category_id);

-- ============================================================================
-- Secondary Image Support for Classes & About Sections Migrations
-- ============================================================================
ALTER TABLE class_styles ADD COLUMN IF NOT EXISTS secondary_image_url text DEFAULT NULL;
ALTER TABLE founder_profile ADD COLUMN IF NOT EXISTS secondary_image_url text DEFAULT NULL;


