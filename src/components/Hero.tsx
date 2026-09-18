import { ArrowDown, Mail } from 'lucide-react'
import { profile, stats } from '../data/resume'
import GithubIcon from './icons/GithubIcon'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <p className="font-mono text-sm text-accent mb-5">
          $ whoami <span className="text-muted">— robotics + software</span>
        </p>

        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] text-ink text-glow max-w-3xl">
          {profile.name}
        </h1>
        <p className="mt-4 font-display text-xl sm:text-2xl text-accent">{profile.role}</p>

        <p className="mt-6 max-w-2xl text-muted text-base sm:text-lg leading-relaxed">
          {profile.summary}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-sm font-medium text-bg hover:brightness-110 transition"
          >
            View my work
            <ArrowDown size={16} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm text-ink hover:border-accent hover:text-accent transition"
          >
            <Mail size={16} />
            Get in touch
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm text-ink hover:border-accent hover:text-accent transition"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
        </div>

        <dl className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-mono text-xs uppercase tracking-wider text-muted">{s.label}</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
