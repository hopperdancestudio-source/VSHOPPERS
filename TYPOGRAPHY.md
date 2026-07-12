# Typography — reasoning

The reference video does not expose font files or CSS, so exact-family identification isn't
possible from pixels alone. Here's what the letterforms tell us, and the closest free
(Google Fonts) match for each role.

## 1. Display / hero & section headlines
("LIFE IS BETTER WHEN YOU DANCE", "CLASS SCHEDULE", "READY TO MOVE?", "THE GALLERY")

Observed traits: extremely heavy weight, very tight letter-spacing (near 0 or slightly
negative), condensed-but-not-extreme proportions, squared-off terminals, near-vertical
stress, no italics used for emphasis (color is used instead). This is a poster/display
grotesque in the vein of Helvetica Inserat / Impact, not a geometric sans.

**Closest Google Font: `Anton`.**
Anton is a single-weight ultra-bold condensed grotesque built for exactly this kind of
poster headline use, and its proportions (x-height, terminal shapes) are a close match to
what's on screen. Fallback stack: `Impact, sans-serif`.

## 2. Navigation, buttons, eyebrows, tags, small caps labels
("CLASSES · SCHEDULE · ABOUT", "VIEW SCHEDULE", "MOST POPULAR", "EST. 2016 · KHARGHAR")

Observed traits: condensed but noticeably lighter/narrower than the display face, used at
small sizes with wide letter-spacing in all-caps contexts (eyebrows, tags). This reads as a
distinct family from the hero type, not just a smaller weight of it.

**Closest Google Font: `Barlow Condensed` (weights 500/600/700).**
It's a true condensed grotesque with a full weight range, so it can carry both the bolder
nav/button text and the lighter-weight eyebrow labels without switching families again.

## 3. Body copy
(paragraph text in class descriptions, about blurbs, form labels/placeholders)

Observed traits: a standard-width, high-legibility grotesque — notably wider and more
neutral than the nav/eyebrow face, consistent with a body-text-optimized UI font rather
than a display face used at small size.

**Closest Google Font: `Inter` (weights 400/500).**
Neutral, highly legible at small sizes, and the de facto standard for this kind of UI body
text — a safe, unremarkable choice, which is exactly right for a role that shouldn't call
attention to itself.

## Loading strategy
All three loaded via `next/font/google` in `app/layout.tsx` (self-hosted at build time, zero
layout shift, no runtime request to Google Fonts).

## If you have access to the live site
If you can view the deployed site's computed styles (devtools → inspect → computed → font-family),
send me the actual family names and I'll swap the token values directly — no other code changes
needed since every component consumes `font-display` / `font-heading` / `font-body` utility
classes rather than hardcoded families.
