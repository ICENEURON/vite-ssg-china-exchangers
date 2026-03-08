import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { ProgressTracker } from "./components/ProgressTracker"
import { ContextStep, type RqfContextData } from "./components/ContextStep"
import { ProductAndSpecsStep, type RfqProductSpecsData } from "./components/ProductAndSpecsStep"
import { EmailVerificationStep } from "./components/EmailVerificationStep"
import { FinalConfirmStep } from "./components/FinalConfirmStep"

export default function SmartRfqBuilder() {

  const [step, setStep] = useState(1)
  
  // Form Data
  const [contextData, setContextData] = useState<RqfContextData>({
    country: "",
    industry: "",
    customIndustry: "",
    timeline: "",
    customTimeline: "",
    quantity: "",
    customQuantity: ""
  })

  // Set default values instead of undefined
  const [specsData, setSpecsData] = useState<RfqProductSpecsData>({
    productType: "",
    customProductType: "",
    hotFluid: "",
    hotIn: "",
    hotOut: "",
    hotFlow: "",
    coldFluid: "",
    coldIn: "",
    coldOut: "",
    coldFlow: "",
    designPressure: "",
    pressureDrop: "",
    heatLoad: "",
    additionalNotes: ""
  })

  const [isAnonymous, setIsAnonymous] = useState(true)
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation Logic
  const canProceedToStep2 = 
    contextData.country !== "" && 
    contextData.industry !== "" && 
    (contextData.industry !== "Other" || contextData.customIndustry !== "") &&
    contextData.timeline !== "" && 
    (contextData.timeline !== "Other" || contextData.customTimeline !== "") &&
    contextData.quantity !== "" &&
    (contextData.quantity !== "Other" || contextData.customQuantity !== "");

  const canProceedToStep3 = 
    specsData.productType !== "" && 
    (specsData.productType !== "other" || specsData.customProductType !== "") &&
    specsData.hotFluid !== "" && 
    specsData.coldFluid !== "";

  const handleNext = () => {
    if (step === 1 && canProceedToStep2) {
        setStep(2);
    } else if (step === 2 && canProceedToStep3) {
        if (isVerified) setStep(4);
        else setStep(3);
    } else if (step === 3 && isVerified) {
        setStep(4);
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  }

  const handleSubmit = () => {
    setIsSubmitted(true);
  }

  return (
    <>
      <Head>
        <title>Smart RFQ Builder - Get Custom Heat Exchanger Quotes</title>
        <meta name="description" content="Build a professional RFQ in minutes. Anonymous mode available. Get quotes from verified manufacturers." />
      </Head>

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground pb-24">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">Smart RFQ Builder</span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pt-8">
          <ProgressTracker currentStep={step} />

          <div className="mt-8">
              
              {step === 1 && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">1. Project Context</h2>
                    <p className="text-slate-500 mt-2">Help our verified factories understand the scale and requirements of your project.</p>
                  </div>
                  <ContextStep 
                    data={contextData} 
                    onChange={(newData) => setContextData(prev => ({ ...prev, ...newData }))} 
                  />
                </section>
              )}

              {step === 2 && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">2. Product & Specifications</h2>
                    <p className="text-slate-500 mt-2">Select the product type and provide the critical thermal parameters for sizing.</p>
                  </div>
                  <ProductAndSpecsStep
                    data={specsData}
                    onChange={(newData) => setSpecsData(prev => ({ ...prev, ...newData }))}
                  />
                </section>
              )}

              {step === 3 && (
                <section>
                   <div className="mb-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">3. Verification</h2>
                    <p className="text-slate-500 mt-2">Please verify your email to ensure you are a real user before connecting with factories.</p>
                  </div>

                  <EmailVerificationStep 
                    email={email} 
                    setEmail={setEmail} 
                    isVerified={isVerified}
                    onNext={() => setStep(4)}
                    onVerify={() => {
                        setIsVerified(true);
                        setStep(4);
                    }} 
                  />
                </section>
              )}

              {step === 4 && !isSubmitted && (
                 <section>
                     <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">4. Confirm & Submit</h2>
                        <p className="text-slate-500 mt-2">Review your RFQ details and choose your privacy settings.</p>
                     </div>
                     <FinalConfirmStep 
                        context={contextData}
                        specs={specsData}
                        email={email}
                        isAnonymous={isAnonymous}
                        onToggleAnonymous={() => setIsAnonymous(!isAnonymous)}
                        onEditStep={(s) => setStep(s)}
                     />

                     <div className="mt-12 flex justify-center">
                        <Button 
                            size="lg"
                            className="w-full max-w-md h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20" 
                            onClick={handleSubmit}
                        >
                            Submit RFQ
                        </Button>
                     </div>
                 </section>
              )}

              {isSubmitted && (
                  <section className="text-center py-20 max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-green-50 dark:border-green-900/10">
                        <Check className="w-12 h-12 text-green-600 dark:text-green-400 stroke-[3]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight mb-6">
                        Verified &<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Submitted!</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                        We have successfully processed your RFQ. We will be in touch shortly to assist you with the next steps.
                    </p>
                    <Button variant="outline" className="px-8 h-12 rounded-xl text-primary border-primary/20 hover:bg-primary/5 font-bold" onClick={() => window.location.href="/"}>
                        Return to Home
                    </Button>
                </section>
              )}

          </div>
        </div>

        {/* Floating Action Footer */}
        {(!isSubmitted && step < 4) && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
            <div className="container mx-auto max-w-4xl flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                 {step > 1 ? (
                    <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold px-6 h-12 rounded-xl" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                 ) : (
                    <div className="w-24"></div> 
                 )}
              </div>

              {step < 3 && (
                <div className="flex items-center gap-4">
                  <Button 
                    className={`h-12 rounded-xl px-10 font-bold shadow-lg transition-all ${
                        (step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                    }`}
                    onClick={handleNext}
                    disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
