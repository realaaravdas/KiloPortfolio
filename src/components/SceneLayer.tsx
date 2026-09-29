import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { stage } from '../state/stage'
import Preloader from './Preloader'
import WebGLFallback from './WebGLFallback'

// three.js + R3F are large; keep them out of the initial bundle.
const Experience3D = lazy(() => import('../three/Experience3D'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error('[3D] scene crashed, falling back to static portrait', err)
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

const MIN_PRELOAD_MS = 1100

type Props = { onReady: () => void }

/**
 * Owns the fixed full-screen WebGL layer: capability check, preloader, crash fallback,
 * and the flag that hands the camera to OrbitControls in the final section.
 */
export default function SceneLayer({ onReady }: Props) {
  const [supported, setSupported] = useState(hasWebGL)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const startedAt = useRef(0)
  const readyCalled = useRef(false)

  useEffect(() => {
    startedAt.current = performance.now()
  }, [])

  const finish = useCallback(() => {
    if (readyCalled.current) return
    readyCalled.current = true
    const wait = Math.max(0, MIN_PRELOAD_MS - (performance.now() - startedAt.current))
    window.setTimeout(() => {
      setDone(true)
      onReady()
    }, wait)
  }, [onReady])

  // No WebGL (or the scene crashed) → skip preloading entirely.
  useEffect(() => {
    if (!supported) finish()
  }, [supported, finish])

  // Lock scrolling while the model preloads.
  useEffect(() => {
    document.documentElement.style.overflow = done ? '' : 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [done])

  // Fake-but-honest progress floor so the bar moves even before the first byte arrives.
  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => setProgress((p) => Math.min(p + (0.9 - p) * 0.06, 0.9)), 90)
    return () => window.clearInterval(id)
  }, [done])

  const onProgress = useCallback((p: number) => setProgress((cur) => Math.max(cur, p)), [])

  // Hysteresis so the handoff doesn't flicker around the threshold.
  useMotionValueEvent(stage, 'change', (v) => {
    setInteractive((cur) => (cur ? v > 4.6 : v > 4.85))
  })

  return (
    <>
      <div className="fixed inset-0 z-0" aria-hidden="true">
        {supported ? (
          <Boundary onError={() => setSupported(false)}>
            <Suspense fallback={null}>
              <Experience3D interactive={interactive && done} onProgress={onProgress} onReady={finish} />
            </Suspense>
          </Boundary>
        ) : (
          <WebGLFallback />
        )}
      </div>
      <Preloader progress={supported ? progress : 1} done={done} />
    </>
  )
}
