# Studio Site — frontend rebuild

A UX/motion-accurate rebuild of the reference recording's interface: Next.js 15
(App Router) + TypeScript + Tailwind + Framer Motion, fully CMS-driven via
Supabase + Cloudinary, with a complete admin panel. Zero hardcoded business
content — everything shown publicly comes from the database (or a placeholder
fallback in local dev with no env vars set).

## Status: all 11 phases complete

- [x] 1. Project setup
- [x] 2. Design system (tokens)
- [x] 3. Shared layout (Navbar/Footer)
- [x] 4. Home
- [x] 5. Classes
- [x] 6. Schedule
- [x] 7. About
- [x] 8. Gallery
- [x] 9. Contact
- [x] 10. Admin CMS
- [x] 11. Final polish (SEO metadata, sitemap/robots, loading/error/404 states)

See `QA-NOTES.md`, `ASSUMPTIONS.md`, and `COMPARISON-REPORT.md` for the honest
detail behind that checklist — what's confidently matched to the reference vs.
estimated, and why.

## Important — build not verified

This was authored in a sandboxed environment **without network access**, so
`npm install` / `next build` could not be run here. Everything is hand-authored
and internally reviewed for consistency (import paths, type shapes, Supabase
column-name mapping), but you should treat the first local build as the real
first test and expect to fix small issues. Start with:

```bash
npm install
npm run build   # catches type errors / broken imports fast
npm run dev
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Supabase
1. Create a project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor — creates every table, RLS
   policies, and seeds the singleton rows (`site_settings`, `hero_content`,
   `founder_profile`) with the same placeholder values as local dev, so
   switching to live Supabase doesn't change what's rendered until you edit it.
3. Create an admin user: Authentication → Users → Add User (email/password).
   That's the only role in this build — every authenticated user has full
   admin access (see `ASSUMPTIONS.md` for why, and how to extend it).
4. Copy your Project URL and anon key into `.env.local` (see `.env.example`).

### 3. Cloudinary
1. Dashboard → Settings → Upload → add an **unsigned** upload preset, folder
   `admin-uploads`, with file size/type restrictions set.
2. Copy your cloud name and the preset name into `.env.local`.

### 4. Environment
```bash
cp .env.example .env.local
# fill in the values from steps 2-3
```

### 5. Run
```bash
npm run dev
```
Visit `http://localhost:3000` for the public site, `/admin/login` for the CMS.

**Without any env vars set**, the public site still renders fully from
`data/placeholder.ts` (great for reviewing the UI/UX in isolation), but the
admin panel's auth gate and mutations require Supabase to be configured.

## Folder structure

```
app/
  (public pages)         page.tsx, classes/, schedule/, about/, gallery/, contact/
  admin/
    login/                unauthenticated
    (dashboard)/          auth-gated route group — layout.tsx checks session
  actions/                public-facing Server Actions (trial form submit)
  sitemap.ts, robots.ts, loading.tsx, error.tsx, not-found.tsx
components/
  layout/                 Navbar, Footer
  shared/                 PageHero, BatchesSection, LevelBadge — reused across pages
  ui/                     Reveal, CTABanner — generic motion primitives
  home/ classes/ schedule/ about/ gallery/ contact/   page-specific sections
  admin/                  AdminShell, SimpleListEditor, SingletonForm, per-entity
                          custom editors, CloudinaryUploadField
lib/
  types.ts                canonical shapes for every content entity
  cms.ts                  data-access layer: Supabase-first, placeholder-fallback
  motion.ts                shared Framer Motion tokens/variants
  supabase/               browser/server/admin clients + action factories
  validation/              zod schemas
data/placeholder.ts        seed/fallback content, sized to match reference density
supabase/schema.sql         full schema + RLS + seed
```

## How content flows

1. **Public pages** (Server Components) call `lib/cms.ts` getters.
2. Each getter tries Supabase; if `NEXT_PUBLIC_SUPABASE_URL` isn't set, or the
   query throws, it falls back to `data/placeholder.ts` — same shape either way.
3. **Admin pages** call the same getters for initial data, then hand Server
   Actions (from `lib/supabase/crudFactory.ts` / `singletonFactory.ts`) to
   client-side editor components as props.
4. Editors POST camelCase objects (matching `lib/types.ts`); the action
   factories convert keys to snake_case before hitting Supabase
   (`lib/supabase/caseUtils.ts`), so table/column names never leak into
   component code.
5. On save, `revalidatePath` invalidates the relevant public route(s) so
   changes appear immediately.

No component ever needs to change when content changes — only `data/placeholder.ts`
(for local dev) or the actual database rows (for production) do.

## Design tokens & typography

See `tailwind.config.ts` and `TYPOGRAPHY.md`. Both are explicit about what's
measured-with-confidence vs. estimated from the compressed reference video.

## Known limitations / where to look first if something's off

- Sort order for a few simple list entities (marquee tags, trust badges, faqs,
  journey milestones) isn't exposed in their admin forms — new items default
  to `sort_order = 0`. Reorder directly in Supabase's table editor for now, or
  ask to have a drag-handle added to `SimpleListEditor`.
- `<img>` tags are used instead of `next/image` throughout, since placeholder
  media URLs are empty strings. Once real Cloudinary URLs are seeded, swapping
  to `next/image` (already configured for `res.cloudinary.com` in
  `next.config.ts`) is a worthwhile follow-up for lazy-loading/responsive
  images.
- The admin panel has one role (any authenticated user = full access). See
  `ASSUMPTIONS.md` for how to add real role-based permissions if needed.
