import { useEffect, useState } from 'react'
import { Mail, Menu, X } from 'lucide-react'
import { profile } from '../data/resume'
import GithubIcon from './icons/GithubIcon'
import LinkedinIcon from './icons/LinkedinIcon'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-bg/85 backdrop-blur border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
        <a href="#top" className="font-display font-semibold text-ink tracking-tight">
          Aarav<span className="text-accent">.</span>Das
        </a>

        <ul className="hidden md:flex items-center gap-8 font-mono text-sm text-muted">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-accent transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={20} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-muted hover:text-accent transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-4 flex flex-col gap-4 font-mono text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-muted hover:text-accent" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted hover:text-accent">
              <GithubIcon size={20} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-muted hover:text-accent">
              <LinkedinIcon size={20} />
            </a>
            <a href={`mailto:${profile.email}`} className="text-muted hover:text-accent">
              <Mail size={20} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
