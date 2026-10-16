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

// Where (as a fraction of viewport height, from the top) a section is
// considered "arrived". Scroll position is mapped onto a continuous
// activePos float against this line, so every letter's transform is a
// pure function of scrollY — no timers, no easing after the scroll stops.
const ACTIVATION_FRACTION = 0.25

// Within each one-unit scroll segment, letters start their move this
// fraction of the way apart, so a word cascades letter-by-letter instead
// of moving as one rigid block, while still finishing exactly in sync
// with the scroll (nothing is time-based).
const STAGGER_SPAN = 0.4

const FONT_FAMILY = '"Inter", system-ui, sans-serif'
const FONT_WEIGHT = 800

const font = (size: number) => `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`

function easeOutCubic(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return 1 - Math.pow(1 - c, 3)
}

type Letter = {
  char: string
  sectionIndex: number
  indexInWord: number
  wordLength: number
  el: HTMLSpanElement | null
}

type SectionLayout = {
  activeX: number[]
  activeY: number
  smallX: number[]
  smallY: number
  dockX: number
  dockY: number[]
}

let measureCanvas: HTMLCanvasElement | null = null
function measureWidths(text: string, fontSpec: string): number[] {
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return Array.from(text).map(() => 0)
  ctx.font = fontSpec
  return Array.from(text).map((ch) => ctx.measureText(ch).width)
}

async function ensureFontsLoaded() {
  if (!document.fonts) return
  const specs = [font(ACTIVE_SIZE), font(SMALL_SIZE), font(DOCK_SIZE)]
  try {
    await Promise.all(specs.map((spec) => document.fonts.load(spec)))
    await document.fonts.ready
  } catch {
    // Fall back to whatever metrics are available; layout still runs.
  }
}

export default function ScrollRail() {
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const layoutsRef = useRef<SectionLayout[]>([])
  const boundariesRef = useRef<number[]>([])
  const futureStartYRef = useRef(0)

  const letters = useMemo(() => {
    const list: Letter[] = []
    sections.forEach((s, si) => {
      const chars = Array.from(s.label)
      chars.forEach((ch, li) => {
        list.push({ char: ch, sectionIndex: si, indexInWord: li, wordLength: chars.length, el: null })
      })
    })
    return list
  }, [])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function buildLayouts() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const railRight = vw - 96
      const dockX = vw - 112
      const dockY = vh * 0.68
      futureStartYRef.current = vh * 0.84

      layoutsRef.current = sections.map((s, si) => {
        const activeWidths = measureWidths(s.label, font(ACTIVE_SIZE))
        const activeTotal = activeWidths.reduce((a, b) => a + b, 0)
        let cum = 0
        const activeX = activeWidths.map((w) => {
          const x = railRight - activeTotal + cum + w / 2
          cum += w
          return x
        })

        const smallWidths = measureWidths(s.label, font(SMALL_SIZE))
        const smallTotal = smallWidths.reduce((a, b) => a + b, 0)
        cum = 0
        const smallX = smallWidths.map((w) => {
          const x = railRight - smallTotal + cum + w / 2
          cum += w
          return x
        })

        const dockAdvances = measureWidths(s.label, font(DOCK_SIZE)).map((w) => w * DOCK_LETTER_GAP)
        const dockTotal = dockAdvances.reduce((a, b) => a + b, 0)
        cum = 0
        const dockYs = dockAdvances.map((adv) => {
          const y = dockY + dockTotal / 2 - cum - adv / 2
          cum += adv
          return y
        })

        return {
          activeX,
          activeY: TOP_ANCHOR + si * ROW_STEP,
          smallX,
          smallY: TOP_ANCHOR + si * ROW_STEP,
          dockX,
          dockY: dockYs,
        }
      })
    }

    function buildBoundaries() {
      const vh = window.innerHeight
      const raw = sections.map((s) => {
        const el = document.getElementById(s.id)
        if (!el) return 0
        const top = el.getBoundingClientRect().top + window.scrollY
        return top - vh * ACTIVATION_FRACTION
      })
      let prev = 0
      boundariesRef.current = raw.map((v, i) => {
        const b = i === 0 ? Math.max(0, v) : Math.max(prev + 1, v)
        prev = b
        return b
      })
    }

    function recompute() {
      buildLayouts()
      buildBoundaries()
    }

    recompute()
    ensureFontsLoaded().then(recompute)

    window.addEventListener('resize', recompute)
    window.addEventListener('load', recompute)
    const settleTimer = window.setTimeout(recompute, 600)

    return () => {
      window.removeEventListener('resize', recompute)
      window.removeEventListener('load', recompute)
      window.clearTimeout(settleTimer)
    }
  }, [])

  useEffect(() => {
    function computeActivePos(): number {
      const boundaries = boundariesRef.current
      if (boundaries.length === 0) return 0
      const y = window.scrollY
      if (y <= boundaries[0]) return 0
      for (let i = 0; i < boundaries.length - 1; i++) {
        const a = boundaries[i]
        const b = boundaries[i + 1]
        if (y < b) {
          const span = b - a
          const t = span > 0 ? (y - a) / span : 1
          return i + Math.min(1, Math.max(0, t))
        }
      }
      return boundaries.length - 1
    }

    function tick() {
      const activePos = computeActivePos()
      const layouts = layoutsRef.current
      const reduced = reducedMotionRef.current

      for (const l of letters) {
        if (!l.el) continue
        const layout = layouts[l.sectionIndex]
        if (!layout) continue

        const rp = activePos - l.sectionIndex
        const i = l.indexInWord
        const N = l.wordLength
        const letterStart = N > 1 ? (i / (N - 1)) * STAGGER_SPAN : 0
        const letterDuration = 1 - STAGGER_SPAN

        let x: number, y: number, rotate: number, fontSize: number, bright: number

        if (rp >= 1) {
          x = layout.smallX[i]
          y = layout.smallY
          rotate = 0
          fontSize = SMALL_SIZE
          bright = 0
        } else if (rp <= -2) {
          x = layout.smallX[i]
          y = futureStartYRef.current + (-rp - 2) * ROW_STEP
          rotate = 0
          fontSize = SMALL_SIZE
          bright = 0
        } else {
          let segT: number
          let fromX: number, fromY: number, fromRotate: number, fromSize: number, fromBright: number
          let toX: number, toY: number, toRotate: number, toSize: number, toBright: number

          if (rp < -1) {
            segT = rp + 2
            fromX = layout.smallX[i]
            fromY = futureStartYRef.current
            fromRotate = 0
            fromSize = SMALL_SIZE
            fromBright = 0
            toX = layout.dockX
            toY = layout.dockY[i]
            toRotate = -90
            toSize = DOCK_SIZE
            toBright = 0
          } else if (rp < 0) {
            segT = rp + 1
            fromX = layout.dockX
            fromY = layout.dockY[i]
            fromRotate = -90
            fromSize = DOCK_SIZE
            fromBright = 0
            toX = layout.activeX[i]
            toY = layout.activeY
            toRotate = 0
            toSize = ACTIVE_SIZE
            toBright = 1
          } else {
            segT = rp
            fromX = layout.activeX[i]
            fromY = layout.activeY
            fromRotate = 0
            fromSize = ACTIVE_SIZE
            fromBright = 1
            toX = layout.smallX[i]
            toY = layout.smallY
            toRotate = 0
            toSize = SMALL_SIZE
            toBright = 0
          }

          const letterT = letterDuration > 0 ? Math.min(1, Math.max(0, (segT - letterStart) / letterDuration)) : segT
          const eased = easeOutCubic(letterT)

          x = fromX + (toX - fromX) * eased
          y = fromY + (toY - fromY) * eased
          rotate = reduced ? 0 : fromRotate + (toRotate - fromRotate) * eased
          fontSize = fromSize + (toSize - fromSize) * eased
          bright = fromBright + (toBright - fromBright) * eased
        }

        l.el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`
        l.el.style.fontSize = `${fontSize}px`
        l.el.style.color = `color-mix(in srgb, var(--color-ink) ${Math.round(bright * 100)}%, var(--color-muted))`
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
          className="absolute left-0 top-0 whitespace-pre font-extrabold uppercase"
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

type Tick = { id: string; label: string; percent: number }

function ProgressRuler() {
  const [progress, setProgress] = useState(0)
  const [ticks, setTicks] = useState<Tick[]>([])

  useEffect(() => {
    function docHeight() {
      return document.documentElement.scrollHeight - window.innerHeight
    }

    function onScroll() {
      const dh = docHeight()
      setProgress(dh > 0 ? Math.min(100, Math.max(0, (window.scrollY / dh) * 100)) : 0)
    }

    function computeTicks() {
      const dh = docHeight()
      if (dh <= 0) return
      const next: Tick[] = []
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY
        next.push({ id: s.id, label: s.label, percent: Math.min(100, Math.max(0, (top / dh) * 100)) })
      })
      setTicks(next)
    }

    onScroll()
    computeTicks()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', computeTicks)
    window.addEventListener('load', computeTicks)
    const settleTimer = window.setTimeout(computeTicks, 600)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeTicks)
      window.removeEventListener('load', computeTicks)
      window.clearTimeout(settleTimer)
    }
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

      {ticks.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          aria-label={`Jump to ${t.label}`}
          className="group pointer-events-auto absolute left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
          style={{ top: `${t.percent}%` }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-border transition-all duration-150 group-hover:scale-150 group-hover:bg-accent" />
        </button>
      ))}
    </div>
  )
}
