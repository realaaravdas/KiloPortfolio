import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useTransform } from 'framer-motion'
import { LAST_STAGE, STAGES, stage } from '../state/stage'

/** Segmented scroll indicator, bottom centre. Click a segment to jump to that section. */
export default function ScrollProgress() {
  const [active, setActive] = useState(0)
  const pct = useRef<HTMLSpanElement>(null)
  const fill = useTransform(stage, [0, LAST_STAGE], ['0%', '100%'])

  useMotionValueEvent(stage, 'change', (v) => {
    setActive(Math.round(v))
    if (pct.current) pct.current.textContent = String(Math.round((v / LAST_STAGE) * 100)).padStart(3, '0')
  })

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 border border-border bg-black/70 px-3 py-2 backdrop-blur-md sm:gap-4 sm:px-4">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:block">
          <span className="text-ink">{STAGES[active].label}</span>
        </span>
        <div className="relative flex items-center gap-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center">
            <motion.div className="h-px bg-accent" style={{ width: fill }} />
          </div>
          {STAGES.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-label={`Go to ${s.label}`}
              className="group relative flex h-6 w-7 items-center justify-center sm:w-9"
            >
              <span
                className={`block h-2.5 w-px transition-all duration-300 ${i === active ? 'h-4 bg-accent' : i < active ? 'bg-white/70' : 'bg-white/30'} group-hover:bg-white`}
              />
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-muted opacity-0 transition-opacity group-hover:opacity-100">
                {s.code}
              </span>
            </a>
          ))}
        </div>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.12em] text-muted">
          <span ref={pct}>000</span>%
        </span>
      </div>
    </div>
  )
}
