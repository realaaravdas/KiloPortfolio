# 3D asset workflow

The hero of the site is a 3D model of Aarav. **The site ships with a procedural placeholder figure**
(`src/three/proceduralFigure.ts`) because turning photos into a real mesh needs a GPU-hosted
image-to-3D model, which isn't available in the environment this site was built in. The site is
already wired to pick up the real model automatically, so this is a drop-in step.

```
photos  ──►  image-to-3D generator  ──►  clean-up (Blender)  ──►  npm run model:optimize  ──►  public/models/aarav.glb
reference/photos/                                                                                   (auto-loaded)
```

## 1. Reference photos

`reference/photos/` holds the four photos provided:

| File | Use |
| --- | --- |
| `ref-1.jpg` | Full-body, front, hands in pockets. Best for proportions and clothing. |
| `ref-2.jpg` | Waist-up, front, sharp face. Best for the face/head. |
| `ref-3.jpg` | Turned 3/4 view (also shows the side of the head). Good second view. |
| `ref-4.jpg` | Sunglasses, different jacket. **Skip** for likeness (glasses, different outfit). |

Use `ref-1`, `ref-2`, `ref-3`: same jacket and trousers in all three, which keeps the texture consistent.

## 2. Generate the mesh

Pick one. Multi-view input gives a much better back and sides than a single image.

| Tool | Notes |
| --- | --- |
| **Hunyuan3D-2 (multi-view)** — open source, run on a GPU (local, Colab, RunPod) | Best quality/likeness for the effort. Feed front / side / back views. Outputs a textured GLB. |
| **TRELLIS** (Microsoft, open source) | Good single- and multi-image reconstruction, GLB export. |
| **Meshy / Tripo / Rodin** — hosted | Easiest: upload the photos, download a GLB. Check the licence terms for your use. |
| **Photogrammetry** (Polycam, RealityCapture, Meshroom) | Most faithful likeness, but needs ~40–100 photos walking around you, not the 4 we have. |

There's no back view in the current set. If the generator hallucinates the back of the jacket, take one
extra photo from behind in the same outfit and add it as a view.

## 3. Clean up (Blender, ~10 min)

1. Delete any floor / background geometry the generator produced.
2. Orientation: **Y-up, facing +Z**, origin at the feet, real-world scale (~1.75 m). The site re-scales to a fixed height either way, but facing direction matters. If the model faces the wrong way, set `MODELS.hero.rotationY` in `src/three/models.ts` (e.g. `Math.PI`) instead of editing the mesh.
3. Decimate to **≤ 60k triangles**. Textures ≤ 2048px. A PBR base-colour texture is enough.
4. Export as **glTF Binary (.glb)** with Apply Modifiers on.

## 4. Optimise and drop it in

```bash
npm run model:optimize -- ~/Downloads/raw-aarav.glb   # meshopt + WebP, writes public/models/aarav.glb
npm run model:inspect                                   # triangle count, texture sizes, file size
npm run dev                                             # the placeholder is replaced automatically
```

Target: **under ~5 MB**. No code changes are needed. `src/three/figureBuilder.ts` fetches
`/models/aarav.glb`, checks the `glTF` header, and falls back to the placeholder if the file is missing or
unparseable.

### What the site does with the mesh

- **Solid model**: your materials are used as-is; opacity is driven from the scroll with an alpha-hash
  (dithered) dissolve, so it needs no sorting tricks.
- **Particle body**: 30k points are area-weighted-sampled over the mesh surface; colours come from vertex
  colours, or the base-colour texture at each sample's UV. Those particles are what "morph" into the flow
  field as you scroll, then re-condense in the final section.
- Everything is normalised (scaled to `MODELS.hero.height`, centred), so exporter scale doesn't matter.

## 5. Additional assets (robot, rover, ball collector, …)

Send the reference images and generate them the same way, then register them in `MODELS.props` in
`src/three/models.ts`. Props are reserved in the manifest but not rendered yet. Placing them (e.g. orbiting the
figure in the Projects section) is a small addition to `src/three/Figure.tsx` once the files exist.
