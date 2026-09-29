import * as THREE from 'three'
import { LAST_STAGE } from '../state/stage'

/**
 * One camera / model / lighting state per scroll stop (hero → contact).
 * Camera is described in spherical coordinates around a look-at target so the
 * path between stops is a smooth orbit rather than a straight-line dolly.
 */
export type Key = {
  az: number // camera azimuth around the model (rad)
  el: number // camera elevation (rad)
  dist: number // camera distance
  ty: number // look-at height
  shiftX: number // model screen offset, fraction of viewport width (desktop)
  shiftY: number // model screen offset, fraction of viewport height (mobile)
  rotY: number // model revolution (rad)
  morph: number // 0 = solid figure, 1 = fully dispersed into the flow field
  solid: number // opacity of the solid mesh (alpha-hash dissolve)
  points: number // opacity of the particle body
  scan: number // visibility of the scan ring
  key: string // key-light colour
  keyI: number
  rim: string // rim-light colour
  rimI: number
}

export const KEYS: Key[] = [
  // HERO — front, tight, model on the right
  { az: 0.0, el: 0.05, dist: 5.3, ty: 0.02, shiftX: 0.2, shiftY: 0.05, rotY: 0.32, morph: 0.0, solid: 1.0, points: 0.0, scan: 1, key: '#ffffff', keyI: 2.6, rim: '#38f0d8', rimI: 2.2 },
  // 01 ABOUT — model left, first revolution, begins to dissolve
  { az: -0.4, el: 0.14, dist: 5.0, ty: 0.05, shiftX: -0.21, shiftY: -0.12, rotY: 2.7, morph: 0.12, solid: 0.82, points: 0.55, scan: 0.6, key: '#dbe6ff', keyI: 2.2, rim: '#38f0d8', rimI: 3.0 },
  // 02 SKILLS — high angle, cool teal wash, mostly particulate
  { az: 0.55, el: 0.34, dist: 5.7, ty: 0.0, shiftX: 0.21, shiftY: -0.12, rotY: 5.0, morph: 0.38, solid: 0.42, points: 0.95, scan: 0.3, key: '#aef7ec', keyI: 1.8, rim: '#38f0d8', rimI: 3.4 },
  // 03 EXPERIENCE — low angle, hard white top light
  { az: -0.62, el: -0.06, dist: 5.3, ty: 0.3, shiftX: -0.21, shiftY: -0.12, rotY: 7.3, morph: 0.5, solid: 0.34, points: 1.0, scan: 0.2, key: '#ffffff', keyI: 3.0, rim: '#8fb4ff', rimI: 2.6 },
  // 04 PROJECTS — wide, warm key, body flows through the whole viewport
  { az: 0.3, el: 0.42, dist: 6.4, ty: 0.0, shiftX: 0.2, shiftY: -0.12, rotY: 9.7, morph: 0.62, solid: 0.22, points: 1.0, scan: 0.15, key: '#ffe0c4', keyI: 2.2, rim: '#38f0d8', rimI: 3.0 },
  // 05 CONTACT — re-condensed, centred, handed to orbit controls
  { az: 0.0, el: 0.1, dist: 5.9, ty: 0.02, shiftX: 0.0, shiftY: 0.04, rotY: Math.PI * 4, morph: 0.0, solid: 1.0, points: 0.28, scan: 0.8, key: '#ffffff', keyI: 2.6, rim: '#38f0d8', rimI: 2.6 },
]

export const CONTACT_KEY = KEYS[LAST_STAGE]

const NUMERIC = ['az', 'el', 'dist', 'ty', 'shiftX', 'shiftY', 'rotY', 'morph', 'solid', 'points', 'scan', 'keyI', 'rimI'] as const

export type Pose = Record<(typeof NUMERIC)[number], number> & {
  keyColor: THREE.Color
  rimColor: THREE.Color
  stage: number
}

/** Mutable, shared pose written by the camera rig every frame and read by the scene objects. */
export const pose: Pose = {
  az: 0, el: 0, dist: 5, ty: 0, shiftX: 0, shiftY: 0, rotY: 0, morph: 0, solid: 1, points: 0, scan: 1, keyI: 2, rimI: 2,
  keyColor: new THREE.Color(KEYS[0].key),
  rimColor: new THREE.Color(KEYS[0].rim),
  stage: 0,
}

const tmpA = new THREE.Color()
const tmpB = new THREE.Color()

/** Sample the keyframe track at a fractional stage into `pose`. */
export function samplePose(s: number) {
  const clamped = Math.min(LAST_STAGE, Math.max(0, s))
  const i = Math.min(LAST_STAGE - 1, Math.floor(clamped))
  const t = clamped - i
  const a = KEYS[i]
  const b = KEYS[i + 1]
  for (const k of NUMERIC) pose[k] = a[k] + (b[k] - a[k]) * t
  pose.keyColor.copy(tmpA.set(a.key)).lerp(tmpB.set(b.key), t)
  pose.rimColor.copy(tmpA.set(a.rim)).lerp(tmpB.set(b.rim), t)
  pose.stage = clamped
}
