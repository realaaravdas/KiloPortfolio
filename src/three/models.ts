/**
 * 3D asset manifest.
 *
 * Drop generated .glb files into /public/models and they are picked up automatically —
 * no code changes needed. If the hero file is missing or fails to parse, the scene falls
 * back to the procedural placeholder figure (see proceduralFigure.ts), so the site
 * always renders. See docs/3D_WORKFLOW.md for how to generate the files from photos.
 */
export const MODELS = {
  /** Centerpiece: image-to-3D reconstruction of Aarav (from reference/photos). */
  hero: {
    url: '/models/aarav.glb',
    /** Rotate the loaded mesh so its face points at +Z (most generators output +Z or -Z). */
    rotationY: 0,
    /** World height the model is normalised to. */
    height: 2,
  },
  /**
   * Additional generated props (robot, rover, ball collector, …). Reserved for the
   * reference images you'll supply later; not rendered yet.
   */
  props: [] as { id: string; url: string; note: string }[],
} as const
