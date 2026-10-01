import { useEffect, useRef, useState } from 'react'

type Slide = { src: string; alt: string }

const AUTOPLAY_MS = 4000

export default function Carousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paused) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, slides.length])

  return (
    <div
      ref={containerRef}
      data-cursor-hover
      className="relative mt-4 overflow-hidden rounded-md border border-border bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-56 sm:h-64">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-border bg-surface py-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-accent' : 'w-1.5 bg-border hover:bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
