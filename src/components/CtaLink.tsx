import type { ComponentType, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type Props = {
  href: string
  children: ReactNode
  icon?: ComponentType<{ size?: number }>
  solid?: boolean
  className?: string
}

export default function CtaLink({ href, children, icon: Icon = ArrowRight, solid = false, className = '' }: Props) {
  const external = href.startsWith('http') || href.startsWith('mailto:')

  return (
    <a
      href={href}
      {...(external && href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`cta-pill ${solid ? 'cta-pill-solid' : ''} ${className}`}
    >
      <span>{children}</span>
      <span className="cta-arrow">
        <Icon size={15} />
      </span>
    </a>
  )
}
