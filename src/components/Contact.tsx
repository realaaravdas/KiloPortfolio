import { motion } from 'framer-motion'
import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import { profile, sectionStats } from '../data/resume'
import CtaLink from './CtaLink'
import GithubIcon from './icons/GithubIcon'
import LinkedinIcon from './icons/LinkedinIcon'
import HudRings from './HudRings'
import StatGrid from './StatGrid'

/**
 * Final section. The wrapper is pointer-events:none so drags fall through to the 3D canvas
 * (OrbitControls are live here); only real controls opt back in.
 */
export default function Contact() {
  return (
    <section id="contact" className="pointer-events-none relative flex min-h-screen flex-col justify-between pt-28">
      <HudRings size={900} className="left-1/2 top-[46%] hidden -translate-x-1/2 -translate-y-1/2 opacity-40 md:block" />

      <div className="relative z-10 mx-auto w-full max-w-[100rem] px-5 sm:px-8 lg:px-14">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent">SEC—05</span>
            <span className="h-px w-8 bg-border-strong" />
            <span className="tracking-[0.18em]">CONTACT</span>
          </div>
          <h2 className="font-head mt-4 text-[clamp(2.6rem,6vw,5.5rem)] text-ink">
            Let&apos;s build
            <br />
            something.
          </h2>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[100rem] px-5 pb-8 sm:px-8 lg:px-14">
        <p className="mb-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span className="h-px w-8 bg-border-strong" />
          Drag to orbit
          <span className="h-px w-8 bg-border-strong" />
        </p>

        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="pointer-events-auto lg:col-span-4">
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Open to internships in software, robotics autonomy, computer vision, controls, and AI automation. I usually reply within a day.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CtaLink href={`mailto:${profile.email}`} icon={ArrowRight} solid>
                Get in touch
              </CtaLink>
              <CtaLink href={profile.resumeUrl} icon={ArrowDownToLine}>
                Download resume
              </CtaLink>
            </div>
            <div className="mt-5 flex items-center gap-5 font-mono text-xs text-muted">
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
                <GithubIcon size={16} /> {profile.githubHandle}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
                <LinkedinIcon size={16} /> LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className="hover:text-accent">
                {profile.email}
              </a>
            </div>
          </div>
          <div className="pointer-events-auto lg:col-span-4 lg:col-start-9">
            <StatGrid stats={sectionStats.contact} prefix="05" />
          </div>
        </div>
      </div>

      <footer className="pointer-events-auto relative z-10 border-t border-border bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[100rem] flex-col gap-3 px-5 pb-20 pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <p>
            <span className="border border-accent px-1.5 py-0.5 text-accent">Clearance: Open</span>
            <span className="ml-3">Classification — Engineering / Unclassified</span>
          </p>
          <p className="text-dim">Doc AD-2026.09 · Rev 16 · Distribution: Unlimited</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Aarav Das</span>
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">LinkedIn</a>
            <a href="/llms.txt" className="hover:text-accent">llms.txt</a>
          </p>
        </div>
      </footer>
    </section>
  )
}
