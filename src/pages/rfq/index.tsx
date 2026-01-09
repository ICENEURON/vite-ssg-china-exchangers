
import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { ArrowRight, Save, UploadCloud } from "lucide-react"
import { ProgressTracker } from "./components/ProgressTracker"
import { ProductSelector } from "./components/ProductSelector"
import { TechSpecsForm } from "./components/TechSpecsForm"
import { LivePreview } from "./components/LivePreview"

export default function SmartRfqBuilder() {

  // State
  const [step, setStep] = useState(1)
  const [productType, setProductType] = useState<"phe" | "shell" | "spares">("phe")
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric")
  const [isAnonymous, setIsAnonymous] = useState(true)

  // Form Data
  const [specs, setSpecs] = useState({
    hotFluid: "",
    hotIn: "",
    hotOut: "",
    hotFlow: "",
    coldFluid: "",
    coldIn: "",
    coldOut: "",
    coldFlow: ""
  })

  const handleSpecChange = (field: string, value: string) => {
    setSpecs(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Head>
        <title>Smart RFQ Builder - Get Custom Heat Exchanger Quotes</title>
        <meta name="description" content="Build a professional RFQ in minutes. Anonymous mode available. Get quotes from verified manufacturers." />
      </Head>

      <main className="min-h-screen bg-slate-50 dark:bg-background text-foreground pb-24">

        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-lg">Smart RFQ Builder</span>
            <div className="text-xs font-mono text-muted-foreground">ID: #NEW-DRAFT</div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl pt-8">

          <ProgressTracker currentStep={step} />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Input Canvas */}
            <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Section 1: Product Selection */}
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Select Product Type</h2>
                <ProductSelector selected={productType} onSelect={setProductType} />
              </section>

              {/* Section 2: Technical Parameters */}
              <section>
                <TechSpecsForm
                  units={unitSystem}
                  onUnitChange={setUnitSystem}
                  specs={specs}
                  onChange={handleSpecChange}
                />
              </section>

              {/* Section 3: File Upload (Mock) */}
              <section className="mb-12">
                <h3 className="text-lg font-bold mb-4">Attachments</h3>
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">Drag technical drawings or datasheets here</p>
                  <p className="text-sm text-muted-foreground mt-1">.PDF, .DWG, .XLSX (Max 10MB)</p>
                  <div className="mt-4 text-[10px] text-green-600 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                    Files are encrypted & scanned
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN: Sticky Preview */}
            <div className="hidden lg:block lg:col-span-4 pl-4">
              <LivePreview
                specs={specs}
                productType={productType}
                isAnonymous={isAnonymous}
                onAnonymousChange={setIsAnonymous}
              />
            </div>

          </div>
        </div>

        {/* Floating Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-2xl z-50">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground hidden md:block">
                Next: Context & Recipients
              </div>
              <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => setStep(s => s < 3 ? s + 1 : s)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
