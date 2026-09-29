import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import HudRings from './HudRings'
import StatGrid from './StatGrid'
import type { Stat } from '../data/resume'

type Props = {
  id: string
  index: string // "01"
  code: string // "ABOUT"
  title: string
  kicker?: string
  /** Which side the text sits on; the 3D model takes the other side on desktop. */
  side: 'left' | 'right'
  stats: Stat[]
  wide?: boolean
  children?: ReactNode
}

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
}

/** Scroll-triggered section shell: HUD rings, header, 4 data panels, then content. */
export default function Section({ id, index, code, title, kicker, side, stats, wide, children }: Props) {
  const span = wide ? 'lg:col-span-7' : 'lg:col-span-6'
  const place = side === 'left' ? 'lg:col-start-1' : wide ? 'lg:col-start-6' : 'lg:col-start-7'

  return (
    <section id={id} className="relative flex min-h-screen items-center py-28">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:px-14">
        <div className={`relative ${span} ${place}`}>
          <HudRings size={640} className={`-top-24 hidden opacity-60 sm:block ${side === 'left' ? '-left-40' : '-right-40'}`} />

          <div className="pointer-events-auto relative rounded-sm border border-border bg-black/60 p-5 backdrop-blur-md sm:p-8 lg:bg-black/45">
            <motion.header initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }} transition={{ staggerChildren: 0.1 }}>
              <motion.div variants={rise} className="flex items-center gap-3 font-mono text-xs text-muted">
                <span className="text-accent">SEC—{index}</span>
                <span className="h-px w-8 bg-border-strong" />
                <span className="tracking-[0.18em]">{code}</span>
              </motion.div>
              <motion.h2 variants={rise} className="font-head mt-4 text-[clamp(2.4rem,5.2vw,4.6rem)] [overflow-wrap:anywhere] text-ink">
                {title}
              </motion.h2>
              {kicker && (
                <motion.p variants={rise} className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                  {kicker}
                </motion.p>
              )}
            </motion.header>

            <div className="mt-7">
              <StatGrid stats={stats} prefix={index} />
            </div>

            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Small labelled sub-heading used inside panels. */
export function SubHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h3 className="label whitespace-nowrap text-ink/80">{children}</h3>
      <span className="h-px flex-1 bg-border" />
      {right && <span className="label whitespace-nowrap">{right}</span>}
    </div>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="border border-border px-2 py-1 font-mono text-[11px] leading-none text-muted">{children}</span>
}
