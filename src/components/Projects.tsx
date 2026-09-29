import { motion } from 'framer-motion'
import { projects, sectionStats } from '../data/resume'
import Section, { Tag } from './Section'

export default function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      code="FEATURED PROJECTS"
      title="Selected builds"
      kicker="Robots, simulation, and tooling — built end to end, from the sensor to the deployment."
      side="left"
      stats={sectionStats.projects}
      wide
    >
      <div className="space-y-4">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            data-cursor-hover
            className="lift-on-hover group relative border border-border bg-black/40 p-5 sm:p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent transition-transform duration-500 group-hover:scale-y-100" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">PRJ-{String(i + 1).padStart(2, '0')}</p>
              <p className="font-mono text-xs text-muted">{p.period}</p>
            </div>
            <h3 className="font-head mt-2 text-3xl text-ink sm:text-4xl">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
            <ul className="mt-4 space-y-1.5">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[13px] leading-relaxed text-muted/90">
                  <span className="mt-2 h-px w-3 shrink-0 bg-border-strong" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
