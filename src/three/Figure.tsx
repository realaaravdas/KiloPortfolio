import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { loadFigure, type Figure as FigureData } from './figureBuilder'
import { createPointsMaterial } from './shaders'
import { pose } from './keyframes'

type Props = {
  onProgress: (p: number) => void
  onReady: (source: FigureData['source']) => void
}

const isSmall = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches

/**
 * The centerpiece: solid model + particle body + turntable rings, all driven by `pose`
 * (the scroll-derived keyframe state written by the camera rig).
 */
export default function Figure({ onProgress, onReady }: Props) {
  const gl = useThree((s) => s.gl)
  const [figure, setFigure] = useState<FigureData | null>(null)
  const group = useRef<THREE.Group>(null)
  const solid = useRef<THREE.Group>(null)
  const scan = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Group>(null)

  const material = useMemo(() => createPointsMaterial(Math.min(gl.getPixelRatio(), 2)), [gl])

  useEffect(() => {
    let cancelled = false
    loadFigure(isSmall() ? 14000 : 30000, onProgress).then((f) => {
      if (cancelled) return
      setFigure(f)
      onReady(f.source)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(
    () => () => {
      material.dispose()
      figure?.points.dispose()
    },
    [material, figure],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (group.current) group.current.rotation.y = pose.rotY

    material.uniforms.uTime.value = t
    material.uniforms.uMorph.value = pose.morph
    material.uniforms.uOpacity.value = pose.points

    if (figure) {
      const visible = pose.solid > 0.02
      if (solid.current) solid.current.visible = visible
      if (visible) for (const m of figure.materials) m.opacity = pose.solid
    }

    if (scan.current) {
      const m = scan.current.material as THREE.MeshBasicMaterial
      scan.current.position.y = Math.sin(t * 0.7) * 1.02
      m.opacity = pose.scan * (1 - pose.morph) * (0.25 + 0.35 * Math.abs(Math.cos(t * 0.7)))
    }
    if (ringA.current) ringA.current.rotation.y = -t * 0.12
  })

  if (!figure) return null

  return (
    <group ref={group}>
      <group ref={solid}>
        <primitive object={figure.root} />
      </group>
      <points geometry={figure.points} material={material} frustumCulled={false} />

      {/* scan ring sweeping the body */}
      <mesh ref={scan} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.5, 0.515, 96]} />
        <meshBasicMaterial color="#38f0d8" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* turntable */}
      <group position-y={-1.005} ref={ringA}>
        {[0.72, 1.05, 1.5].map((r, i) => (
          <mesh key={r} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[r, r + 0.008, 128, 1, 0, i === 1 ? Math.PI * 1.5 : Math.PI * 2]} />
            <meshBasicMaterial color={i === 0 ? '#38f0d8' : '#ffffff'} transparent opacity={i === 0 ? 0.55 : 0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2
          const long = i % 4 === 0
          const r = 1.5
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[-Math.PI / 2, 0, -a]}>
              <planeGeometry args={[long ? 0.12 : 0.05, 0.008]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={long ? 0.4 : 0.18} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
