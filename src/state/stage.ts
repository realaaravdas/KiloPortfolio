import { useEffect } from 'react'
import { motionValue } from 'framer-motion'

/** Ordered scroll stops. Index in this list == integer value of `stage`. */
export const STAGES = [
  { id: 'top', label: 'Init', code: 'HERO' },
  { id: 'about', label: 'About', code: '01' },
  { id: 'skills', label: 'Skills', code: '02' },
  { id: 'experience', label: 'Experience', code: '03' },
  { id: 'projects', label: 'Projects', code: '04' },
  { id: 'contact', label: 'Contact', code: '05' },
] as const

export const LAST_STAGE = STAGES.length - 1

/**
 * Continuous scroll position expressed in "stages": 0 = hero, 1 = about, …, 5 = contact.
 * Fractions mean "between two stops". Shared by the DOM HUD and the WebGL scene
 * (the Canvas is a separate React reconciler, so a module-level MotionValue is the
 * simplest bridge and avoids re-rendering on every scroll tick).
 */
export const stage = motionValue(0)

/** Where on the viewport (fraction of its height) a section "counts" as current. */
const FOCUS = 0.5

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
// Hold near the integer stops so each section rests in a stable camera/lighting state.
const hold = (t: number) => {
  const x = clamp01((t - 0.18) / 0.64)
  return x * x * (3 - 2 * x)
}

function compute() {
  const tops = STAGES.map(({ id }) => {
    const el = document.getElementById(id)
    return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
  })
  const line = window.scrollY + window.innerHeight * FOCUS
  // The hero's "top" is the focus line at scroll 0, so stage is exactly 0 until the user scrolls.
  tops[0] = window.innerHeight * FOCUS
  let i = 0
  for (let k = 0; k < tops.length; k++) if (line >= tops[k]) i = k
  if (i >= LAST_STAGE) return LAST_STAGE
  const span = tops[i + 1] - tops[i]
  if (!isFinite(span) || span <= 0) return i
  return i + hold((line - tops[i]) / span)
}

/** Mount once near the app root. */
export function useStageTracker() {
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      stage.set(compute())
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Section heights change as fonts/images load.
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [])
}
