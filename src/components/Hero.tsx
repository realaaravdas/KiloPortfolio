import { ArrowDown, Mail } from 'lucide-react'
import { profile, stats } from '../data/resume'
import GithubIcon from './icons/GithubIcon'
import CtaLink from './CtaLink'
import Reveal from './Reveal'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <Reveal>
          <p className="font-mono text-sm text-accent mb-5">
            $ whoami <span className="text-muted">— robotics + software</span>
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-ink max-w-3xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-display text-xl sm:text-2xl text-accent">{profile.role}</p>

          <p className="mt-6 max-w-2xl text-muted text-base sm:text-lg leading-relaxed">
            {profile.summary}
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-4">
          <CtaLink href="#projects" icon={ArrowDown} solid>
            View my work
          </CtaLink>
          <CtaLink href={`mailto:${profile.email}`} icon={Mail}>
            Get in touch
          </CtaLink>
          <CtaLink href={profile.github} icon={GithubIcon}>
            GitHub
          </CtaLink>
        </Reveal>

        <Reveal
          delay={220}
          as="dl"
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
