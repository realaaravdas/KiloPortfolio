/** Fixed precision-grid overlay: fine grid, edge rulers and corner crosshairs. Purely decorative. */
export default function GridOverlay() {
  const ruler = (dir: 'to right' | 'to bottom') =>
    `repeating-linear-gradient(${dir}, rgb(255 255 255 / 0.28) 0 1px, transparent 1px 10px), repeating-linear-gradient(${dir}, rgb(255 255 255 / 0.5) 0 1px, transparent 1px 50px)`

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
      <div
        className="absolute inset-0 bg-grid opacity-70"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 20%, transparent 100%)',
        }}
      />
      {/* rulers */}
      <div className="absolute left-0 top-14 bottom-0 hidden w-2 md:block" style={{ backgroundImage: ruler('to bottom'), backgroundSize: '100% 50px', backgroundRepeat: 'repeat-y' }} />
      <div className="absolute right-0 top-14 bottom-0 hidden w-2 md:block" style={{ backgroundImage: ruler('to bottom'), backgroundSize: '100% 50px', backgroundRepeat: 'repeat-y' }} />
      {/* corner crosshairs */}
      {[
        'left-5 top-[4.5rem]',
        'right-5 top-[4.5rem]',
        'left-5 bottom-5',
        'right-5 bottom-5',
      ].map((pos) => (
        <svg key={pos} className={`absolute ${pos} text-white/40`} width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 0v18M0 9h18" stroke="currentColor" />
        </svg>
      ))}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, rgb(0 0 0 / 0.75), transparent)' }}
      />
    </div>
  )
}
