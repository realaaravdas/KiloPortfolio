import { motion } from 'framer-motion'
import { sectionStats, skills } from '../data/resume'
import Section, { Tag } from './Section'

export default function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      code="SKILLS"
      title="Stack & tooling"
      kicker="From firmware-adjacent Python and C++ to the perception, control, and deployment layers around a robot."
      side="left"
      stats={sectionStats.skills}
    >
      <div className="divide-y divide-border border-y border-border">
        {skills.map((g, i) => (
          <motion.div
            key={g.category}
            className="grid gap-3 py-4 sm:grid-cols-[9.5rem_1fr]"
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="label text-ink/80">
              <span className="mr-2 text-accent">{String(i + 1).padStart(2, '0')}</span>
              {g.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
