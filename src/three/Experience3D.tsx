import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Grid, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { stage } from '../state/stage'
import { pose, samplePose } from './keyframes'
import Figure from './Figure'

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>

type Props = {
  /** True once the camera has been handed to the user (final section). */
  interactive: boolean
  onProgress: (p: number) => void
  onReady: () => void
}

const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt)
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Scroll-driven camera. While `interactive` is false it flies the camera along the
 * keyframe path and mirrors the look-at point into the OrbitControls target. When the user
 * reaches the last section the rig stops writing to the camera and OrbitControls takes
 * over from exactly where the path left it, so the handoff has no jump. Scrolling back up
 * reverses it: the rig damps the camera from wherever the user left it back onto the path.
 */
function Rig({ interactive, controls }: { interactive: boolean; controls: React.RefObject<OrbitControlsImpl | null> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const smooth = useRef(0)
  const started = useRef(false)
  const wanted = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const lookWanted = useMemo(() => new THREE.Vector3(), [])

  // intro: begin far out and glide in
  useEffect(() => {
    camera.position.set(0, 1.2, 11)
  }, [camera])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    smooth.current += (stage.get() - smooth.current) * damp(5, dt)
    samplePose(smooth.current)

    const desktop = size.width >= 900
    const dist = pose.dist * (desktop ? 1 : 1.32)
    wanted.set(
      Math.sin(pose.az) * Math.cos(pose.el) * dist,
      pose.ty + Math.sin(pose.el) * dist,
      Math.cos(pose.az) * Math.cos(pose.el) * dist,
    )

    if (!interactive) {
      const k = damp(started.current ? 7 : 1.6, dt)
      camera.position.lerp(wanted, k)
      look.lerp(lookWanted.set(0, pose.ty, 0), k)
      camera.lookAt(look)
      if (controls.current) controls.current.target.copy(look)
      if (!started.current && camera.position.distanceTo(wanted) < 0.15) started.current = true
    }

    // Screen-space placement of the model: shift the projection window instead of moving the
    // model, so the offset stays correct whatever angle the camera orbits from.
    const mobileY = 0.26 - 0.12 * smoothstep(0, 1, pose.stage) - 0.08 * smoothstep(4, 5, pose.stage)
    const sx = desktop ? pose.shiftX : 0
    const sy = desktop ? pose.shiftY : mobileY
    camera.setViewOffset(size.width, size.height, -sx * size.width, sy * size.height, size.width, size.height)
  })

  return null
}

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  useFrame(() => {
    if (key.current) {
      key.current.color.copy(pose.keyColor)
      key.current.intensity = pose.keyI
    }
    if (rim.current) {
      rim.current.color.copy(pose.rimColor)
      rim.current.intensity = pose.rimI
    }
  })
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight ref={key} position={[3.2, 4, 5]} />
      <directionalLight ref={rim} position={[-4, 2.2, -4]} />
      <pointLight position={[0, -1, 2]} intensity={0.6} color="#38f0d8" distance={6} />
      <Environment resolution={128} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 2]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, -2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#38f0d8" />
        <Lightformer form="ring" intensity={1.5} position={[4, 2, 3]} scale={3} />
      </Environment>
    </>
  )
}

export default function Experience3D({ interactive, onProgress, onReady }: Props) {
  const controls = useRef<OrbitControlsImpl>(null)

  // OrbitControls forces touch-action:none, which would trap page scrolling on phones.
  // Allow vertical panning of the page and keep horizontal drags for orbiting.
  useEffect(() => {
    const c = controls.current
    if (c) (c.domElement as HTMLElement).style.touchAction = 'pan-y'
  })

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 60, position: [0, 1.2, 11] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      <fog attach="fog" args={['#000000', 9, 24]} />
      <Suspense fallback={null}>
        <Lights />
        <Figure onProgress={onProgress} onReady={onReady} />
      </Suspense>
      <Grid
        position={[0, -1.01, 0]}
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#2a2f33"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#3c4a4a"
        fadeDistance={16}
        fadeStrength={1.6}
      />
      <Rig interactive={interactive} controls={controls} />
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={interactive}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.85}
        maxPolarAngle={1.75}
        autoRotate={interactive}
        autoRotateSpeed={0.7}
      />
    </Canvas>
  )
}
