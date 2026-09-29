import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Stylised, low-poly stand-in for the image-to-3D model of Aarav. Palette follows the
 * reference photos (blue shell jacket, grey trail pants, dark hair, green/black shoes).
 * It is built ~2 units tall, facing +Z.
 *
 * This is a placeholder only: replace it by dropping a generated /public/models/aarav.glb.
 */

const COLORS = {
  jacket: '#2b4a94',
  jacketDark: '#1d3268',
  pants: '#55585d',
  skin: '#b9825f',
  hair: '#14100e',
  shoe: '#2c312b',
  shoeAccent: '#b5e33c',
}

type Part = {
  geo: THREE.BufferGeometry
  color: string
  pos?: [number, number, number]
  rot?: [number, number, number]
  scale?: [number, number, number]
}

function bake(p: Part) {
  const g = p.geo
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(...(p.pos ?? [0, 0, 0])),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...(p.rot ?? [0, 0, 0]))),
    new THREE.Vector3(...(p.scale ?? [1, 1, 1])),
  )
  g.applyMatrix4(m)
  const c = new THREE.Color(p.color)
  const n = g.attributes.position.count
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r
    arr[i * 3 + 1] = c.g
    arr[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  // keep attribute sets identical so the parts can be merged
  g.deleteAttribute('uv')
  return g
}

const cap = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 6, 16)
const sph = (r = 1) => new THREE.SphereGeometry(r, 24, 16)

export function buildProceduralFigure(): THREE.Group {
  const parts: Part[] = []

  for (const side of [-1, 1]) {
    // legs
    parts.push({ geo: cap(0.098, 0.4), color: COLORS.pants, pos: [side * 0.125, -0.28, 0], rot: [0, 0, side * 0.02] })
    parts.push({ geo: cap(0.078, 0.38), color: COLORS.pants, pos: [side * 0.13, -0.7, 0.01] })
    // shoes
    parts.push({ geo: cap(0.075, 0.12), color: COLORS.shoe, pos: [side * 0.13, -0.955, 0.075], rot: [Math.PI / 2, 0, 0], scale: [1.05, 1, 0.75] })
    parts.push({ geo: sph(0.05), color: COLORS.shoeAccent, pos: [side * 0.13, -0.965, 0.15], scale: [1.3, 0.55, 1.2] })
    // arms, slight A-pose
    const ax = side * 0.33
    parts.push({ geo: cap(0.062, 0.3), color: COLORS.jacket, pos: [ax + side * 0.045, 0.4, 0], rot: [0, 0, side * 0.2] })
    parts.push({ geo: cap(0.052, 0.3), color: COLORS.jacketDark, pos: [ax + side * 0.135, 0.1, 0.03], rot: [0.1, 0, side * 0.12] })
    parts.push({ geo: sph(0.05), color: COLORS.skin, pos: [ax + side * 0.165, -0.11, 0.05], scale: [1, 1.15, 0.8] })
    // shoulders
    parts.push({ geo: sph(0.085), color: COLORS.jacket, pos: [side * 0.29, 0.56, 0] })
    // ears
    parts.push({ geo: sph(0.028), color: COLORS.skin, pos: [side * 0.148, 0.82, -0.005], scale: [0.6, 1, 0.9] })
  }

  // pelvis, torso (jacket), hem
  parts.push({ geo: sph(0.19), color: COLORS.pants, pos: [0, -0.06, 0], scale: [1, 0.7, 0.66] })
  parts.push({ geo: cap(0.2, 0.34), color: COLORS.jacket, pos: [0, 0.27, 0], scale: [1.18, 1, 0.66] })
  parts.push({ geo: sph(0.21), color: COLORS.jacket, pos: [0, 0.03, 0], scale: [1.12, 0.55, 0.7] })
  // hood roll
  parts.push({ geo: new THREE.TorusGeometry(0.1, 0.04, 10, 24), color: COLORS.jacketDark, pos: [0, 0.6, -0.02], rot: [Math.PI / 2 - 0.25, 0, 0], scale: [1.15, 1.1, 1] })
  // neck + head
  parts.push({ geo: new THREE.CylinderGeometry(0.052, 0.062, 0.12, 14), color: COLORS.skin, pos: [0, 0.64, 0.005] })
  parts.push({ geo: sph(1), color: COLORS.skin, pos: [0, 0.82, 0.01], scale: [0.14, 0.175, 0.15] })
  // hair, swept-back cap
  parts.push({ geo: sph(1), color: COLORS.hair, pos: [0, 0.875, -0.018], scale: [0.152, 0.145, 0.16] })
  parts.push({ geo: sph(1), color: COLORS.hair, pos: [0, 0.94, 0.03], scale: [0.128, 0.06, 0.11] })
  // nose hint
  parts.push({ geo: sph(0.022), color: COLORS.skin, pos: [0, 0.805, 0.15], scale: [0.85, 1.2, 1] })

  const merged = mergeGeometries(parts.map(bake), false)
  merged.computeVertexNormals()

  const mesh = new THREE.Mesh(
    merged,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.2 }),
  )
  const g = new THREE.Group()
  g.add(mesh)
  return g
}
