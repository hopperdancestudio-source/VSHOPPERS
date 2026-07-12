# QA notes — Home page vs. reference recording

Per the delivery process: comparing what's built against the reference before moving on.

## Confident matches
- Section order: Hero → style marquee → 4-up gallery teaser → About teaser → red CTA
  banner (oversized watermark word) → footer.
- Hero: eyebrow → two-line headline (2nd line accented) → dual CTA (solid + outline) →
  stat row, all staggered in on load.
- Gallery teaser: 4 equal-width images, tight gutters, grayscale with color-on-hover.
- CTA banner: full-bleed accent-red section with a giant, low-opacity background word
  bleeding past the container edges, centered heading + button(s) on top.
- Sharp corners throughout (no border-radius) — carried through every component.
- Navbar: transparent over hero, solidifies on scroll; active route highlighted in
  accent color.

## Estimated / not verifiable from video (flagging honestly rather than guessing silently)
- **Exact hero height**: reference appears to be close to full viewport height minus
  navbar; I used `min-h-[calc(100vh-1px)]` with content pinned to the bottom via
  `items-end`, matching the recording's composition (headline sits in the lower half of
  the frame). Worth confirming against the real site's scroll behavior.
- **Marquee speed**: set to 22s per loop by feel; the reference's actual scroll speed
  should be timed against the live site and adjusted.
- **Exact type sizes**: using a fluid `clamp()` scale rather than fixed px pulled from
  video pixels (video compression + unknown zoom level make sub-pixel extraction
  unreliable). Scale is proportionally consistent but should be checked against
  devtools-measured values from the live site if available.
- **Fonts**: best-guess Google Fonts match (Anton / Barlow Condensed / Inter) — see
  `TYPOGRAPHY.md`. Not confirmed against actual font-family CSS.
- **Hero background media**: recording shows a dimmed dance photo/video; component
  supports both image and video via `backgroundMediaType`, currently rendering an empty
  gradient placeholder since no Cloudinary asset exists yet.

## Deliberate deviations (production-quality floor, not visible in reference)
- Added visible `:focus-visible` outlines (accessibility) — reference showed no visible
  focus states in the recording, but this is a baseline requirement regardless.
- Respects `prefers-reduced-motion` by collapsing all transition/animation durations.

## Next
Moving to Phase 5 (Classes page) — will reuse `BatchesSection`, `CTABanner`, `Reveal`
utilities built here, plus a new alternating-row `ClassDetailRow` component.

---

# QA notes — Phases 5–11

## Phase 5 — Classes
- Alternating L/R image/text rows via CSS order flip on even items, numbered
  translucent labels (01–05), level badges, matches the reference's row
  rhythm and the "Book This Class" arrow-link pattern.
- Reused `BatchesSection` here (corrected placement from Phase 4 QA) and
  `CTABanner`.

## Phase 6 — Schedule
- Weekly grid built as a CSS grid keyed by day-of-week with category color
  coding (core=red, specialty=gold, kids=white/30) matching the legend chips
  in the reference. Horizontal scroll on narrow viewports rather than
  reflowing to a list, matching the reference's apparent approach (a 7-column
  grid doesn't reasonably reflow to single-column without losing the
  at-a-glance weekly view).
- Pricing cards: middle "Monthly" card raised + ribboned, matching reference.

## Phase 7 — About
- Stats bar uses a count-up animation on scroll-into-view — reasonable
  addition consistent with the reference's number-forward stat presentation,
  though the reference recording doesn't clearly show whether count-up was
  present or the numbers were static (flagging per `ASSUMPTIONS.md`).
- Journey timeline: horizontal on desktop, wraps to 2-column grid on tablet,
  1-column on mobile.

## Phase 8 — Gallery
- Filter tabs use client-side state + Framer Motion `layout`/`AnimatePresence`
  for the re-flow animation on filter change, matching the crossfade/reflow
  behavior implied by the reference.
- Grayscale→color hover carried over from the Home gallery teaser for
  consistency.

## Phase 9 — Contact
- Form built with react-hook-form + zod, matching every field seen in the
  recording (name, phone, email, class style, age group, preferred-day
  multi-select toggle group, optional message).
- Server Action inserts into `trial_leads`; gracefully no-ops with a console
  log (not a user-facing error) when Supabase isn't configured, so the form
  UX is fully reviewable before the backend is connected.

## Phase 10 — Admin CMS
- Every entity from the Phase-10 spec is editable: Hero, Videos/Images (via
  Cloudinary upload field on Classes/Gallery), Gallery, Classes, Schedule,
  Memberships, Testimonials, FAQs, Contact Information, Studio Information,
  Social Links (folded into Settings), SEO (Settings), Homepage Sections
  (Hero + Marquee tags), Settings.
- **Bug caught and fixed during self-review**: admin editors build payloads
  with camelCase keys (matching `lib/types.ts`), but Supabase columns are
  snake_case. Initially this would have silently failed or written wrong
  columns. Fixed with a generic `toSnakeCaseKeys` conversion in the action
  factories, plus two field renames (`index` → `indexLabel`, `order` →
  `sortOrder`) where camelCase→snake_case conversion alone doesn't produce the
  actual DB column name. This is exactly the kind of bug that only surfaces
  at runtime against a real database — flagging it explicitly since it
  couldn't be caught by a build/type check in this network-disabled sandbox,
  only by manually tracing every field name against `supabase/schema.sql`.
- Also caught: `StudioHours` type was missing an `id` field, which the list
  editor requires for edit/delete — fixed in `lib/types.ts` and the
  placeholder data.

## Phase 11 — Final polish
- Added: dynamic `generateMetadata` (title/description/OG from CMS site
  settings), `sitemap.ts`, `robots.ts` (disallows `/admin`), root
  `loading.tsx`/`error.tsx`/`not-found.tsx`.
- Did **not** do: an actual Lighthouse/performance pass, or visual regression
  testing — neither is possible without a running build in this environment.
  Treat this as the highest-priority follow-up once you can `npm run build`
  locally.
- Did **not** do: cross-browser testing, real device responsive testing.

## What I could not QA in this environment
No dev server, no browser, no screenshots of the actual rendered output —
every review pass here was a manual code trace (reading component logic,
cross-checking prop shapes and import paths against their definitions,
checking Tailwind class names against `tailwind.config.ts`), not a visual
comparison. This is a materially weaker QA process than actually rendering
the site and should be treated as a first draft that needs a real
`npm run dev` + browser pass before considering any page "done."

