import { activities, experience, sectionStats } from '../data/resume'
import Section, { SubHead, Tag } from './Section'
import frcWin from '../assets/photos/frc-win.jpg'
import frcDriving from '../assets/photos/frc-driving.jpg'
import frcRobot from '../assets/photos/frc-robot.jpg'

const photos = [
  { src: frcWin, alt: 'Team 2367 celebrating 1st place at the 2026 Central Valley Regional', cap: 'CVR 2026 — 1st place' },
  { src: frcDriving, alt: 'Operating the driver station during a match', cap: 'Driver station' },
  { src: frcRobot, alt: 'Robot 2367 on the field with its vision camera mounted', cap: 'Robot 2367 — vision mount' },
]

export default function Experience() {
  return (
    <Section
      id="experience"
      index="03"
      code="EXPERIENCE"
      title="Field & flight record"
      kicker="Industry software and four seasons of competition robotics."
      side="right"
      stats={sectionStats.experience}
      wide
    >
      <ol className="relative space-y-8 border-l border-border-strong pl-6">
        {experience.map((job, i) => (
          <li key={job.role + job.org} className="relative">
            <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 border border-accent bg-black" />
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  LOG.{String(i + 1).padStart(2, '0')} · {job.org}
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{job.role}</h3>
              </div>
              <p className="font-mono text-xs text-muted sm:text-right">
                {job.period}
                <br />
                <span className="text-dim">{job.location}</span>
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {job.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-px w-3 shrink-0 bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>

            {job.org.startsWith('FRC') && (
              <div className="mt-5 grid grid-cols-3 gap-2">
                {photos.map((p, k) => (
                  <figure key={p.src} data-cursor-hover className="group relative overflow-hidden border border-border">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-1.5 pt-6 font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-muted sm:text-[10px]">
                      FIG.{k + 1} {p.cap}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-9">
        <SubHead>Activities</SubHead>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {activities.map((a) => (
            <li key={a.name} className="bg-black/80 p-4">
              <p className="text-sm font-medium text-ink">{a.name}</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">{a.period}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{a.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
