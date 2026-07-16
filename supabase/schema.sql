-- ============================================================================
-- Studio Site — Supabase schema
-- ============================================================================
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- All public content tables: readable by anyone (anon), writable only by
-- authenticated users (the admin panel). Leads are write-only for anon
-- (public form submissions) and readable only by authenticated staff.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- site_settings (singleton row)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  studio_name text not null default 'Studio Name',
  tagline text not null default '',
  city text not null default '',
  region text not null default '',
  established_year int not null default 2016,
  phone text not null default '',
  email text not null default '',
  instagram_url text not null default '',
  youtube_url text not null default '',
  whatsapp_url text not null default '',
  maps_url text not null default '',
  facebook_url text not null default '',
  website_url text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  copyright_name text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image_url text not null default '',
  about_hero_eyebrow text not null default 'MORE THAN A STUDIO —',
  about_hero_title1 text not null default 'MORE THAN A',
  about_hero_title2 text not null default 'STUDIO — A CREW',
  classes_hero_eyebrow text not null default 'FIND YOUR STYLE',
  classes_hero_title1 text not null default 'FIND YOUR',
  classes_hero_title2 text not null default 'STYLE',
  classes_hero_description text not null default 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.',
  schedule_hero_eyebrow text not null default 'PLAN YOUR WEEK',
  schedule_hero_title1 text not null default 'CLASS',
  schedule_hero_title2 text not null default 'SCHEDULE',
  schedule_hero_description text not null default 'From foundations to mastery. Pick your groove and join the community at our studio.',
  gallery_hero_eyebrow text not null default 'MOMENTS IN MOTION',
  gallery_hero_title text not null default 'THE GALLERY',
  gallery_hero_watermark text not null default 'ENERGY',
  contact_hero_eyebrow text not null default 'COME DANCE WITH US',
  contact_hero_title1 text not null default 'BOOK YOUR',
  contact_hero_title2 text not null default 'FREE TRIAL',
  cta_heading text not null default 'Ready to Move?',
  cta_btn_label text not null default 'Book Your Spot',
  cta_watermark text not null default 'MOVE',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

-- ---------------------------------------------------------------------------
-- hero_content (singleton row)
-- ---------------------------------------------------------------------------
create table if not exists hero_content (
  id int primary key default 1,
  eyebrow text not null default '',
  headline_line1 text not null default '',
  headline_line2_accent text not null default '',
  primary_cta_label text not null default 'Book a Free Trial',
  primary_cta_href text not null default '/contact',
  secondary_cta_label text not null default 'Watch Us Move',
  secondary_cta_href text not null default '#',
  background_media_url text not null default '',
  background_media_type text not null default 'image' check (background_media_type in ('image','video')),
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

create table if not exists hero_stats (
  id uuid primary key default uuid_generate_v4(),
  value text not null,
  label text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- marquee_tags
-- ---------------------------------------------------------------------------
create table if not exists marquee_tags (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- age_batches
-- ---------------------------------------------------------------------------
create table if not exists age_batches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  age_range text not null,
  description text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- class_styles
-- ---------------------------------------------------------------------------
create table if not exists class_styles (
  id uuid primary key default uuid_generate_v4(),
  sort_order int not null default 0,
  name text not null,
  description text not null,
  levels text[] not null default '{}',
  media_url text not null default '',
  media_type text not null default 'image' check (media_type in ('image','video')),
  secondary_image_url text default null
);

-- ---------------------------------------------------------------------------
-- schedule_slots
-- ---------------------------------------------------------------------------
create table if not exists schedule_slots (
  id uuid primary key default uuid_generate_v4(),
  day text not null check (day in ('MON','TUE','WED','THU','FRI','SAT','SUN')),
  time text not null,
  class_name text not null,
  category text not null check (category in ('core','specialty','kids')),
  tag text
);

-- ---------------------------------------------------------------------------
-- membership_plans
-- ---------------------------------------------------------------------------
create table if not exists membership_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price text not null,
  period text not null,
  features jsonb not null default '[]', -- [{ label: string, included: boolean }]
  highlighted boolean not null default false,
  cta_label text not null default 'Join Now',
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- trust_badges
-- ---------------------------------------------------------------------------
create table if not exists trust_badges (
  id uuid primary key default uuid_generate_v4(),
  icon text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- core_values
-- ---------------------------------------------------------------------------
create table if not exists core_values (
  id uuid primary key default uuid_generate_v4(),
  index_label text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- journey_milestones
-- ---------------------------------------------------------------------------
create table if not exists journey_milestones (
  id uuid primary key default uuid_generate_v4(),
  year text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- about_stats + founder profile (reuses hero_stats-like shape, separate table)
-- ---------------------------------------------------------------------------
create table if not exists about_stats (
  id uuid primary key default uuid_generate_v4(),
  value text not null,
  label text not null,
  sort_order int not null default 0
);

create table if not exists founder_profile (
  id int primary key default 1,
  name text not null default '',
  bio text not null default '',
  photo_url text not null default '',
  secondary_image_url text default null,
  constraint singleton check (id = 1)
);

-- ---------------------------------------------------------------------------
-- page_heroes
-- ---------------------------------------------------------------------------
create table if not exists page_heroes (
  page_key text primary key, -- 'home', 'about', 'classes', 'schedule', 'gallery', 'contact'
  eyebrow text not null default '',
  title_line1 text not null default '',
  title_line2 text not null default '',
  description text not null default '',
  primary_button_text text not null default '',
  primary_button_url text not null default '',
  secondary_button_text text not null default '',
  secondary_button_url text not null default '',
  desktop_image_url text not null default '',
  desktop_video_url text not null default '',
  desktop_video_poster text not null default '',
  mobile_image_url text not null default '',
  mobile_video_url text not null default '',
  mobile_video_poster text not null default '',
  hero_height text not null default 'min-h-[70vh]',
  content_width text not null default 'Large' check (content_width in ('Small', 'Medium', 'Large', 'Full')),
  desktop_alignment text not null default 'Left' check (desktop_alignment in ('Left', 'Center', 'Right')),
  mobile_alignment text not null default 'Left' check (mobile_alignment in ('Left', 'Center', 'Right')),
  vertical_alignment text not null default 'Center' check (vertical_alignment in ('Top', 'Center', 'Bottom')),
  overlay_color text not null default '#000000',
  overlay_opacity float not null default 0.4,
  gradient_type text not null default 'Linear' check (gradient_type in ('None', 'Solid', 'Linear', 'Radial')),
  background_position text not null default 'center',
  reveal_animation text not null default 'Reveal' check (reveal_animation in ('None', 'Fade', 'Slide Up', 'Slide Left', 'Zoom', 'Reveal')),
  show_scroll_indicator boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- gallery_categories
-- ---------------------------------------------------------------------------
create table if not exists gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- team_photos + gallery_items (distinguished by category relation)
-- ---------------------------------------------------------------------------
create table if not exists gallery_items (
  id uuid primary key default uuid_generate_v4(),
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  title text,
  category_id uuid references gallery_categories(id) on delete restrict,
  sort_order int not null default 0,
  hover_image_url text default null
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_role text not null,
  quote text not null,
  avatar_url text not null default '',
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- studio_hours
-- ---------------------------------------------------------------------------
create table if not exists studio_hours (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  hours text not null,
  closed boolean not null default false,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- trial_leads (contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists trial_leads (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  class_interest text,
  age_group text,
  preferred_days text[] not null default '{}',
  message text,
  status text not null default 'new' check (status in ('new','contacted','trial_booked','joined','rejected','archived','converted')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table site_settings enable row level security;
alter table hero_content enable row level security;
alter table hero_stats enable row level security;
alter table marquee_tags enable row level security;
alter table age_batches enable row level security;
alter table class_styles enable row level security;
alter table schedule_slots enable row level security;
alter table membership_plans enable row level security;
alter table trust_badges enable row level security;
alter table core_values enable row level security;
alter table journey_milestones enable row level security;
alter table about_stats enable row level security;
alter table founder_profile enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_items enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table studio_hours enable row level security;
alter table trial_leads enable row level security;

-- Public read access for all site-content tables
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'site_settings','hero_content','hero_stats','marquee_tags','age_batches',
      'class_styles','schedule_slots','membership_plans','trust_badges',
      'core_values','journey_milestones','about_stats','founder_profile',
      'gallery_categories','gallery_items','testimonials','faqs','studio_hours','page_heroes'
    ])
  loop
    execute format('create policy "public read %1$s" on %1$s for select using (true);', t);
    execute format('create policy "authenticated write %1$s" on %1$s for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- trial_leads: anyone can insert (the public form), only authenticated staff can read/update/delete
create policy "public insert trial_leads" on trial_leads for insert with check (true);
create policy "authenticated read trial_leads" on trial_leads for select using (auth.role() = 'authenticated');
create policy "authenticated update trial_leads" on trial_leads for update using (auth.role() = 'authenticated');
create policy "authenticated delete trial_leads" on trial_leads for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- Seed data (mirrors data/placeholder.ts so a fresh DB renders identically
-- to the placeholder-backed dev build)
-- ============================================================================
insert into site_settings (id, studio_name, tagline, city, region, established_year, phone, email, instagram_url, youtube_url, whatsapp_url, maps_url, facebook_url, website_url, address_line1, address_line2, copyright_name,
  about_hero_eyebrow, about_hero_title1, about_hero_title2,
  classes_hero_eyebrow, classes_hero_title1, classes_hero_title2, classes_hero_description,
  schedule_hero_eyebrow, schedule_hero_title1, schedule_hero_title2, schedule_hero_description,
  gallery_hero_eyebrow, gallery_hero_title, gallery_hero_watermark,
  contact_hero_eyebrow, contact_hero_title1, contact_hero_title2,
  cta_heading, cta_btn_label, cta_watermark)
values (1, 'Studio Name', 'Movement, taught with intention.', 'Your City', 'Your Region', 2016, '+1 555-0100', 'hello@studiosite.example', 'https://instagram.com/vs_hoppers_dance_studio', 'https://youtube.com/@vshoppers', 'https://wa.me/918108480373', 'https://maps.google.com/?q=VS+Hoppers+Dance+Studio', '', '', '123 Placeholder Ave, Unit 2', 'Your City, Your Region 00000', 'Studio Name',
  'MORE THAN A STUDIO —', 'MORE THAN A', 'STUDIO — A CREW',
  'FIND YOUR STYLE', 'FIND YOUR', 'STYLE', 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.',
  'PLAN YOUR WEEK', 'CLASS', 'SCHEDULE', 'From foundations to mastery. Pick your groove and join the community at our studio.',
  'MOMENTS IN MOTION', 'THE GALLERY', 'ENERGY',
  'COME DANCE WITH US', 'BOOK YOUR', 'FREE TRIAL',
  'Ready to Move?', 'Book Your Spot', 'MOVE')
on conflict (id) do nothing;

insert into hero_content (id, eyebrow, headline_line1, headline_line2_accent)
values (1, 'YOUR CITY, YOUR REGION · EST. 2016', 'MOVEMENT IS BETTER', 'WHEN SHARED')
on conflict (id) do nothing;

insert into founder_profile (id, name, bio)
values (1, 'Founder Name', 'Placeholder founder bio. Replace via CMS with the real founding story.')
on conflict (id) do nothing;

insert into page_heroes (page_key, eyebrow, title_line1, title_line2, description, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url, desktop_image_url, desktop_video_url, desktop_video_poster, mobile_image_url, mobile_video_url, mobile_video_poster, hero_height, content_width, desktop_alignment, mobile_alignment, vertical_alignment, overlay_color, overlay_opacity, gradient_type, background_position, reveal_animation, show_scroll_indicator)
values
  ('home', 'YOUR CITY, YOUR REGION · EST. 2016', 'MOVEMENT IS BETTER', 'WHEN SHARED', '', 'Book a Free Trial', '/contact', 'Watch Us Move', '#gallery', '', '', '', '', '', '', 'min-h-[100vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', true),
  ('about', 'MORE THAN A STUDIO —', 'MORE THAN A', 'STUDIO — A CREW', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('classes', 'FIND YOUR STYLE', 'FIND YOUR', 'STYLE', 'From raw street style to fluid contemporary, our classes are designed to meet you wherever your movement journey begins.', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', true),
  ('schedule', 'PLAN YOUR WEEK', 'CLASS', 'SCHEDULE', 'From foundations to mastery. Pick your groove and join the community at our studio.', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('gallery', 'MOMENTS IN MOTION', 'THE GALLERY', 'ENERGY', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false),
  ('contact', 'COME DANCE WITH US', 'BOOK YOUR', 'FREE TRIAL', '', '', '', '', '', '', '', '', '', '', '', 'min-h-[70vh]', 'Large', 'Left', 'Left', 'Center', '#000000', 0.4, 'Linear', 'center', 'Reveal', false)
on conflict (page_key) do nothing;

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

-- Gallery Items performance indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_sort_order ON gallery_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category_id);


-- ============================================================================
-- Student Registration Module Schema
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. registrations table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_no TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  dob DATE NOT NULL,
  age INTEGER NOT NULL,
  joining_date DATE NOT NULL,
  dance_style TEXT NOT NULL,
  batch_time TEXT NOT NULL,
  package TEXT NOT NULL,
  payment_mode TEXT NOT NULL,
  batch_days TEXT NOT NULL,
  emergency_contact TEXT,
  medical_condition TEXT,
  notes TEXT,
  internal_notes TEXT,
  agreement BOOLEAN NOT NULL CHECK (agreement = true),
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Paid')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Confirmed', 'Active', 'Completed', 'Cancelled')),
  viewed BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. registration_status_history (Audit Trail)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registration_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  changed_by TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  old_payment_status TEXT,
  new_payment_status TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. Dynamic year-based registration sequence trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_registration_no()
RETURNS TRIGGER AS $$
DECLARE
  seq_name TEXT;
  seq_exists BOOLEAN;
  seq_val INTEGER;
  year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  seq_name := 'registration_seq_' || year_str;
  
  -- Check if sequence for the current year exists
  SELECT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE c.relname = seq_name AND c.relkind = 'S'
  ) INTO seq_exists;
  
  IF NOT seq_exists THEN
    EXECUTE 'CREATE SEQUENCE ' || quote_ident(seq_name) || ' START WITH 1';
  END IF;
  
  EXECUTE 'SELECT nextval(' || quote_literal(seq_name) || ')' INTO seq_val;
  NEW.registration_no := 'VSH-' || year_str || '-' || lpad(seq_val::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER set_registration_no
BEFORE INSERT ON registrations
FOR EACH ROW
WHEN (NEW.registration_no IS NULL OR NEW.registration_no = '')
EXECUTE FUNCTION generate_registration_no();

-- ---------------------------------------------------------------------------
-- 4. Audit trail trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_registration_changes()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
BEGIN
  -- Attempt to get the authenticated user's email from Supabase auth metadata
  BEGIN
    admin_email := coalesce(
      current_setting('request.jwt.claims', true)::json->>'email',
      'system'
    );
  EXCEPTION WHEN OTHERS THEN
    admin_email := 'system';
  END;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO registration_status_history (
      registration_id,
      changed_by,
      new_status,
      new_payment_status,
      internal_notes
    ) VALUES (
      NEW.id,
      admin_email,
      NEW.status,
      NEW.payment_status,
      'Registration submitted'
    );
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.status IS DISTINCT FROM NEW.status OR OLD.payment_status IS DISTINCT FROM NEW.payment_status OR OLD.internal_notes IS DISTINCT FROM NEW.internal_notes) THEN
      INSERT INTO registration_status_history (
        registration_id,
        changed_by,
        old_status,
        new_status,
        old_payment_status,
        new_payment_status,
        internal_notes
      ) VALUES (
        NEW.id,
        admin_email,
        OLD.status,
        NEW.status,
        OLD.payment_status,
        NEW.payment_status,
        CASE 
          WHEN OLD.internal_notes IS DISTINCT FROM NEW.internal_notes THEN 'Notes updated: ' || coalesce(NEW.internal_notes, '')
          ELSE 'Status updated'
        END
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER audit_registrations_trigger
AFTER INSERT OR UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION audit_registration_changes();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS) Policies
-- ---------------------------------------------------------------------------
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_status_history ENABLE ROW LEVEL SECURITY;

-- registrations policies
DROP POLICY IF EXISTS "public insert registrations" ON registrations;
CREATE POLICY "public insert registrations" ON registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated read registrations" ON registrations;
CREATE POLICY "authenticated read registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated update registrations" ON registrations;
CREATE POLICY "authenticated update registrations" ON registrations FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated delete registrations" ON registrations;
CREATE POLICY "authenticated delete registrations" ON registrations FOR DELETE USING (auth.role() = 'authenticated');

-- status history policies
DROP POLICY IF EXISTS "authenticated read status_history" ON registration_status_history;
CREATE POLICY "authenticated read status_history" ON registration_status_history FOR SELECT USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 6. Add Dynamic Options to site_settings Table
-- ---------------------------------------------------------------------------
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS payment_modes TEXT NOT NULL DEFAULT 'Cash, UPI, Card, Bank Transfer';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS batch_days TEXT NOT NULL DEFAULT '3 Days, 5 Days, Weekend';

-- Update seed row with defaults
UPDATE site_settings
SET 
  payment_modes = 'Cash, UPI, Card, Bank Transfer',
  batch_days = '3 Days, 5 Days, Weekend'
WHERE id = 1 AND (payment_modes IS NULL OR payment_modes = '');


