import SectionHeading from './SectionHeading'
import { skills } from '../data/resume'

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="04 / Skills" title="Tools I work with" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((group) => (
          <div key={group.category} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="font-mono text-sm text-accent">{group.category}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-surface-2 border border-border px-2.5 py-1 text-sm text-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
