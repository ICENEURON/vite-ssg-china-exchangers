
import { Head } from 'vite-react-ssg'
import { HeroSection } from './components/HeroSection'
import { BenefitsSection } from './components/BenefitsSection'
import { VerificationSection } from './components/VerificationSection'
import { StepByStepSection } from './components/StepByStepSection'

export default function ClaimProfilePage() {
  return (
    <>
      <Head>
        <title>Claim Your Factory Profile - China Heat Exchanger Directory</title>
        <meta
          name="description"
          content="Take ownership of your verified factory profile. Update your capabilities, certificates, and contact information to reach more global buyers."
        />
      </Head>

      <main className="min-h-screen bg-background">
        <HeroSection />
        <BenefitsSection />
        <VerificationSection />
        <StepByStepSection />
      </main>
    </>
  )
}
