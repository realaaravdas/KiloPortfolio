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

const ACTIVE_SIZE = 28
const SMALL_SIZE = 13
const DOCK_SIZE = 19
const ROW_STEP = 36
const TOP_ANCHOR = 92
const DOCK_LETTER_GAP = 1.1

// Transition timing: letters fire off STAGGER_MS apart and each takes DURATION_MS
// to settle, so a word reads as a visible, sequential cascade rather than one
// rigid block snapping into place.
const STAGGER_MS = 28
const DURATION_MS = 620

const FONT_FAMILY = '"Inter", system-ui, sans-serif'
const FONT_WEIGHT = 800

const font = (size: number) => `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`

function easeOutCubic(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return 1 - Math.pow(1 - c, 3)
}

type Target = { x: number; y: number; rotate: number; scale: number; fontSize: number; bright: number }

type Letter = {
  char: string
  sectionIndex: number
  indexInWord: number
  from: Target
  to: Target
  current: Target
  animStart: number
  delay: number
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
  const firstLayoutRef = useRef(true)

  const letters = useMemo(() => {
    const list: Letter[] = []
    sections.forEach((s, si) => {
      Array.from(s.label).forEach((ch, li) => {
        list.push({
          char: ch,
          sectionIndex: si,
          indexInWord: li,
          from: zeroTarget(),
          to: zeroTarget(),
          current: zeroTarget(),
          animStart: 0,
          delay: 0,
          el: null,
        })
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

    function computeLayout() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const railRight = vw - 96
      const dockX = vw - 112
      const dockY = vh * 0.68
      const futureStartY = vh * 0.84
      const now = performance.now()
      const instant = firstLayoutRef.current || reducedMotionRef.current

      sections.forEach((s, si) => {
        const role: 'active' | 'passed' | 'next' | 'future' =
          si === activeIndex ? 'active' : si < activeIndex ? 'passed' : si === activeIndex + 1 ? 'next' : 'future'
        const wordLetters = letters.filter((l) => l.sectionIndex === si)

        let positions: { x: number; y: number; rotate: number; scale: number; fontSize: number; bright: number }[]

        if (role === 'active' || role === 'passed') {
          const size = role === 'active' ? ACTIVE_SIZE : SMALL_SIZE
          const widths = measureWidths(s.label, font(size))
          const total = widths.reduce((a, b) => a + b, 0)
          const y = TOP_ANCHOR + si * ROW_STEP
          let cum = 0
          positions = widths.map((w) => {
            const x = railRight - total + cum + w / 2
            cum += w
            return { x, y, rotate: 0, scale: 1, fontSize: size, bright: role === 'active' ? 1 : 0 }
          })
        } else if (role === 'next') {
          const widths = measureWidths(s.label, font(DOCK_SIZE))
          const advances = widths.map((w) => w * DOCK_LETTER_GAP)
          const total = advances.reduce((a, b) => a + b, 0)
          let cum = 0
          positions = advances.map((adv) => {
            const y = dockY + total / 2 - cum - adv / 2
            cum += adv
            return { x: dockX, y, rotate: -90, scale: 1, fontSize: DOCK_SIZE, bright: 0 }
          })
        } else {
          const widths = measureWidths(s.label, font(SMALL_SIZE))
          const total = widths.reduce((a, b) => a + b, 0)
          const y = futureStartY + (si - activeIndex - 2) * ROW_STEP
          let cum = 0
          positions = widths.map((w) => {
            const x = railRight - total + cum + w / 2
            cum += w
            return { x, y, rotate: 0, scale: 1, fontSize: SMALL_SIZE, bright: 0 }
          })
        }

        wordLetters.forEach((l, i) => {
          const nextTarget = positions[i]
          l.from = instant ? nextTarget : { ...l.current }
          l.to = nextTarget
          l.animStart = now
          l.delay = instant ? 0 : l.indexInWord * STAGGER_MS
          if (instant) l.current = { ...nextTarget }
        })
      })

      firstLayoutRef.current = false
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(computeLayout)
    }
    computeLayout()

    window.addEventListener('resize', computeLayout)
    return () => window.removeEventListener('resize', computeLayout)
  }, [activeIndex, letters])

  useEffect(() => {
    function tick(now: number) {
      for (const l of letters) {
        if (!l.el) continue
        const elapsed = now - l.animStart - l.delay
        const duration = reducedMotionRef.current ? 0 : DURATION_MS
        const progress = duration <= 0 ? 1 : easeOutCubic(elapsed / duration)
        const clamped = Math.max(0, Math.min(1, elapsed < 0 ? 0 : progress))

        const c = l.current
        c.x = l.from.x + (l.to.x - l.from.x) * clamped
        c.y = l.from.y + (l.to.y - l.from.y) * clamped
        c.rotate = l.from.rotate + (l.to.rotate - l.from.rotate) * clamped
        c.scale = l.from.scale + (l.to.scale - l.from.scale) * clamped
        c.fontSize = l.from.fontSize + (l.to.fontSize - l.from.fontSize) * clamped
        c.bright = l.from.bright + (l.to.bright - l.from.bright) * clamped

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
          className="absolute left-0 top-0 whitespace-pre font-extrabold uppercase tracking-wide"
          style={{ fontFamily: FONT_FAMILY }}
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
