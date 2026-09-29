import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'

type Props = { progress: number; done: boolean }

export default function Preloader({ progress, done }: Props) {
  const pct = Math.round(progress * 100)
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="relative flex flex-col items-center gap-6">
            <Logo size={44} />
            <div className="w-64 sm:w-80">
              <div className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <span>Initializing model</span>
                <span className="tabular-nums text-ink">{String(pct).padStart(3, '0')}%</span>
              </div>
              <div className="h-px w-full bg-border-strong">
                <motion.div className="h-px bg-accent" animate={{ width: `${pct}%` }} transition={{ ease: 'easeOut', duration: 0.3 }} />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Aarav Das · Robotics / AI</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
