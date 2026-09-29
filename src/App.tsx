import { lazy, Suspense, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import GridOverlay from './components/GridOverlay'
import SceneLayer from './components/SceneLayer'
import ScrollProgress from './components/ScrollProgress'
import { useStageTracker } from './state/stage'

// reads the 3D pose, so it belongs in the lazy three.js chunk
const Telemetry = lazy(() => import('./components/Telemetry'))

export default function App() {
  const [ready, setReady] = useState(false)
  useStageTracker()

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <Cursor />
      <SceneLayer onReady={() => setReady(true)} />
      <GridOverlay />
      <Nav />
      {/* click-through so the final section can pass drags to the WebGL canvas; content opts back in */}
      <main className="pointer-events-none relative z-10">
        <Hero ready={ready} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <Telemetry />
      </Suspense>
      <ScrollProgress />
    </div>
  )
}
