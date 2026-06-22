# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

"Електростанції" ("Power Stations") is a **design/build project for a solar energy company website** — most likely a Ukrainian-language site for selling and installing rooftop/solar power systems. It is at the asset-staging stage: there is **no application source code, no build system, no package.json, and no git repo yet.** The first substantive task will be to scaffold the actual site.

When you build it, generate code into the project root (or a conventional structure like `src/` for a React/Next app, or a flat set of HTML/CSS/JS files for a static build). Confirm the stack with the user if it is not already decided — there is no committed decision yet.

## Repository contents

- `assets/images/` — **Real client photos** (WhatsApp exports, dated 2026-06-17) of completed rooftop solar panel installations. These are the genuine content/imagery for the site. Prefer these over stock or `picsum.photos` placeholders for hero, gallery, and proof sections.
- `assets/SaveWeb2ZIP Website Copier (1)/` — A scraped copy of the **"Zailar" Webflow solar e-commerce template** (`index.html` + `css/`, `js/`, `images/`, `fonts/`, `media/`). This is a **design reference only**, not the codebase. It uses GSAP (`gsap.min.js`, `SplitText.min.js`) and Webflow's runtime. Open `index.html` in a browser to preview it. Do not build on top of the Webflow runtime; treat it as inspiration for layout, sections, and motion.
- `.claude/rules/` — The design skill library that governs all design/frontend output (see below).

## Design rules are mandatory and already loaded

`.claude/rules/*/SKILL.md` are project instructions injected into context, not optional docs. `.claude/rules/llms.txt` is the index of which skill does what. Key points that override default behavior:

- **`taste-skill` is the default design skill.** Read the brief, infer the design language, set three dials (DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY), and run its pre-flight checklist before shipping any UI. Other skills are specialized: `redesign-skill` (auditing/upgrading existing UI), `minimalist-skill`, `brutalist-skill`, `soft-skill` (specific aesthetics), `brandkit` + `imagegen-frontend-*` (image generation only, no code), `image-to-code-skill` (generate reference images first, then code).
- **Hard bans enforced across skills:** no em-dash (`—`) anywhere visible; no `Inter` font as default (use Geist/Satoshi/Cabinet Grotesk/Outfit); no pure black `#000000`; no AI-purple gradients; no emojis in code/markup/content; no generic 3-equal-card feature rows; no "John Doe"/"Acme" placeholder names; no fake-round numbers.
- **Default config baselines** (from `taste-skill-v1` and `taste-skill`): VARIANCE 8, MOTION 6, DENSITY 4. Adjust per the user's brief — do not edit the skill files to change them.
- **`output-skill`** forbids placeholder/elision patterns (`// ...`, "rest follows the same pattern"): deliver complete, runnable files.
- For a solar/energy brand the content register is trust-first and concrete (installation specs, real photos, location). Avoid marketing clichés ("Elevate", "Seamless", "Next-Gen").

## Stack conventions (when scaffolding)

The skills assume, unless the user says otherwise: React/Next.js with Server Components, Tailwind CSS (check version before using v4 syntax), `motion/react` (Framer Motion) for UI motion, GSAP + ScrollTrigger only for isolated scroll-telling, and Phosphor/Radix/Tabler icons (never hand-rolled SVG icon paths). Use `min-h-[100dvh]` not `h-screen`. Verify any dependency exists before importing it; output the install command for anything missing.

## Notes

- Content is expected to be **Ukrainian**; keep copy, alt text, and metadata in Ukrainian unless told otherwise.
- The `SaveWeb2ZIP` reference folder is large (~8MB of media/fonts). Do not copy it wholesale into the build — pull only what is genuinely reused, and re-export the real `assets/images/` photos at appropriate sizes.
