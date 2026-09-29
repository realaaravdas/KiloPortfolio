import profilePhoto from '../assets/photos/aarav-profile.jpg'

/** Shown when WebGL is unavailable or the 3D scene crashes: a static, on-brand portrait. */
export default function WebGLFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-end overflow-hidden lg:pr-[6vw]">
      <figure className="scanlines relative h-[68vh] w-[min(92vw,34rem)] overflow-hidden border border-border lg:w-[30rem]">
        <img
          src={profilePhoto}
          alt="Aarav Das"
          className="h-full w-full object-cover opacity-70 grayscale contrast-125"
          width={700}
          height={700}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <figcaption className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          3D viewport unavailable — static render
        </figcaption>
      </figure>
    </div>
  )
}
