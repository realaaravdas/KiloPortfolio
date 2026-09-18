import { MapPin } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { experience } from '../data/resume'
import frcWin from '../assets/photos/frc-win.jpg'
import frcDriving from '../assets/photos/frc-driving.jpg'
import frcRobot from '../assets/photos/frc-robot.jpg'

const jobPhotos: Record<string, { src: string; alt: string }[]> = {
  'FIRST Robotics Competition — Team 2367, Lancer Robotics': [
    { src: frcWin, alt: 'Team 2367 celebrating 1st place at the 2026 Central Valley District competition' },
    { src: frcDriving, alt: 'Operating the driver station during a match' },
    { src: frcRobot, alt: "Robot 2367 on the field with its vision camera mounted" },
  ],
}

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="02 / Experience"
        title="Where I've worked"
        description="Internship and leadership experience across software engineering and robotics."
      />

      <div className="space-y-6">
        {experience.map((job, i) => {
          const photos = jobPhotos[job.org]
          return (
            <Reveal
              key={job.role + job.org}
              delay={i * 100}
              as="article"
              className="lift-on-hover rounded-lg border border-border bg-surface p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">{job.role}</h3>
                  <p className="mt-1 text-accent font-medium">{job.org}</p>
                </div>
                <div className="text-right font-mono text-xs text-muted">
                  <p>{job.period}</p>
                  <p className="mt-1 inline-flex items-center gap-1 justify-end">
                    <MapPin size={12} />
                    {job.location}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-muted leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {photos && (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {photos.map((p) => (
                    <div
                      key={p.src}
                      data-cursor-hover
                      className="aspect-[4/3] overflow-hidden rounded-md border border-border"
                    >
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
