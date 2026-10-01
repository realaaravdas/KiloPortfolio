import { Sparkles } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { projects } from '../data/resume'
import rustRacerPoster from '../assets/photos/rust-racer-poster.jpg'

type ProjectMedia =
  | { type: 'video'; src: string; poster: string }
  | { type: 'images'; items: { src: string; alt: string }[] }

const projectMedia: Record<string, ProjectMedia> = {
  'Rust Racer': { type: 'video', src: '/videos/rust-racer.mp4', poster: rustRacerPoster },
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="03 / Projects"
        title="Things I've built"
        description="A mix of robotics and full-stack software projects, built independently."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((p, i) => {
          const media = projectMedia[p.title]
          return (
            <Reveal
              key={p.title}
              delay={i * 80}
              as="article"
              className={`group relative flex flex-col lift-on-hover rounded-lg border p-6 sm:p-7 transition-colors ${
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

              {media?.type === 'video' && (
                <video
                  data-cursor-hover
                  controls
                  preload="none"
                  playsInline
                  poster={media.poster}
                  className="mt-4 w-full rounded-md border border-border"
                >
                  <source src={media.src} type="video/mp4" />
                </video>
              )}

              {media?.type === 'images' && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {media.items.map((img) => (
                    <div
                      key={img.src}
                      data-cursor-hover
                      className="aspect-[4/3] overflow-hidden rounded-md border border-border"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

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
            </Reveal>
          )
        })}
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
