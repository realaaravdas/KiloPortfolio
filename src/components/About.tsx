import { Cpu, Rocket, Users } from 'lucide-react'
import Reveal from './Reveal'

const points = [
  {
    icon: Cpu,
    title: 'Robotics-first',
    body: 'Four years on an FRC team building vision and localization systems, with hands-on time across CAD, electrical, and mechanical.',
  },
  {
    icon: Rocket,
    title: 'Ships real software',
    body: 'From an enterprise documentation platform at CurieTech AI to five personal projects — I build things people actually use.',
  },
  {
    icon: Users,
    title: 'Leads and mentors',
    body: 'Led the computer vision team on FRC 2367 and mentored elementary schoolers on coding and robot design.',
  },
]

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <span className="font-mono text-sm text-accent tracking-wide">01 / About</span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink max-w-2xl">
          Robotics Engineering student at UC Santa Cruz, building at the intersection of code and hardware.
        </h2>
      </Reveal>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {points.map(({ icon: Icon, title, body }, i) => (
          <Reveal
            key={title}
            delay={i * 100}
            className="lift-on-hover rounded-lg border border-border bg-surface p-6"
          >
            <Icon className="text-accent" size={24} />
            <h3 className="mt-4 font-display font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
