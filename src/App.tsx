import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import ScrollIndicator from './components/ScrollIndicator'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Cursor />
      <ScrollIndicator />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
      </main>
      <Contact />
    </div>
  )
}
