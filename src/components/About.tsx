import { ArrowUpRight } from 'lucide-react'
import { education, languages, profile, publication, sectionStats } from '../data/resume'
import Section, { SubHead } from './Section'

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      code="ABOUT"
      title="Systems that see, decide, move."
      kicker={profile.summary}
      side="right"
      stats={sectionStats.about}
    >
      <SubHead right="03 records">Education</SubHead>
      <ul className="divide-y divide-border border-y border-border">
        {education.map((e) => (
          <li key={e.school} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-medium text-ink">{e.school}</p>
              <p className="text-sm text-muted">{e.detail}</p>
              {e.bullets?.map((b) => (
                <p key={b} className="mt-1 text-xs leading-relaxed text-dim">
                  {b}
                </p>
              ))}
            </div>
            <p className="font-mono text-xs text-muted sm:text-right">
              {e.period}
              <br />
              <span className="text-dim">{e.location}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <SubHead>Publication</SubHead>
        <a
          href={publication.url}
          target="_blank"
          rel="noreferrer"
          className="lift-on-hover group block border border-border p-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {publication.publisher} · {publication.date}
          </p>
          <p className="mt-2 flex items-start justify-between gap-4 text-sm font-medium leading-snug text-ink">
            {publication.title}
            <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-accent" />
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{publication.abstract}</p>
        </a>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
        <span className="text-muted">Spoken —</span> {languages}
      </p>
    </Section>
  )
}
