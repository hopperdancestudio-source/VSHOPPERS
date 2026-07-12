# Comparison report — build vs. reference recording

Honest self-assessment, organized by confidence level. "Reference" means the
uploaded 141-second recording; no other source was available.

## High confidence — directly observed and replicated
- **Page set & routes**: Home, Classes, Schedule, About, Gallery, Contact —
  matches the reference's nav exactly.
- **Section presence and order** within each page (see `QA-NOTES.md` for the
  per-page breakdown), with one documented correction (age-batches moved from
  Home to Classes after re-review).
- **Visual language**: near-black backgrounds, red/orange accent, hard square
  corners (zero border-radius) everywhere, heavy condensed display type for
  headlines, numbered/lettered section markers (01./02.), left-accent-bar
  descriptions, oversized bleeding background words on CTA banners.
- **Component patterns**: alternating image/text rows (Classes), color-coded
  weekly grid (Schedule), ribboned "most popular" pricing card, numbered
  4-column value cards (About), horizontal dotted timeline (About), filter
  tabs + grid (Gallery), split-panel map CTA + accordion FAQ (Contact).
- **Interaction patterns present**: navbar scroll-solidify, hover-to-color
  grayscale images, staggered hero load-in, scroll-triggered reveals,
  accordion expand/collapse, filter-triggered grid re-layout.

## Medium confidence — pattern matched, values estimated
- Type scale, spacing scale, container widths: proportionally consistent
  internally, not pixel-verified against the source (see `ASSUMPTIONS.md`).
- Font family choice (Anton/Barlow Condensed/Inter): strong letterform match,
  not confirmed against actual CSS.
- Animation timing/easing: same *character* (quick, slightly decelerated,
  staggered) but not frame-measured.
- Colors: visually sampled, not color-picked from real CSS.

## Not verifiable from a passive recording
- Exact hover/focus/active state styling beyond what happened to be captured
  on screen during the few seconds a cursor was visible.
- Tablet/mobile layouts — recording is desktop-only. Responsive behavior here
  follows conventional patterns for this design style, not observed behavior.
- Loading states, error states, empty states, 404 handling, SEO meta tags —
  none of these appear in a UI walkthrough recording. Built to a sensible
  production-quality bar rather than matched to anything.
- Any content/sections that may exist on the live site outside the ~40-second
  window shown per page (see `ASSUMPTIONS.md`).

## Explicit deviations (intentional, not gaps)
- All business identity (name, address, phone, pricing, dance styles, real
  photos) is placeholder/CMS-driven per your explicit instruction — the
  reference's specific business content was never meant to be reproduced.
- Accessibility additions not present in the reference: visible
  `:focus-visible` outlines, `prefers-reduced-motion` support, semantic form
  labels/`aria-expanded` on the FAQ accordion. Added because "production
  quality" was specified as a priority alongside visual fidelity, and these
  don't change the visual experience for a mouse/trackpad user.

## Net assessment
Structurally and stylistically, someone who watched the reference recording
and then used this site side-by-side should recognize it as the same
interface — same pages, same section order, same visual system, same
interaction patterns. The parts most likely to need a follow-up correction
pass, in priority order: (1) exact type/spacing scale once you can inspect
the live site's CSS, (2) confirming the real font-family names, (3) filling
in any Home-page sections outside the recorded window, (4) tablet/mobile
layout review since none of that was observable on video.
