import { useEffect, useRef } from 'react'

// A PCB-style trace network confined to the hero section. Traces sit mostly
// dormant; moving the cursor nearby sends a glowing signal outward from the
// nearest junction, branching and fading as it travels the board.
const CELL = 48
const SEED_DENSITY = 1 / 42000 // seed walks per px^2 of canvas area
const MOUSE_RADIUS = 150
const SPAWN_COOLDOWN_MS = 140
const MAX_PULSES = 90
const BRANCH_DECAY = 0.7
const MIN_ENERGY = 0.1
const PULSE_SPEED = 560 // px/sec

const TRACE_COLOR = '56 240 216' // matches --color-accent, as an r g b triplet

type Point = { x: number; y: number }
type NodeKey = string
type Edge = { a: NodeKey; b: NodeKey; p1: Point; p2: Point; length: number }

type Pulse = {
  edge: Edge
  reverse: boolean
  t: number
  energy: number
  cameFrom: NodeKey
}

function key(col: number, row: number): NodeKey {
  return `${col},${row}`
}

function buildNetwork(width: number, height: number) {
  const cols = Math.max(2, Math.floor(width / CELL))
  const rows = Math.max(2, Math.floor(height / CELL))
  const toPoint = (col: number, row: number): Point => ({ x: col * CELL, y: row * CELL })

  const adjacency = new Map<NodeKey, Edge[]>()
  const edgeSet = new Set<string>()
  const edges: Edge[] = []

  function addEdge(c1: number, r1: number, c2: number, r2: number) {
    const a = key(c1, r1)
    const b = key(c2, r2)
    const id = a < b ? `${a}|${b}` : `${b}|${a}`
    if (edgeSet.has(id)) return
    edgeSet.add(id)
    const p1 = toPoint(c1, r1)
    const p2 = toPoint(c2, r2)
    const edge: Edge = { a, b, p1, p2, length: Math.hypot(p2.x - p1.x, p2.y - p1.y) }
    edges.push(edge)
    if (!adjacency.has(a)) adjacency.set(a, [])
    if (!adjacency.has(b)) adjacency.set(b, [])
    adjacency.get(a)!.push(edge)
    adjacency.get(b)!.push(edge)
  }

  const seedCount = Math.max(5, Math.round(width * height * SEED_DENSITY))
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  for (let s = 0; s < seedCount; s++) {
    let col = Math.floor(Math.random() * cols)
    let row = Math.floor(Math.random() * rows)
    let dir = dirs[Math.floor(Math.random() * dirs.length)]
    const steps = 3 + Math.floor(Math.random() * 9)

    for (let i = 0; i < steps; i++) {
      if (Math.random() > 0.72) dir = dirs[Math.floor(Math.random() * dirs.length)]
      const nc = col + dir[0]
      const nr = row + dir[1]
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) break
      addEdge(col, row, nc, nr)
      col = nc
      row = nr
      if (Math.random() < 0.08) break
    }
  }

  return { edges, adjacency }
}

export default function CircuitField() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const networkRef = useRef<{ edges: Edge[]; adjacency: Map<NodeKey, Edge[]> }>({ edges: [], adjacency: new Map() })
  const pulsesRef = useRef<Pulse[]>([])
  const mouseRef = useRef<Point | null>(null)
  const lastSpawnRef = useRef(0)
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      const rect = section!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.max(1, Math.round(rect.width * dpr))
      canvas!.height = Math.max(1, Math.round(rect.height * dpr))
      canvas!.style.width = `${rect.width}px`
      canvas!.style.height = `${rect.height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      networkRef.current = buildNetwork(rect.width, rect.height)
      pulsesRef.current = []
    }

    resize()
    window.addEventListener('resize', resize)

    // The overlay itself is pointer-events:none (so it never blocks clicks
    // on the real content above it), which also means it never receives
    // pointer events directly — track on window and clip to the section's
    // own bounds instead.
    function onPointerMove(e: PointerEvent) {
      const rect = section!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseRef.current = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height ? { x, y } : null
    }
    function onPointerLeaveWindow() {
      mouseRef.current = null
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerout', onPointerLeaveWindow)

    function nearestNode(p: Point): NodeKey | null {
      let best: NodeKey | null = null
      let bestDist = MOUSE_RADIUS
      for (const edge of networkRef.current.edges) {
        for (const [k, pt] of [
          [edge.a, edge.p1],
          [edge.b, edge.p2],
        ] as const) {
          const d = Math.hypot(pt.x - p.x, pt.y - p.y)
          if (d < bestDist) {
            bestDist = d
            best = k
          }
        }
      }
      return best
    }

    function spawnFrom(node: NodeKey, energy: number, cameFrom: NodeKey) {
      if (pulsesRef.current.length >= MAX_PULSES || energy < MIN_ENERGY) return
      const options = (networkRef.current.adjacency.get(node) ?? []).filter(
        (edge) => !(edge.a === cameFrom && edge.b === node) && !(edge.b === cameFrom && edge.a === node),
      )
      if (options.length === 0) return
      const pick = options[Math.floor(Math.random() * options.length)]
      pulsesRef.current.push({
        edge: pick,
        reverse: pick.b === node,
        t: 0,
        energy,
        cameFrom: node,
      })
    }

    function tick(now: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr
      ctx!.clearRect(0, 0, w, h)

      // Dormant trace network, always faintly visible.
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = `rgb(${TRACE_COLOR} / 7%)`
      ctx!.lineWidth = 1
      ctx!.beginPath()
      for (const edge of networkRef.current.edges) {
        ctx!.moveTo(edge.p1.x, edge.p1.y)
        ctx!.lineTo(edge.p2.x, edge.p2.y)
      }
      ctx!.stroke()

      if (!reducedMotionRef.current) {
        const mouse = mouseRef.current
        if (mouse && now - lastSpawnRef.current > SPAWN_COOLDOWN_MS) {
          const node = nearestNode(mouse)
          if (node) {
            lastSpawnRef.current = now
            spawnFrom(node, 1, node)
          }
        }

        const dt = 1 / 60
        const next: Pulse[] = []
        for (const pulse of pulsesRef.current) {
          const advance = (PULSE_SPEED * dt) / pulse.edge.length
          pulse.t += advance

          const { p1, p2 } = pulse.edge
          const fromP = pulse.reverse ? p2 : p1
          const toP = pulse.reverse ? p1 : p2
          const clampedT = Math.min(1, pulse.t)
          const x = fromP.x + (toP.x - fromP.x) * clampedT
          const y = fromP.y + (toP.y - fromP.y) * clampedT

          // Light up the trace behind the pulse head.
          ctx!.strokeStyle = `rgb(${TRACE_COLOR} / ${Math.round(pulse.energy * 55)}%)`
          ctx!.lineWidth = 1.5
          ctx!.beginPath()
          ctx!.moveTo(fromP.x, fromP.y)
          ctx!.lineTo(x, y)
          ctx!.stroke()

          const glow = ctx!.createRadialGradient(x, y, 0, x, y, 7)
          glow.addColorStop(0, `rgb(${TRACE_COLOR} / ${Math.round(pulse.energy * 90)}%)`)
          glow.addColorStop(1, `rgb(${TRACE_COLOR} / 0%)`)
          ctx!.fillStyle = glow
          ctx!.beginPath()
          ctx!.arc(x, y, 7, 0, Math.PI * 2)
          ctx!.fill()

          if (pulse.t < 1) {
            next.push(pulse)
          } else {
            const arrivedNode = pulse.reverse ? pulse.edge.a : pulse.edge.b
            spawnFrom(arrivedNode, pulse.energy * BRANCH_DECAY, pulse.cameFrom)
            // Occasionally branch twice at a junction for a livelier spread.
            if (Math.random() < 0.3) spawnFrom(arrivedNode, pulse.energy * BRANCH_DECAY, pulse.cameFrom)
          }
        }
        pulsesRef.current = next
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerLeaveWindow)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
