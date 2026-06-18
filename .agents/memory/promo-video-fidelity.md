---
name: Promo video must match real app identity
description: When rebuilding the course-promo video to "show the real course", enforce app-fidelity explicitly — the design subagent defaults to its own aesthetic.
---

# Promo video fidelity to the real app

When the brief is "make the promo video actually show the course", the video-js
DESIGN subagent's first pass uses ITS OWN creative tokens (e.g. indigo
`#4f46e5` + Outfit/Plus Jakarta Sans) instead of the real product identity. It
also tends to drop the app chrome and simplify feature UI.

**Why:** the video-js skill tells the subagent it owns all creative decisions, so
"product demo" intent loses to generic motion-graphics defaults unless fidelity
is stated as a hard constraint and verified.

**How to apply:** for a product-walkthrough promo, after the subagent's first
pass, run the architect review and check against the real app, then send a
targeted fix list. The real `qr-course` identity to match:
- deep navy primary `hsl(222,47%,11.2%)`, white bg, emerald/blue/orange accents
- SERIF headings (Playfair Display) + Inter body
- persistent navy left sidebar (Dashboard/Assignments/Assessments/Grades/
  Analytics) + top utility bar must frame the feature scenes
- lecture depth toggle is a 4-state squared navy group: Short/Medium/Long/**Yours**
- keep runtime ≤45s; keep useVideoPlayer + keyed AnimatePresence wiring unchanged
Verify by reading index.css tokens + index.html font import, not just the
subagent's summary. The screenshot tool reloads the iframe so it always catches
scene 1 — it cannot confirm later scenes.
