---
name: Lecture prev/next nav must keep position context
description: Why the lecture nav buttons must show titles + "Lecture X of N", and how prev/next order is derived
---

Lecture prev/next nav in LectureView is computed from `week.lectures` (all lectures in the unit), ordered by the server's `buildWeek` query. The last lecture legitimately has no Next button.

**Rule:** Never strip the destination title or the "Lecture X of N" indicator from the prev/next nav. Without them, reaching the genuine last lecture (a dead-end by design) reads to the user as "blocked / can't get past this lecture."

**Why:** A user entered the lecture flow at the trailing diagnostic primers (the last two lectures), clicked Next once, hit the true last lecture with no Next, and — because the titles had been removed to fix an overlap bug — had no way to tell they were at the end vs. blocked. Reported it as a hard navigation block.

**How to apply:**
- Fix nav-title overlap with truncation, not deletion: `Link` = `block w-full min-w-0`, button = `overflow-hidden`, title = `truncate` inside a `min-w-0` flex column. Deleting the title is not an acceptable overlap fix.
- `buildWeek` currently orders lectures by `lecture.id`, which happens to match topic position. If reseeds ever drift ids (see course-content-reseed), order by topic position instead so the reading sequence can't scramble.
