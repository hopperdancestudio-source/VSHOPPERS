# Assumptions

Everything below was decided without access to the live site's HTML/CSS —
only the 141-second screen recording. Listed so you can correct any of them
quickly once you can compare against the real thing.

## Content & branding
- The reference (VS Hoppers, a dance studio in Kharghar, Navi Mumbai) is
  treated purely as a UX/motion/layout reference per your instruction. No
  business identity from it appears anywhere in code, copy, or seed data.
- Placeholder copy is sized (word count, line length) to match what was on
  screen, so swapping in real content shouldn't reflow layouts — but this is
  an approximation, not a guarantee, especially for the display-font headlines
  where character width varies a lot.

## Visual measurements
- No devtools access to the reference means no exact pixel values for section
  heights, container widths, gutters, font sizes, or border-radius. All of
  `tailwind.config.ts` is a consistent, proportional *system* built from
  careful visual inspection of paused frames, not measured CSS values.
- Fonts are a best-guess Google Fonts match (Anton / Barlow Condensed / Inter)
  based on letterform characteristics — reasoning in `TYPOGRAPHY.md`. Not
  confirmed against the actual `font-family` CSS.
- Colors (background near-black, accent red/orange, gold secondary accent)
  were sampled visually from frames, not color-picked from real CSS values —
  close, but not guaranteed to be the exact hex codes.

## Page structure
- Section membership (which section belongs on which page) was determined by
  watching which nav item was highlighted active at each timestamp — e.g. the
  "age batches" cards were reassigned from Home to Classes mid-project after
  re-checking this. There's a small chance other sections are similarly
  misattributed if the recording's navigation order was non-linear or looped
  back through pages I mis-tracked.
- The Home page's exact section list (Hero → marquee → gallery teaser → About
  teaser → CTA → footer) is inferred from a ~40-second window of the
  recording; if the real Home page has additional sections not shown in that
  window (e.g. a testimonials carousel), they aren't represented. A
  `testimonials` table and admin UI are scaffolded (per your Phase 10 spec)
  but not placed on any public page, since no testimonial section appeared on
  screen.
- Mobile/tablet layouts were never shown in the recording (desktop-only
  capture, ~1920px). All responsive behavior in this build is inferred from
  general responsive-design conventions for this layout style, not observed.

## Motion
- Exact animation durations/easing/stagger timings aren't extractable from a
  compressed 30fps-ish screen recording. Values in `lib/motion.ts` are
  reasonable, consistent defaults (0.6–0.9s reveals, ~0.1s stagger,
  easeOutExpo-style curve) chosen to match the *character* of what's on
  screen, not measured frame-by-frame timing.
- Hover/interaction states (button hover, card lift, nav underline) are
  designed to fit the reference's visual language but weren't directly
  observable in a passive recording (hover requires a live cursor mid-action,
  which the recording only shows briefly a few times).

## Technical/architecture choices (not from the video at all)
- **Auth model**: any authenticated Supabase user has full admin access —
  there's no role/permission table. Fine for a single-operator studio; if you
  need multiple staff with different permissions, add a `profiles` table with
  a `role` column and check it in `middleware.ts` / `app/admin/(dashboard)/layout.tsx`.
- **Cloudinary uploads** use an unsigned upload preset (client-side direct
  upload) rather than signed server-side uploads, for simplicity. Unsigned
  presets should be scoped tightly (folder + size/type limits) on the
  Cloudinary side since the preset name is public.
- **Sort ordering** for a few list entities isn't admin-editable yet (see
  README "Known limitations") — assumed acceptable since drag-reorder UI is a
  meaningfully separate chunk of work from the CRUD forms themselves.
- Real-time collaboration (two admins editing simultaneously) isn't handled —
  last write wins, no conflict detection.
