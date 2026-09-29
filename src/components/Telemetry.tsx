import { useRef } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { pose } from '../three/keyframes'

/** Live readout of the scroll-driven camera/model state (desktop only). */
export default function Telemetry() {
  const yaw = useRef<HTMLSpanElement>(null)
  const el = useRef<HTMLSpanElement>(null)
  const morph = useRef<HTMLSpanElement>(null)
  const stg = useRef<HTMLSpanElement>(null)

  useAnimationFrame(() => {
    const deg = (((pose.rotY * 180) / Math.PI) % 360 + 360) % 360
    if (yaw.current) yaw.current.textContent = deg.toFixed(1).padStart(5, '0')
    if (el.current) el.current.textContent = ((pose.el * 180) / Math.PI).toFixed(1)
    if (morph.current) morph.current.textContent = Math.round(pose.morph * 100).toString().padStart(3, '0')
    if (stg.current) stg.current.textContent = pose.stage.toFixed(2)
  })

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[4.1rem] z-40 hidden justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted lg:flex">
      <p><span className="text-dim">YAW </span><span ref={yaw}>000.0</span>°</p>
      <p><span className="text-dim">ELV </span><span ref={el}>0.0</span>°</p>
      <p><span className="text-dim">DISP </span><span ref={morph}>000</span>%</p>
      <p><span className="text-dim">STG </span><span ref={stg}>0.00</span></p>
    </div>
  )
}
