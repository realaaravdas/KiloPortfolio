# Aarav Das — Portfolio

Dark-industrial, scroll-driven engineering portfolio for Aarav Das (robotics engineer working on/with AI).
React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · React Three Fiber / three.js.

## Experience

- **Hero** — precision grid, bold type, 3D model of Aarav.
- **5 scroll-triggered sections** — `01 About`, `02 Skills`, `03 Experience`, `04 Featured Projects`, `05 Contact`.
  Each has 4 stat cards (label + value) and drives a different camera angle / lighting state / dispersal level of the model.
- **3D** — one fixed WebGL canvas. The model revolves as you scroll, dissolves into a particle flow field behind the
  content, re-condenses in the last section, and the camera is handed to orbit controls (drag to orbit).
- **HUD** — rotating rings, scroll progress indicator, live telemetry, preloader, WebGL fallback (static portrait).
- **Custom cursor** — the moonshot-style ring + dot (`src/components/Cursor.tsx`), unchanged.

## Editing content

All copy lives in `src/data/resume.ts` (including each section's four stat cards in `sectionStats`).
The `/llms.txt`, `/llms-full.txt` and `/ai/` files are generated from it by `npm run generate:llms` (runs before every build).
The downloadable resume is `public/Aarav_Das_Resume.docx`.

## The 3D model

The site ships with a **procedural placeholder figure**. To use a real image-to-3D model of Aarav, drop a
GLB at `public/models/aarav.glb` — it is picked up automatically. See [docs/3D_WORKFLOW.md](docs/3D_WORKFLOW.md)
for the photo → GLB pipeline (reference photos are in `reference/photos/`).

```bash
npm run model:optimize -- raw.glb   # compress + write public/models/aarav.glb
npm run model:inspect
```

## Code map

```
src/state/stage.ts        scroll -> "stage" (0 hero … 5 contact), shared by DOM + WebGL
src/three/keyframes.ts    per-section camera / model / light states
src/three/Experience3D    Canvas, scroll camera rig, lights, OrbitControls handoff
src/three/Figure.tsx      solid + particle body + turntable, driven by the pose
src/three/figureBuilder   GLB loader, normalisation, surface sampling
src/three/shaders.ts      particle morph shader
src/components/           Hero, sections, HUD, nav, preloader, fallback
```

## Development

```bash
npm install
npm run dev       # dev server
npm run build     # type-check, generate llms files, production build
npm run preview
npm run lint
```

## Media

Photos/videos go in `src/assets/photos/` and are referenced from the section components
(the FRC gallery in `Experience.tsx` is the pattern to follow).

## Deploying

`dist/` is static and deploys to any static host (Vercel, Netlify, GitHub Pages, …).
