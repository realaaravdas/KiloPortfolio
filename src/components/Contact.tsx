import { Mail } from 'lucide-react'
import { profile } from '../data/resume'
import GithubIcon from './icons/GithubIcon'
import CtaLink from './CtaLink'
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-grid border-t border-border">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <Reveal as="div" className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="font-mono text-sm text-accent tracking-wide">06 / Contact</span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">
          Let's build something.
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted leading-relaxed">
          Open to internships and software / robotics roles. Reach out — I usually reply within a day.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <CtaLink href={`mailto:${profile.email}`} icon={Mail} solid>
            {profile.email}
          </CtaLink>
          <CtaLink href={profile.github} icon={GithubIcon}>
            {profile.githubHandle}
          </CtaLink>
        </div>
      </Reveal>

      <footer className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-muted">
          <p>© {new Date().getFullYear()} Aarav Das. Built with React, TypeScript & Tailwind.</p>
          <p className="flex items-center gap-3">
            <span>{profile.location}</span>
            <span className="text-border">·</span>
            <span>
              For AI agents:{' '}
              <a href="/llms.txt" className="text-accent hover:underline">
                llms.txt
              </a>
            </span>
          </p>
        </div>
      </footer>
    </section>
  )
}
