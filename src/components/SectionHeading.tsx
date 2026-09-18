import Reveal from './Reveal'

type Props = {
  eyebrow: string
  title: string
  description?: string
}

export default function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <span className="font-mono text-sm text-accent tracking-wide">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">{title}</h2>
      {description && <p className="mt-3 text-muted leading-relaxed">{description}</p>}
    </Reveal>
  )
}
