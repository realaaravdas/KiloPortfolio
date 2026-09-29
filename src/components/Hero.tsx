import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowDownToLine } from 'lucide-react'
import { profile, stats } from '../data/resume'
import CtaLink from './CtaLink'

const line = {
  hidden: { opacity: 0, y: '60%' },
  show: { opacity: 1, y: '0%', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function Hero({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll()
  const fade = useTransform(scrollY, [0, 420], [1, 0])
  const lift = useTransform(scrollY, [0, 420], [0, -60])

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end pb-24 pt-24 sm:pb-28">
      <motion.div style={{ opacity: fade, y: lift }} className="pointer-events-auto relative z-10 mx-auto w-full max-w-[100rem] px-5 sm:px-8 lg:px-14">
        <motion.div initial="hidden" animate={ready ? 'show' : 'hidden'} transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}>
          <motion.p variants={line} className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted sm:text-xs">
            <span className="text-accent">● SYS.ONLINE</span>
            <span>Portfolio / 2026</span>
            <span className="hidden sm:inline">37.0°N 122.1°W</span>
          </motion.p>

          <h1 className="font-head text-[clamp(5rem,19vw,17rem)] text-ink">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={line} className="block">Aarav</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={line} className="block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)] sm:[-webkit-text-stroke:2px_rgba(255,255,255,0.9)]">
                Das
              </motion.span>
            </span>
          </h1>

          <motion.div variants={line} className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="font-mono text-sm uppercase tracking-[0.16em] text-ink sm:text-base">
                {profile.title}
                <span className="text-accent"> // </span>
                <span className="text-muted">{profile.focus}</span>
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                B.S. Robotics Engineering, UC Santa Cruz. Perception, SLAM, and control on embedded hardware, plus the cloud services around it.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CtaLink href="#about" icon={ArrowDown} solid>
                  Explore
                </CtaLink>
                <CtaLink href={profile.resumeUrl} icon={ArrowDownToLine}>
                  Download resume
                </CtaLink>
              </div>
            </div>

            <dl className="hidden grid-cols-4 gap-px self-end border border-border bg-border lg:col-span-6 lg:grid xl:col-span-5 xl:col-start-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-black/70 p-3 backdrop-blur-sm">
                  <dt className="label text-[10px] leading-snug">{s.label}</dt>
                  <dd className="mt-2 font-mono text-base text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
