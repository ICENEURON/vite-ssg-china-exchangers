import type { RqfContextData } from "./ContextStep"
import type { RfqProductSpecsData } from "./ProductAndSpecsStep"
import { Check, ShieldCheck, User, Edit2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Option {
    id: string;
    label: string;
}

interface FinalConfirmStepProps {
    context: RqfContextData;
    specs: RfqProductSpecsData;
    email: string;
    isAnonymous: boolean;
    onToggleAnonymous: () => void;
    onEditStep: (step: number) => void;
}

export function FinalConfirmStep({ context, specs, email, isAnonymous, onToggleAnonymous, onEditStep }: FinalConfirmStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const industries = t("industries", { returnObjects: true }) as Option[];
    const fluidTypes = t("fluidTypes", { returnObjects: true }) as Option[];
    const plateMaterials = t("plateMaterials", { returnObjects: true }) as Option[];
    const flangeStandards = t("flangeStandards", { returnObjects: true }) as Option[];

    const getLabel = (opts: Option[], id: string) => opts.find(o => o.id === id)?.label || id;

    const formatOptionValue = (options: Option[], value: string, customValue?: string) => {
        if (!value) return "";
        if (value === "other") {
            return customValue ? `${t("step4.otherPrefix")} (${customValue})` : t("step4.otherPrefix");
        }
        return getLabel(options, value);
    }

    const renderSummaryItem = (label: string, value: string) => {
        if (!value) return null;
        return (
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <span className="text-slate-500 text-sm font-medium">{label}</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-bold text-right max-w-[60%]">{value}</span>
            </div>
        )
    }

    const renderSideSummary = (
        title: string,
        toneClassName: string,
        sideData: {
            mediaName: string;
            inletFluidType: string;
            outletFluidType: string;
            inletMassFlow: string;
            outletMassFlow: string;
            inletGasPhaseFraction: string;
            outletGasPhaseFraction: string;
            inlet: string;
            outlet: string;
            inletDensity: string;
            outletDensity: string;
            inletSpecificHeat: string;
            outletSpecificHeat: string;
            inletConductivity: string;
            outletConductivity: string;
            inletViscosity: string;
            outletViscosity: string;
            designPressure: string;
            testPressure: string;
            designTemperature: string;
            flangeStandard: string;
        }
    ) => (
        <div className={`${toneClassName} p-4 rounded-xl`}>
            <div className="text-xs font-bold uppercase tracking-widest mb-3">{title}</div>
            {renderSummaryItem(t("step4.summaryMediaName"), sideData.mediaName)}
            {renderSummaryItem(t("step4.summaryInletFluidType"), formatOptionValue(fluidTypes, sideData.inletFluidType))}
            {renderSummaryItem(t("step4.summaryOutletFluidType"), formatOptionValue(fluidTypes, sideData.outletFluidType))}
            {renderSummaryItem(t("step4.summaryInletMassFlow"), sideData.inletMassFlow ? `${sideData.inletMassFlow} kg/h` : "")}
            {renderSummaryItem(t("step4.summaryOutletMassFlow"), sideData.outletMassFlow ? `${sideData.outletMassFlow} kg/h` : "")}
            {renderSummaryItem(t("step4.summaryInletGasPhaseFraction"), sideData.inletGasPhaseFraction)}
            {renderSummaryItem(t("step4.summaryOutletGasPhaseFraction"), sideData.outletGasPhaseFraction)}
            {renderSummaryItem(t("step4.summaryInlet"), sideData.inlet ? `${sideData.inlet} °C` : "")}
            {renderSummaryItem(t("step4.summaryOutlet"), sideData.outlet ? `${sideData.outlet} °C` : "")}
            {renderSummaryItem(t("step4.summaryInletDensity"), sideData.inletDensity ? `${sideData.inletDensity} kg/m3` : "")}
            {renderSummaryItem(t("step4.summaryOutletDensity"), sideData.outletDensity ? `${sideData.outletDensity} kg/m3` : "")}
            {renderSummaryItem(t("step4.summaryInletSpecificHeat"), sideData.inletSpecificHeat ? `${sideData.inletSpecificHeat} kJ/kg·°C` : "")}
            {renderSummaryItem(t("step4.summaryOutletSpecificHeat"), sideData.outletSpecificHeat ? `${sideData.outletSpecificHeat} kJ/kg·°C` : "")}
            {renderSummaryItem(t("step4.summaryInletConductivity"), sideData.inletConductivity ? `${sideData.inletConductivity} W/m·°C` : "")}
            {renderSummaryItem(t("step4.summaryOutletConductivity"), sideData.outletConductivity ? `${sideData.outletConductivity} W/m·°C` : "")}
            {renderSummaryItem(t("step4.summaryInletViscosity"), sideData.inletViscosity ? `${sideData.inletViscosity} cp` : "")}
            {renderSummaryItem(t("step4.summaryOutletViscosity"), sideData.outletViscosity ? `${sideData.outletViscosity} cp` : "")}
            {renderSummaryItem(t("step4.summaryDesignPress"), sideData.designPressure ? `${sideData.designPressure} MPa` : "")}
            {renderSummaryItem(t("step4.summaryTestPress"), sideData.testPressure ? `${sideData.testPressure} MPa` : "")}
            {renderSummaryItem(t("step4.summaryDesignTemp"), sideData.designTemperature ? `${sideData.designTemperature} °C` : "")}
            {renderSummaryItem(t("step4.summaryFlangeStandard"), sideData.flangeStandard)}
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">{t("step4.emailVerifiedTitle")}</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">({email})</p>
            </div>

            {/* Privacy Setting */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isAnonymous ? 'bg-primary/10 dark:bg-primary/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {isAnonymous ? <ShieldCheck className="w-6 h-6 text-primary" /> : <User className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-slate-50">
                            {isAnonymous ? t("step4.anonymousMode") : t("step4.publicMode")}
                        </div>
                        <div className="text-sm text-slate-500 mt-0.5 max-w-sm">
                            {isAnonymous ? t("step4.anonymousModeDesc") : t("step4.publicModeDesc")}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isAnonymous}
                    onClick={onToggleAnonymous}
                    className={`
                        relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                        ${isAnonymous ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}
                    `}
                >
                    <span
                        className={`
                            pointer-events-none block h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out
                            ${isAnonymous ? 'translate-x-6' : 'translate-x-0'}
                        `}
                    />
                </button>
            </div>

            {/* Review Summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-8 mt-8">

                {/* Context Section */}
                <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest">{t("step4.projectContextTitle")}</h5>
                        <button onClick={() => onEditStep(1)} className="text-primary hover:text-primary/80 flex items-center text-xs font-bold transition-colors">
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> {t("step4.editBtn")}
                        </button>
                    </div>
                    <div>
                        {renderSummaryItem(t("step4.summaryCountry"), context.country)}
                        {renderSummaryItem(t("step4.summaryIndustry"), context.industry === "other" ? `${t("step4.otherPrefix")} (${context.customIndustry})` : getLabel(industries, context.industry))}
                    </div>
                </div>

                {/* Specs Section */}
                <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest">{t("step4.productSpecsTitle")}</h5>
                        <button onClick={() => onEditStep(2)} className="text-primary hover:text-primary/80 flex items-center text-xs font-bold transition-colors">
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> {t("step4.editBtn")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {renderSideSummary(t("step4.summaryHotSide"), "bg-rose-50 dark:bg-rose-900/10 text-rose-500", {
                            mediaName: specs.hotMediaName,
                            inletFluidType: specs.hotInletFluidType,
                            outletFluidType: specs.hotOutletFluidType,
                            inletMassFlow: specs.hotInletMassFlow,
                            outletMassFlow: specs.hotOutletMassFlow,
                            inletGasPhaseFraction: specs.hotInletGasPhaseFraction,
                            outletGasPhaseFraction: specs.hotOutletGasPhaseFraction,
                            inlet: specs.hotIn,
                            outlet: specs.hotOut,
                            inletDensity: specs.hotInletDensity,
                            outletDensity: specs.hotOutletDensity,
                            inletSpecificHeat: specs.hotInletSpecificHeat,
                            outletSpecificHeat: specs.hotOutletSpecificHeat,
                            inletConductivity: specs.hotInletConductivity,
                            outletConductivity: specs.hotOutletConductivity,
                            inletViscosity: specs.hotInletViscosity,
                            outletViscosity: specs.hotOutletViscosity,
                            designPressure: "",
                            testPressure: "",
                            designTemperature: specs.hotDesignTemperature,
                            flangeStandard: formatOptionValue(flangeStandards, specs.hotFlangeStandard, specs.customHotFlangeStandard),
                        })}

                        {renderSideSummary(t("step4.summaryColdSide"), "bg-blue-50 dark:bg-blue-900/10 text-blue-500", {
                            mediaName: specs.coldMediaName,
                            inletFluidType: specs.coldInletFluidType,
                            outletFluidType: specs.coldOutletFluidType,
                            inletMassFlow: specs.coldInletMassFlow,
                            outletMassFlow: specs.coldOutletMassFlow,
                            inletGasPhaseFraction: specs.coldInletGasPhaseFraction,
                            outletGasPhaseFraction: specs.coldOutletGasPhaseFraction,
                            inlet: specs.coldIn,
                            outlet: specs.coldOut,
                            inletDensity: specs.coldInletDensity,
                            outletDensity: specs.coldOutletDensity,
                            inletSpecificHeat: specs.coldInletSpecificHeat,
                            outletSpecificHeat: specs.coldOutletSpecificHeat,
                            inletConductivity: specs.coldInletConductivity,
                            outletConductivity: specs.coldOutletConductivity,
                            inletViscosity: specs.coldInletViscosity,
                            outletViscosity: specs.coldOutletViscosity,
                            designPressure: "",
                            testPressure: "",
                            designTemperature: specs.coldDesignTemperature,
                            flangeStandard: formatOptionValue(flangeStandards, specs.coldFlangeStandard, specs.customColdFlangeStandard),
                        })}

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl md:col-span-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("step4.summaryGeneralReq")}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {renderSummaryItem(t("step4.summaryDesignPress"), specs.designPressure ? `${specs.designPressure} MPa` : "")}
                                    {renderSummaryItem(t("step4.summaryTestPress"), specs.testPressure ? `${specs.testPressure} MPa` : "")}
                                    {renderSummaryItem(t("step4.summaryPlateMaterial"), formatOptionValue(plateMaterials, specs.plateMaterial, specs.customPlateMaterial))}
                                    {renderSummaryItem(t("step4.summaryHeatLoad"), specs.heatLoad ? `${specs.heatLoad} kW` : "")}
                                </div>
                                {specs.additionalNotes && (
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                                        <div className="text-xs font-bold text-slate-500 mb-1">{t("step4.summaryNotes")}</div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">{specs.additionalNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
