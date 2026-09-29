import { useState } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { profile } from '../data/resume'
import { STAGES, stage } from '../state/stage'
import Logo from './Logo'

const links = STAGES.slice(1)

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  useMotionValueEvent(stage, 'change', (v) => setActive(Math.round(v)))

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-black/55 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[100rem] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3 text-ink" aria-label="Aarav Das — home">
          <Logo />
          <span className="font-head hidden text-xl leading-none sm:block">
            Aarav Das
          </span>
          <span className="label hidden border-l border-border pl-3 lg:block">Robotics · AI</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:text-ink ${
                  active === i + 1 ? 'text-ink' : 'text-muted'
                }`}
              >
                <span className={active === i + 1 ? 'text-accent' : 'text-dim'}>{l.code}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Open to internships
          </span>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-1.5 border border-border-strong px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Resume <ArrowUpRight size={13} />
          </a>
        </div>

        <button className="text-ink md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border bg-black/95 px-5 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="flex gap-3 py-2.5 font-mono text-sm uppercase tracking-[0.12em] text-muted hover:text-ink">
              <span className="text-accent">{l.code}</span>
              {l.label}
            </a>
          ))}
          <a href={profile.resumeUrl} download className="mt-2 flex items-center gap-2 border-t border-border pt-4 font-mono text-sm uppercase tracking-[0.12em] text-ink">
            Download resume <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </header>
  )
}
