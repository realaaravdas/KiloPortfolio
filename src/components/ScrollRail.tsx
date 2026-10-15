import { useEffect, useMemo, useRef, useState } from 'react'

const sections = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const ACTIVE_SIZE = 26
const SMALL_SIZE = 12
const DOCK_SIZE = 18
const ROW_STEP = 28
const TOP_ANCHOR = 88
const DOCK_LETTER_GAP = 1.08

const font = (size: number) => `600 ${size}px "Space Grotesk", "Inter", system-ui, sans-serif`

type Target = { x: number; y: number; rotate: number; scale: number; fontSize: number; bright: number }

type Letter = {
  char: string
  sectionIndex: number
  current: Target
  target: Target
  el: HTMLSpanElement | null
}

let measureCanvas: HTMLCanvasElement | null = null
function measureWidths(text: string, fontSpec: string): number[] {
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return Array.from(text).map(() => 0)
  ctx.font = fontSpec
  return Array.from(text).map((ch) => ctx.measureText(ch).width)
}

function zeroTarget(): Target {
  return { x: 0, y: 0, rotate: 0, scale: 1, fontSize: SMALL_SIZE, bright: 0 }
}

export default function ScrollRail() {
  const [activeIndex, setActiveIndex] = useState(0)
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(false)

  const letters = useMemo(() => {
    const list: Letter[] = []
    sections.forEach((s, si) => {
      Array.from(s.label).forEach((ch) => {
        list.push({ char: ch, sectionIndex: si, current: zeroTarget(), target: zeroTarget(), el: null })
      })
    })
    return list
  }, [])

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => e !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        const idx = sections.findIndex((s) => s.id === topMost.target.id)
        if (idx !== -1) setActiveIndex(idx)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function layout() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const railRight = vw - 96
      const dockX = vw - 112
      const dockY = vh * 0.68
      const futureStartY = vh * 0.84

      sections.forEach((s, si) => {
        const role: 'active' | 'passed' | 'next' | 'future' =
          si === activeIndex ? 'active' : si < activeIndex ? 'passed' : si === activeIndex + 1 ? 'next' : 'future'
        const wordLetters = letters.filter((l) => l.sectionIndex === si)

        if (role === 'active' || role === 'passed') {
          const size = role === 'active' ? ACTIVE_SIZE : SMALL_SIZE
          const widths = measureWidths(s.label, font(size))
          const total = widths.reduce((a, b) => a + b, 0)
          const y = TOP_ANCHOR + si * ROW_STEP
          let cum = 0
          wordLetters.forEach((l, i) => {
            const w = widths[i]
            l.target = {
              x: railRight - total + cum + w / 2,
              y,
              rotate: 0,
              scale: 1,
              fontSize: size,
              bright: role === 'active' ? 1 : 0,
            }
            cum += w
          })
        } else if (role === 'next') {
          const widths = measureWidths(s.label, font(DOCK_SIZE))
          const advances = widths.map((w) => w * DOCK_LETTER_GAP)
          const total = advances.reduce((a, b) => a + b, 0)
          let cum = 0
          wordLetters.forEach((l, i) => {
            const adv = advances[i]
            l.target = {
              x: dockX,
              y: dockY + total / 2 - cum - adv / 2,
              rotate: -90,
              scale: 1,
              fontSize: DOCK_SIZE,
              bright: 0,
            }
            cum += adv
          })
        } else {
          const widths = measureWidths(s.label, font(SMALL_SIZE))
          const total = widths.reduce((a, b) => a + b, 0)
          const y = futureStartY + (si - activeIndex - 2) * ROW_STEP
          let cum = 0
          wordLetters.forEach((l, i) => {
            const w = widths[i]
            l.target = { x: railRight - total + cum + w / 2, y, rotate: 0, scale: 1, fontSize: SMALL_SIZE, bright: 0 }
            cum += w
          })
        }
      })
    }

    layout()
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [activeIndex, letters])

  useEffect(() => {
    let last = performance.now()
    const damp = 0.78

    function tick(now: number) {
      const dt = now - last
      last = now
      const steps = (60 * dt) / 1000
      const lerp = reducedMotionRef.current ? 1 : 1 - Math.pow(damp, steps)

      for (const l of letters) {
        if (!l.el) continue
        const c = l.current
        const t = l.target
        c.x += (t.x - c.x) * lerp
        c.y += (t.y - c.y) * lerp
        c.rotate += (t.rotate - c.rotate) * lerp
        c.scale += (t.scale - c.scale) * lerp
        c.fontSize += (t.fontSize - c.fontSize) * lerp
        c.bright += (t.bright - c.bright) * lerp

        l.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%) rotate(${c.rotate}deg) scale(${c.scale})`
        l.el.style.fontSize = `${c.fontSize}px`
        l.el.style.color = `color-mix(in srgb, var(--color-ink) ${Math.round(c.bright * 100)}%, var(--color-muted))`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [letters])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden 2xl:block" aria-hidden="true">
      {letters.map((l, i) => (
        <span
          key={i}
          ref={(el) => {
            l.el = el
          }}
          className="font-display absolute left-0 top-0 whitespace-pre font-semibold uppercase tracking-wide"
        >
          {l.char}
        </span>
      ))}

      <ProgressRuler />

      <nav className="sr-only">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            Jump to {s.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

function ProgressRuler() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="absolute right-8 top-[15%] h-[70%] w-px"
      style={{
        backgroundImage:
          'repeating-linear-gradient(to bottom, var(--color-border) 0, var(--color-border) 1px, transparent 1px, transparent 12px)',
      }}
    >
      <div
        className="absolute left-0 top-0 w-px bg-accent transition-[height] duration-150 ease-out"
        style={{ height: `${progress}%` }}
      />
      <span
        className="absolute -right-9 -translate-y-1/2 font-mono text-[10px] text-accent transition-[top] duration-150 ease-out"
        style={{ top: `${progress}%` }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  )
}
