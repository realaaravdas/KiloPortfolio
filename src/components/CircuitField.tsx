import { useEffect, useRef } from 'react'

// A handful of decorative traces wander through the hero section, mostly
// dormant. Wherever the cursor passes near one, it bulges and glows toward
// the cursor — the trace doesn't move to the cursor, it leans toward it —
// then eases back to its resting shape once the cursor moves away.
const PATH_COUNT = 4
const SAMPLES_PER_SEGMENT = 18
const INFLUENCE_RADIUS = 260
const MAX_BULGE = 70
const SPRING_RATE = 9 // higher = snappier response to the cursor

const TRACE_COLOR = '56 240 216' // matches --color-accent, as an r g b triplet

type Vec = { x: number; y: number }

type TracePoint = {
  base: Vec
  disp: Vec // current eased displacement
  glow: number
}

type Trace = { points: TracePoint[] }

function catmullRom(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  }
}

function buildTraces(width: number, height: number): Trace[] {
  const traces: Trace[] = []

  for (let i = 0; i < PATH_COUNT; i++) {
    const controlCount = 4 + Math.floor(Math.random() * 2)
    const controls: Vec[] = []
    for (let c = 0; c < controlCount; c++) {
      controls.push({
        x: width * (0.05 + Math.random() * 0.75),
        y: (height * (c + Math.random() * 0.6)) / (controlCount - 1 || 1),
      })
    }

    const padded = [controls[0], ...controls, controls[controls.length - 1]]
    const basePoints: Vec[] = []
    for (let s = 0; s < padded.length - 3; s++) {
      for (let j = 0; j < SAMPLES_PER_SEGMENT; j++) {
        basePoints.push(catmullRom(padded[s], padded[s + 1], padded[s + 2], padded[s + 3], j / SAMPLES_PER_SEGMENT))
      }
    }

    traces.push({
      points: basePoints.map((base) => ({ base, disp: { x: 0, y: 0 }, glow: 0 })),
    })
  }

  return traces
}

export default function CircuitField() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const tracesRef = useRef<Trace[]>([])
  const mouseRef = useRef<Vec | null>(null)
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)
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
      tracesRef.current = buildTraces(rect.width, rect.height)
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

    function tick(now: number) {
      const dt = lastTimeRef.current ? Math.min(0.05, (now - lastTimeRef.current) / 1000) : 0
      lastTimeRef.current = now

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas!.width / dpr
      const h = canvas!.height / dpr
      ctx!.clearRect(0, 0, w, h)
      ctx!.lineCap = 'round'
      ctx!.lineJoin = 'round'

      const mouse = reducedMotionRef.current ? null : mouseRef.current
      const springT = 1 - Math.exp(-SPRING_RATE * dt)

      for (const trace of tracesRef.current) {
        const pts = trace.points

        for (const p of pts) {
          let targetX = 0
          let targetY = 0
          let targetGlow = 0
          if (mouse) {
            const dx = mouse.x - p.base.x
            const dy = mouse.y - p.base.y
            const dist = Math.hypot(dx, dy)
            if (dist < INFLUENCE_RADIUS) {
              const falloff = Math.pow(1 - dist / INFLUENCE_RADIUS, 2)
              const pull = Math.min(1, dist > 0 ? (MAX_BULGE * falloff) / dist : 0)
              targetX = dx * pull
              targetY = dy * pull
              targetGlow = falloff
            }
          }
          p.disp.x += (targetX - p.disp.x) * springT
          p.disp.y += (targetY - p.disp.y) * springT
          p.glow += (targetGlow - p.glow) * springT
        }

        // Dormant base line, always faintly present.
        ctx!.strokeStyle = `rgb(${TRACE_COLOR} / 7%)`
        ctx!.lineWidth = 1
        ctx!.beginPath()
        pts.forEach((p, i) => {
          const x = p.base.x + p.disp.x
          const y = p.base.y + p.disp.y
          if (i === 0) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        })
        ctx!.stroke()

        // Glowing overlay only where the trace is currently bulging.
        ctx!.shadowColor = `rgb(${TRACE_COLOR} / 70%)`
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i]
          const b = pts[i + 1]
          const glow = (a.glow + b.glow) / 2
          if (glow < 0.04) continue
          ctx!.shadowBlur = 8 * glow
          ctx!.strokeStyle = `rgb(${TRACE_COLOR} / ${Math.round(Math.min(1, glow) * 85)}%)`
          ctx!.lineWidth = 1 + glow
          ctx!.beginPath()
          ctx!.moveTo(a.base.x + a.disp.x, a.base.y + a.disp.y)
          ctx!.lineTo(b.base.x + b.disp.x, b.base.y + b.disp.y)
          ctx!.stroke()
        }
        ctx!.shadowBlur = 0
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
