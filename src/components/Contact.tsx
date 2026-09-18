import { Mail } from 'lucide-react'
import { profile } from '../data/resume'
import GithubIcon from './icons/GithubIcon'

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-grid border-t border-border">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="font-mono text-sm text-accent tracking-wide">06 / Contact</span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">
          Let's build something.
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted leading-relaxed">
          Open to internships and software / robotics roles. Reach out — I usually reply within a day.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-sm font-medium text-bg hover:brightness-110 transition"
          >
            <Mail size={16} />
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-mono text-sm text-ink hover:border-accent hover:text-accent transition"
          >
            <GithubIcon size={16} />
            {profile.githubHandle}
          </a>
        </div>
      </div>

      <footer className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-muted">
          <p>© {new Date().getFullYear()} Aarav Das. Built with React, TypeScript & Tailwind.</p>
          <p>{profile.location}</p>
        </div>
      </footer>
    </section>
  )
}
