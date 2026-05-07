import { useState } from 'react'
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { ProgressTracker } from "./components/ProgressTracker"
import { ContextStep, type RqfContextData } from "./components/ContextStep"
import { ProductAndSpecsStep, type RfqProductSpecsData } from "./components/ProductAndSpecsStep"
import { EmailVerificationStep } from "./components/EmailVerificationStep"
import { FinalConfirmStep } from "./components/FinalConfirmStep"
import { useTranslation } from "react-i18next"
import { submitRFQ } from "../../lib/supabase/db"
import type { RFQSubmissionData } from "../../lib/supabase/db"


export default function SmartRfqBuilder() {
  const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });

  const [step, setStep] = useState(1)

  const requiresGasPhaseFraction = (fluidType: string) => fluidType === "gas_liquid";
  const resolveCustomSelectValue = (selectedValue: string, customValue: string) => {
    if (!selectedValue) return "";
    return selectedValue === "other" ? customValue.trim() : selectedValue;
  }

  // Form Data
  const [contextData, setContextData] = useState<RqfContextData>({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    industry: "",
    customIndustry: ""
  })

  // Set default values instead of undefined
  const [specsData, setSpecsData] = useState<RfqProductSpecsData>({
    hotMediaName: "",
    hotInletFluidType: "",
    hotOutletFluidType: "",
    hotInletMassFlow: "",
    hotOutletMassFlow: "",
    hotInletGasPhaseFraction: "",
    hotOutletGasPhaseFraction: "",
    hotIn: "",
    hotOut: "",
    hotInletDensity: "",
    hotOutletDensity: "",
    hotInletSpecificHeat: "",
    hotOutletSpecificHeat: "",
    hotInletConductivity: "",
    hotOutletConductivity: "",
    hotInletViscosity: "",
    hotOutletViscosity: "",
    coldMediaName: "",
    coldInletFluidType: "",
    coldOutletFluidType: "",
    coldInletMassFlow: "",
    coldOutletMassFlow: "",
    coldInletGasPhaseFraction: "",
    coldOutletGasPhaseFraction: "",
    coldIn: "",
    coldOut: "",
    coldInletDensity: "",
    coldOutletDensity: "",
    coldInletSpecificHeat: "",
    coldOutletSpecificHeat: "",
    coldInletConductivity: "",
    coldOutletConductivity: "",
    coldInletViscosity: "",
    coldOutletViscosity: "",
    heatLoad: "",
    plateMaterial: "",
    customPlateMaterial: "",
    designPressure: "",
    testPressure: "",
    hotDesignTemperature: "",
    coldDesignTemperature: "",
    hotFlangeStandard: "",
    customHotFlangeStandard: "",
    coldFlangeStandard: "",
    customColdFlangeStandard: "",
    additionalNotes: ""
  })

  const [isAnonymous, setIsAnonymous] = useState(true)
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation Logic
  const canProceedToStep2 =
    contextData.firstName.trim() !== "" &&
    contextData.lastName.trim() !== "" &&
    contextData.country !== "" &&
    contextData.industry !== "" &&
    (contextData.industry !== "other" || contextData.customIndustry.trim() !== "");

  const canProceedToStep3 =
    specsData.hotInletFluidType !== "" &&
    specsData.hotOutletFluidType !== "" &&
    specsData.coldInletFluidType !== "" &&
    specsData.coldOutletFluidType !== "" &&
    (specsData.hotInletMassFlow.trim() !== "" || specsData.hotOutletMassFlow.trim() !== "") &&
    (specsData.coldInletMassFlow.trim() !== "" || specsData.coldOutletMassFlow.trim() !== "") &&
    (!requiresGasPhaseFraction(specsData.hotInletFluidType) || specsData.hotInletGasPhaseFraction.trim() !== "") &&
    (!requiresGasPhaseFraction(specsData.hotOutletFluidType) || specsData.hotOutletGasPhaseFraction.trim() !== "") &&
    (!requiresGasPhaseFraction(specsData.coldInletFluidType) || specsData.coldInletGasPhaseFraction.trim() !== "") &&
    (!requiresGasPhaseFraction(specsData.coldOutletFluidType) || specsData.coldOutletGasPhaseFraction.trim() !== "") &&
    specsData.heatLoad.trim() !== "" &&
    specsData.plateMaterial !== "" &&
    (specsData.plateMaterial !== "other" || specsData.customPlateMaterial.trim() !== "") &&
    specsData.hotFlangeStandard !== "" &&
    (specsData.hotFlangeStandard !== "other" || specsData.customHotFlangeStandard.trim() !== "") &&
    specsData.coldFlangeStandard !== "" &&
    (specsData.coldFlangeStandard !== "other" || specsData.customColdFlangeStandard.trim() !== "");

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Determine business email logic
    const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "qq.com", "163.com", "126.com", "foxmail.com", "icloud.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase() || "";
    const isBusinessEmail = !freeDomains.includes(emailDomain);

    const submissionPayload: RFQSubmissionData = {
      first_name: contextData.firstName,
      last_name: contextData.lastName,
      company_name: contextData.companyName || null,
      country: contextData.country,
      email: email.toLowerCase(),
      is_business_email: isBusinessEmail,
      industry: contextData.industry === "other" ? contextData.customIndustry : contextData.industry,
      additional_notes: specsData.additionalNotes || null,
      is_stealth: isAnonymous,
      parameters: {
        hotMediaName: specsData.hotMediaName,
        hotInletFluidType: specsData.hotInletFluidType,
        hotOutletFluidType: specsData.hotOutletFluidType,
        hotInletMassFlow: specsData.hotInletMassFlow,
        hotOutletMassFlow: specsData.hotOutletMassFlow,
        hotInletGasPhaseFraction: specsData.hotInletGasPhaseFraction,
        hotOutletGasPhaseFraction: specsData.hotOutletGasPhaseFraction,
        hotIn: specsData.hotIn,
        hotOut: specsData.hotOut,
        hotInletDensity: specsData.hotInletDensity,
        hotOutletDensity: specsData.hotOutletDensity,
        hotInletSpecificHeat: specsData.hotInletSpecificHeat,
        hotOutletSpecificHeat: specsData.hotOutletSpecificHeat,
        hotInletConductivity: specsData.hotInletConductivity,
        hotOutletConductivity: specsData.hotOutletConductivity,
        hotInletViscosity: specsData.hotInletViscosity,
        hotOutletViscosity: specsData.hotOutletViscosity,
        coldMediaName: specsData.coldMediaName,
        coldInletFluidType: specsData.coldInletFluidType,
        coldOutletFluidType: specsData.coldOutletFluidType,
        coldInletMassFlow: specsData.coldInletMassFlow,
        coldOutletMassFlow: specsData.coldOutletMassFlow,
        coldInletGasPhaseFraction: specsData.coldInletGasPhaseFraction,
        coldOutletGasPhaseFraction: specsData.coldOutletGasPhaseFraction,
        coldIn: specsData.coldIn,
        coldOut: specsData.coldOut,
        coldInletDensity: specsData.coldInletDensity,
        coldOutletDensity: specsData.coldOutletDensity,
        coldInletSpecificHeat: specsData.coldInletSpecificHeat,
        coldOutletSpecificHeat: specsData.coldOutletSpecificHeat,
        coldInletConductivity: specsData.coldInletConductivity,
        coldOutletConductivity: specsData.coldOutletConductivity,
        coldInletViscosity: specsData.coldInletViscosity,
        coldOutletViscosity: specsData.coldOutletViscosity,
        heatLoad: specsData.heatLoad,
        plateMaterial: resolveCustomSelectValue(specsData.plateMaterial, specsData.customPlateMaterial),
        designPressure: specsData.designPressure,
        testPressure: specsData.testPressure,
        hotDesignTemperature: specsData.hotDesignTemperature,
        coldDesignTemperature: specsData.coldDesignTemperature,
        hotFlangeStandard: resolveCustomSelectValue(specsData.hotFlangeStandard, specsData.customHotFlangeStandard),
        coldFlangeStandard: resolveCustomSelectValue(specsData.coldFlangeStandard, specsData.customColdFlangeStandard),
      }
    }

    try {
      await submitRFQ(submissionPayload);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to submit RFQ: ", error);
      alert(`Failed to submit RFQ: ${message}. Please check your data or try again later.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
      </Head>

      <main className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 text-foreground pb-24">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">{t("navbarTitle")}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pt-8">
          <ProgressTracker currentStep={step} />

          <div className="mt-8">

            {step === 1 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">{t("step1.title")}</h2>
                  <p className="text-slate-500 mt-2">{t("step1.subtitle")}</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">{t("step2.title")}</h2>
                  <p className="text-slate-500 mt-2">{t("step2.subtitle")}</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">{t("step3.title")}</h2>
                  <p className="text-slate-500 mt-2">{t("step3.subtitle")}</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">{t("step4.title")}</h2>
                  <p className="text-slate-500 mt-2">{t("step4.subtitle")}</p>
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "..." : t("step4.submitBtn")}
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
                  {t("success.title1")}<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">{t("success.title2")}</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                  {t("success.desc")}
                </p>
                <Button variant="outline" className="px-8 h-12 rounded-xl text-primary border-primary/20 hover:bg-primary/5 font-bold" onClick={() => window.location.href = "/"}>
                  {t("success.homeBtn")}
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
                    <ArrowLeft className="w-4 h-4 mr-2" /> {t("actions.back")}
                  </Button>
                ) : (
                  <div className="w-24"></div>
                )}
              </div>

              {step < 3 && (
                <div className="flex items-center gap-4">
                  <Button
                    className={`h-12 rounded-xl px-10 font-bold shadow-lg transition-all ${(step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                      : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                      }`}
                    onClick={handleNext}
                    disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                  >
                    {t("actions.continue")} <ArrowRight className="w-4 h-4 ml-2" />
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
