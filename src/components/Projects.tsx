import { Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { projects } from '../data/resume'

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="03 / Projects"
        title="Things I've built"
        description="A mix of robotics and full-stack software projects, built independently."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article
            key={p.title}
            className={`group relative flex flex-col rounded-lg border p-6 sm:p-7 transition-colors ${
              p.featured ? 'border-accent/40 bg-surface-2' : 'border-border bg-surface'
            } hover:border-accent/60`}
          >
            {p.featured && (
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent">
                <Sparkles size={12} />
                Flagship
              </span>
            )}

            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
            </div>
            <p className="mt-1 font-mono text-xs text-muted">{p.period}</p>

            <p className="mt-3 text-sm text-muted leading-relaxed">{p.description}</p>

            <ul className="mt-4 space-y-2">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-muted leading-relaxed">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 pt-1">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        More on my{' '}
        <a
          href="https://github.com/realaaravdas"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          GitHub
        </a>
        .
      </p>
    </section>
  )
}
