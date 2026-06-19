---
name: Subject conversion blind spots
description: Non-obvious places that still carry the old course subject after a rebrand
---

When converting the course to a new subject (e.g. Evolutionary → Criminal Psychology), the obvious copy is in `artifacts/*/src/.../video_scenes/SceneN.tsx`. The easily-missed spots that strand old branding:

- `artifacts/<video-artifact>/index.html` — `<title>` plus `og:title`/`og:description` and `twitter:title`/`twitter:description` meta still name the old subject.
- `artifacts/<video-artifact>/YOUTUBE_DESCRIPTION.md` — a full per-artifact description (title options, topic list, hashtags, chapters) themed to the old subject.

**Why:** these files don't render in the app preview and don't show up in a `SceneN.tsx` text grep, so a scene-only conversion passes visual checks while metadata/docs keep the old subject.

**How to apply:** after editing scenes, run a repo-wide sweep for old-subject terms across the whole artifact dir (not just scenes), and check `index.html` + any `*DESCRIPTION*.md`. Keep one canonical YouTube description (repo-root `youtube-description.md`) and treat artifact-local copies as synced mirrors.

Two more easily-missed spots:

- **ALL sibling video/demo artifacts, not just the headline promo.** A subject rebrand must cover every `video`-kind artifact (e.g. `course-promo`, `qr-course-demo`, `diagnostics-demo`) plus their `.replit-artifact/artifact.toml` `title` (canvas/preview labels read from there). Update toml titles via `verifyAndReplaceArtifactToml` (temp `artifact.edit.toml` → validate), never edit the toml in place.
- **Demo videos are intentionally partial screencasts.** The `qr-course-demo` only ever shows a subset of topics (e.g. lectures 1.1–1.5 with a "6 Lectures" label) — that is original format, not a conversion bug. Per the user's "convert in place, keep format/length intact" preference, do NOT expand demo scenes to list every course topic; only re-theme the existing copy. A code review may flag this as "missing topics 1.6–1.8" — that's over-applying the main-app's topic count to a demo and should be declined.

Even more easily-missed spots (caught only by code review, not by an initial scene/`index.html` grep):

- **`reasoning.ts` deterministic-feedback + question-generator prompt strings** name the old subject inline (e.g. "criminal-psychology cases", "ORIGINAL <subject> questions"). These are buried in template literals, not obvious UI copy.
- **Demo scenes hard-code typed "student answers" and AI feedback that are subject-specific**, separate from the displayed question prompt. A scene can show a correctly-rethemed prompt while the simulated typed answer (e.g. `setTypedAnswer("Their character.")`) is still legacy and semantically off-topic.
- **Demo assignment/card titles must match the SEEDED assignment titles verbatim**, not a paraphrase. e.g. seed "Homework 1.1 — Measuring, metrics, menus, and forecasting" vs a demo card "Homework 1.1 — What hospitality analytics is" looks fine in isolation but is inconsistent with the live app.
- **Backend `catch{}` fallback prompts** (e.g. practice-problem generator) carry the old domain's example scenario; they only surface when generation fails, so a happy-path test never reveals them.

**Why:** a SceneN.tsx + index.html grep misses backend prompt literals, simulated demo answers, and fallback branches. **How to apply:** grep the WHOLE repo (incl. `routes/*.ts`, `lib/*.ts`) for old-subject terms AND a small set of broad words ("character", "case", "the person"), and cross-check demo card/assignment labels against the seed file. Run an architect review with `includeGitDiff:true` — it reliably catches these.

Repo-root + asset blind spots (found only by a true whole-repo grep, not artifact-scoped):

- **There are THREE separate README/description docs that drift independently:** repo-root `README.md`, `replit.md`, AND repo-root `youtube-description.md` — plus the per-artifact `YOUTUBE_DESCRIPTION.md`. A prior conversion can update `replit.md` while leaving `README.md`/`youtube-description.md` on the old subject. Convert all of them.
- **`BLUEPRINT.md` can be staler than the prior subject entirely** — it described a long-dead "Ethics 101" 4-unit/27-topic version (never updated in the hospitality conversion). For a subject swap, fix the identity + topic list + the directly-conflicting structural facts (topic count, midterm→unit test, artifact list, no-login→Clerk); do NOT undertake a full architectural re-doc (out of scope).
- **`artifacts/qr-course/public/logo.svg`** carried a hard-coded `aria-label` + visible text from a much older brand ("Ethics 101"). It's referenced by Clerk's sign-in appearance (`logoImageUrl` in `App.tsx`), so it shows on the login screen. Grep svg assets for stale brand text.

Tone/audience rebrand blind spots (separate from a subject swap — e.g. "de-children-ify" / strip dumbed-down marketing framing):

- Banned framing words ("friendly", "no math/no coding required", "no technical skills required", "age-appropriate", "middle schoolers", "curious students and grown-ups") hide in **backend prompt template literals**, not just docs/UI: the per-week course summary in `routes/course.ts` `WEEK_TITLES`, and internal LLM tone instructions in `routes/diagnostics.ts` / `lib/reasoning.ts` (e.g. "Friendly, plain English").
- **Keep functional vs. marketing uses distinct:** in-app assignment instructions "No math is required — explain your reasoning" are answer-format guidance and should STAY; only strip the *marketing/audience* framing. Likewise "...for Everyone" unit titles are acceptable (not child/baby).
- **Video wordmarks split across JSX** (`Analytics<br/><span>for Children</span>`) survive a literal-string sed of the full old name — fix scene `.tsx` wordmarks manually.

**Why:** a docs/UI grep misses prompt literals; a full-name sed misses JSX-split wordmarks. **How to apply:** after edits, run a narrow scan for the banned words across docs + `src/routes/*` + `src/lib/*`, and run an architect review with `includeGitDiff:true` (it reliably catches the residual prompt-string framing).

DB reseed prerequisite: the seed self-heal runs on api-server boot but **requires the schema to already exist**. On a fresh/wiped DB the boot log shows `relation "topics" does not exist` and seeding aborts. Run `pnpm --filter @workspace/db run push` first, then restart api-server — the reseed then succeeds.
