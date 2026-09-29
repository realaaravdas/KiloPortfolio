import { motion } from 'framer-motion'
import type { Stat } from '../data/resume'

/** Four "data panel" cards: mono label + value, hairline border, staggered reveal. */
export default function StatGrid({ stats, prefix }: { stats: Stat[]; prefix: string }) {
  return (
    <motion.dl
      className="grid grid-cols-2 gap-px border border-border bg-border"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ staggerChildren: 0.08 }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="group relative bg-black/80 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
        >
          <span className="absolute right-3 top-3 font-mono text-[10px] text-dim">
            {prefix}.{i + 1}
          </span>
          <dt className="label pr-8">{s.label}</dt>
          <dd className="mt-3 font-mono text-lg font-medium leading-tight text-ink sm:text-xl">{s.value}</dd>
          <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
        </motion.div>
      ))}
    </motion.dl>
  )
}
