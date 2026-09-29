import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Rotating HUD rings behind a section. Each ring spins continuously; the whole
 * assembly is additionally rotated and scaled by the section's scroll progress.
 */
export default function HudRings({ className = '', size = 640 }: { className?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-70, 110])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.9])

  const spin = (dur: number, dir: 1 | -1) =>
    reduce ? undefined : { rotate: 360 * dir, transition: { duration: dur, ease: 'linear' as const, repeat: Infinity } }

  return (
    <div ref={ref} className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <motion.svg viewBox="0 0 200 200" width="100%" height="100%" style={{ rotate, scale }} fill="none" className="text-white">
        <motion.g style={{ originX: '100px', originY: '100px' }} animate={spin(120, 1)}>
          <circle cx="100" cy="100" r="98" stroke="currentColor" strokeOpacity=".22" strokeWidth=".4" strokeDasharray="1 3.2" />
          {Array.from({ length: 72 }, (_, i) => (
            <line key={i} x1="100" y1="2" x2="100" y2={i % 6 === 0 ? 8 : 5} stroke="currentColor" strokeOpacity={i % 6 === 0 ? 0.6 : 0.25} strokeWidth=".4" transform={`rotate(${i * 5} 100 100)`} />
          ))}
        </motion.g>
        <motion.g style={{ originX: '100px', originY: '100px' }} animate={spin(70, -1)}>
          <circle cx="100" cy="100" r="82" stroke="var(--color-accent)" strokeOpacity=".5" strokeWidth=".5" strokeDasharray="38 12 4 12" />
        </motion.g>
        <motion.g style={{ originX: '100px', originY: '100px' }} animate={spin(45, 1)}>
          <circle cx="100" cy="100" r="66" stroke="currentColor" strokeOpacity=".3" strokeWidth=".4" />
          <path d="M100 34a66 66 0 0 1 57 33" stroke="currentColor" strokeOpacity=".8" strokeWidth=".9" />
          <path d="M100 166a66 66 0 0 1-57-33" stroke="currentColor" strokeOpacity=".8" strokeWidth=".9" />
        </motion.g>
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeOpacity=".12" strokeWidth=".4" strokeDasharray="2 2" />
        <path d="M100 92v16M92 100h16" stroke="currentColor" strokeOpacity=".4" strokeWidth=".4" />
      </motion.svg>
    </div>
  )
}
