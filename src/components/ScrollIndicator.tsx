import { useEffect, useRef } from 'react'

// Replicates devin.ai's custom scrollbar (as of their mid-2025 site): a thin
// fixed track on the right edge holding a proportional thumb, hidden while
// idle and faded in only while the page is actively being scrolled.
const MIN_THUMB_RATIO = 0.1
const FADE_RATE = 2 // opacity units per second, in and out
const IDLE_DELAY = 500 // ms of no scroll before the thumb starts fading out

export default function ScrollIndicator() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef(0)
  const activeRatioRef = useRef(0)
  const lastScrollTimeRef = useRef(-Infinity)
  const lastFrameTimeRef = useRef(0)

  useEffect(() => {
    function onScroll() {
      lastScrollTimeRef.current = performance.now()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function tick(now: number) {
      const dt = lastFrameTimeRef.current ? (now - lastFrameTimeRef.current) / 1000 : 0
      lastFrameTimeRef.current = now

      const isActive = now - lastScrollTimeRef.current < IDLE_DELAY
      const target = isActive ? 1 : 0
      const dir = target - activeRatioRef.current
      activeRatioRef.current = Math.min(1, Math.max(0, activeRatioRef.current + Math.sign(dir) * FADE_RATE * dt))
      if (Math.abs(target - activeRatioRef.current) < 0.001) activeRatioRef.current = target

      const track = trackRef.current
      const thumb = thumbRef.current
      if (track && thumb) {
        track.style.opacity = String(activeRatioRef.current)

        const trackHeight = track.getBoundingClientRect().height
        const docHeight = document.documentElement.scrollHeight
        const viewportHeight = window.innerHeight
        const heightRatio = docHeight > 0 ? Math.max(MIN_THUMB_RATIO, viewportHeight / docHeight) : 1
        const maxScroll = docHeight - viewportHeight
        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0

        thumb.style.height = `${trackHeight * heightRatio}px`
        thumb.style.transform = `translate3d(0, ${trackHeight * progress * (1 - heightRatio)}px, 0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-2.5 top-[10vh] z-[60] h-[80vh] w-1 rounded-full sm:right-4"
      style={{ backgroundColor: 'rgb(255 255 255 / 10%)', mixBlendMode: 'difference', opacity: 0 }}
    >
      <div ref={thumbRef} className="absolute left-0 top-0 w-full rounded-full bg-white" />
    </div>
  )
}
