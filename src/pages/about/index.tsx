import { Head } from 'vite-react-ssg'
import { AboutHero } from './components/AboutHero'
import { ProblemSection } from './components/ProblemSection'
import { VerificationGrid } from './components/VerificationGrid'
import { TransparencySection } from './components/TransparencySection'
import { AboutCTA } from './components/AboutCTA'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - HeatEx Direct</title>
        <meta
          name="description"
          content="We bridge the Trust Gap between Western engineering standards and Chinese manufacturing capacity."
        />
      </Head>

      <main className="min-h-screen">
        <AboutHero />
        <ProblemSection />
        <VerificationGrid />
        <TransparencySection />
        <AboutCTA />
      </main>
    </>
  )
}
