
import { Head } from 'vite-react-ssg'
import { HeroSection } from './components/HeroSection'
import { PlatformValueSection } from './components/PlatformValueSection'
import { GuidelinesSection } from './components/GuidelinesSection'
import { ProcessSection } from './components/ProcessSection'
import { CTASection } from './components/CTASection'

export default function ContentMarketingServicesPage() {
    return (
        <>
            <Head>
                <title>Write For Us - China Heat Exchanger Directory</title>
                <meta
                    name="description"
                    content="Publish technical insights on China-HeatExchangers.com and build lasting trust with procurement managers in HVAC, Marine, and Chemical industries."
                />
                <meta name="keywords" content="write for us, guest post, heat exchanger industry, manufacturing content marketing" />
            </Head>

            <main className="min-h-screen bg-background">
                <HeroSection />
                <PlatformValueSection />
                <GuidelinesSection />
                <ProcessSection />
                <CTASection />
            </main>
        </>
    )
}
