import { useEffect, useRef } from 'react'

const HOVER_TARGETS = 'a[href], button, input, textarea, select, [data-cursor-hover]'
const SPEED = 0.2

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const ringDamp = 1 - SPEED
    const dotDamp = 1 - Math.min(4 * SPEED, 0.8)
    const settleThreshold = 0.5

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...target }
    const dotPos = { ...target }

    let lastTime = performance.now()
    let rafId = 0
    let active = false

    const tick = () => {
      const now = performance.now()
      const steps = (60 * (now - lastTime)) / 1000
      lastTime = now

      const ringLerp = 1 - Math.pow(ringDamp, steps)
      ringPos.x += (target.x - ringPos.x) * ringLerp
      ringPos.y += (target.y - ringPos.y) * ringLerp
      ring.style.translate = `${ringPos.x}px ${ringPos.y}px 0`

      const dotLerp = 1 - Math.pow(dotDamp, steps)
      dotPos.x += (target.x - dotPos.x) * dotLerp
      dotPos.y += (target.y - dotPos.y) * dotLerp
      dot.style.translate = `${dotPos.x}px ${dotPos.y}px 0`

      const settled =
        Math.abs(target.x - ringPos.x) < settleThreshold &&
        Math.abs(target.y - ringPos.y) < settleThreshold &&
        Math.abs(target.x - dotPos.x) < settleThreshold &&
        Math.abs(target.y - dotPos.y) < settleThreshold

      rafId = settled ? 0 : requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!rafId) {
        lastTime = performance.now()
        rafId = requestAnimationFrame(tick)
      }
      if (!active) {
        active = true
        ringPos.x = dotPos.x = target.x
        ringPos.y = dotPos.y = target.y
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
    }

    const onLeave = () => {
      active = false
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.(HOVER_TARGETS)) ring.classList.add('is-hover')
    }

    const onOut = (e: MouseEvent) => {
      const t = e.target as Element | null
      const related = e.relatedTarget as Element | null
      const stillHovering = t?.closest?.(HOVER_TARGETS)
      if (!stillHovering) return
      if (related && stillHovering.contains(related)) return
      ring.classList.remove('is-hover')
    }

    document.documentElement.classList.add('cursor-active')
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('cursor-active')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
