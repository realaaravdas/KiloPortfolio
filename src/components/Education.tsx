import { FileText, GraduationCap } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { education, publication, activities } from '../data/resume'

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="05 / Education" title="Education & beyond the resume" />

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {education.map((e) => (
            <div key={e.school} className="rounded-lg border border-border bg-surface p-6">
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 shrink-0 text-accent" size={20} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display font-semibold text-ink">{e.school}</h3>
                    <span className="font-mono text-xs text-muted">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-accent">{e.detail}</p>
                  {e.bullets && (
                    <ul className="mt-3 space-y-1.5">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-muted leading-relaxed">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}

          <a
            href={publication.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-border bg-surface p-6 hover:border-accent/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <FileText className="mt-1 shrink-0 text-accent" size={20} />
              <div>
                <h3 className="font-display font-semibold text-ink">{publication.title}</h3>
                <p className="mt-1 font-mono text-xs text-muted">
                  {publication.publisher} · {publication.date}
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">{publication.abstract}</p>
                <span className="mt-3 inline-block text-sm text-accent hover:underline">Read the paper →</span>
              </div>
            </div>
          </a>
        </div>

        <div>
          <h3 className="font-mono text-sm text-accent mb-4">Also involved in</h3>
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.name} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-medium text-ink">{a.name}</h4>
                  <span className="font-mono text-xs text-muted">{a.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
