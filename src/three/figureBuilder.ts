import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MODELS } from './models'
import { buildProceduralFigure } from './proceduralFigure'

export type Figure = {
  /** The renderable solid model, already normalised to `MODELS.hero.height` and centred. */
  root: THREE.Object3D
  /** Surface-sampled particle cloud of the same model: position / aColor / aSeed. */
  points: THREE.BufferGeometry
  /** Every material on the solid, so opacity can be driven from the scroll. */
  materials: THREE.Material[]
  source: 'glb' | 'procedural'
}

/** Fetch with progress. Returns null when the file is absent (Vite's SPA fallback serves HTML). */
async function fetchGlb(url: string, onProgress: (p: number) => void): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    if ((res.headers.get('content-type') ?? '').includes('text/html')) return null
    const total = Number(res.headers.get('content-length')) || 0
    const chunks: Uint8Array[] = []
    let got = 0
    if (res.body) {
      const reader = res.body.getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        got += value.length
        if (total) onProgress(Math.min(0.9, got / total))
      }
    } else {
      const b = new Uint8Array(await res.arrayBuffer())
      chunks.push(b)
      got = b.length
    }
    const out = new Uint8Array(got)
    let o = 0
    for (const c of chunks) {
      out.set(c, o)
      o += c.length
    }
    // glb magic: "glTF"
    if (out.length < 12 || out[0] !== 0x67 || out[1] !== 0x6c || out[2] !== 0x54 || out[3] !== 0x46) return null
    return out.buffer
  } catch {
    return null
  }
}

async function loadGlb(onProgress: (p: number) => void): Promise<THREE.Object3D | null> {
  const buf = await fetchGlb(MODELS.hero.url, onProgress)
  if (!buf) return null
  const loader = new GLTFLoader()
  const draco = new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(draco)
  loader.setMeshoptDecoder(MeshoptDecoder)
  try {
    const gltf = await loader.parseAsync(buf, '')
    return gltf.scene
  } catch (err) {
    console.warn('[figure] Could not parse /models/aarav.glb, using the procedural placeholder.', err)
    return null
  } finally {
    draco.dispose()
  }
}

/** Scale to a fixed height and centre on the origin. */
function normalise(object: THREE.Object3D) {
  const wrapper = new THREE.Group()
  wrapper.add(object)
  object.rotation.y += MODELS.hero.rotationY
  wrapper.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(wrapper)
  const size = box.getSize(new THREE.Vector3())
  const k = MODELS.hero.height / Math.max(size.y, 1e-6)
  const center = box.getCenter(new THREE.Vector3())
  object.scale.multiplyScalar(k)
  object.position.set(-center.x * k, -center.y * k, -center.z * k)
  wrapper.updateMatrixWorld(true)
  return wrapper
}

const pixelCache = new WeakMap<object, { data: Uint8ClampedArray; w: number; h: number } | null>()
function texturePixels(map: THREE.Texture) {
  if (pixelCache.has(map)) return pixelCache.get(map)!
  let out: { data: Uint8ClampedArray; w: number; h: number } | null = null
  try {
    const img = map.image as CanvasImageSource & { width: number; height: number }
    const s = Math.min(1, 512 / Math.max(img.width, img.height))
    const w = Math.max(1, Math.round(img.width * s))
    const h = Math.max(1, Math.round(img.height * s))
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0, w, h)
    out = { data: ctx.getImageData(0, 0, w, h).data, w, h }
  } catch {
    out = null
  }
  pixelCache.set(map, out)
  return out
}

/** Area-weighted surface sampling so the particle body matches the solid (works for any mesh / GLB). */
function buildPoints(root: THREE.Object3D, count: number): THREE.BufferGeometry {
  type Src = { mesh: THREE.Mesh; sampler: MeshSurfaceSampler; area: number; mat: THREE.MeshStandardMaterial | null }
  const sources: Src[] = []
  root.updateMatrixWorld(true)
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh || !mesh.geometry?.attributes.position) return
    const geo = mesh.geometry
    const pos = geo.attributes.position
    const idx = geo.index
    const tris = idx ? idx.count / 3 : pos.count / 3
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    const c = new THREE.Vector3()
    const step = Math.max(1, Math.floor(tris / 4000))
    let area = 0
    for (let t = 0; t < tris; t += step) {
      const i0 = idx ? idx.getX(t * 3) : t * 3
      const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1
      const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2
      a.fromBufferAttribute(pos, i0).applyMatrix4(mesh.matrixWorld)
      b.fromBufferAttribute(pos, i1).applyMatrix4(mesh.matrixWorld)
      c.fromBufferAttribute(pos, i2).applyMatrix4(mesh.matrixWorld)
      area += b.sub(a).cross(c.sub(a)).length() * 0.5 * step
    }
    const sampler = new MeshSurfaceSampler(mesh).build()
    const m = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    sources.push({ mesh, sampler, area, mat: (m as THREE.MeshStandardMaterial) ?? null })
  })
  const totalArea = sources.reduce((s, x) => s + x.area, 0) || 1

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 4)
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()
  const col = new THREE.Color()
  const uv = new THREE.Vector2()
  const texel = new THREE.Color()
  const fallback = new THREE.Color('#99a')
  let w = 0
  for (const src of sources) {
    const share = Math.max(1, Math.round((src.area / totalArea) * count))
    const hasVertexColor = !!src.mesh.geometry.attributes.color
    const pix = src.mat?.map ? texturePixels(src.mat.map) : null
    for (let k = 0; k < share && w < count; k++, w++) {
      src.sampler.sample(p, n, col, uv)
      p.applyMatrix4(src.mesh.matrixWorld)
      positions[w * 3] = p.x
      positions[w * 3 + 1] = p.y
      positions[w * 3 + 2] = p.z
      if (!hasVertexColor) {
        col.copy(src.mat?.color ?? fallback)
        if (pix) {
          const u = ((uv.x % 1) + 1) % 1
          const v = ((uv.y % 1) + 1) % 1
          const px = Math.min(pix.w - 1, Math.floor(u * pix.w))
          const py = Math.min(pix.h - 1, Math.floor((1 - v) * pix.h))
          const o = (py * pix.w + px) * 4
          texel.setRGB(pix.data[o] / 255, pix.data[o + 1] / 255, pix.data[o + 2] / 255, THREE.SRGBColorSpace)
          col.multiply(texel)
        }
      }
      colors[w * 3] = col.r
      colors[w * 3 + 1] = col.g
      colors[w * 3 + 2] = col.b
      seeds[w * 4] = Math.random()
      seeds[w * 4 + 1] = Math.random()
      seeds[w * 4 + 2] = Math.random()
      seeds[w * 4 + 3] = Math.random()
    }
  }
  // Rounding can leave a few slots empty: repeat earlier points.
  for (let i = 0; w < count; w++, i++) {
    positions.copyWithin(w * 3, i * 3, i * 3 + 3)
    colors.copyWithin(w * 3, i * 3, i * 3 + 3)
    seeds[w * 4] = Math.random()
    seeds[w * 4 + 1] = Math.random()
    seeds[w * 4 + 2] = Math.random()
    seeds[w * 4 + 3] = Math.random()
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  return g
}

export async function loadFigure(pointCount: number, onProgress: (p: number) => void): Promise<Figure> {
  const glb = await loadGlb(onProgress)
  const source: Figure['source'] = glb ? 'glb' : 'procedural'
  const root = normalise(glb ?? buildProceduralFigure())
  onProgress(0.94)

  const materials = new Set<THREE.Material>()
  root.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
    if (!m) return
    for (const mat of Array.isArray(m) ? m : [m]) {
      // Dither-based dissolve: no transparency sorting problems on overlapping limbs.
      mat.alphaHash = true
      materials.add(mat)
    }
  })

  const points = buildPoints(root, pointCount)
  onProgress(1)
  return { root, points, materials: [...materials], source }
}
