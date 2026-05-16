import type { RqfContextData } from "./ContextStep"
import type { RfqProductSpecsData } from "./ProductAndSpecsStep"
import { Check, Edit2, Send, ShieldCheck, User } from "lucide-react"
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
    sourceManufacturerName: string | null;
    isTargetingSourceManufacturer: boolean;
    onToggleAnonymous: () => void;
    onToggleTargetingSourceManufacturer: () => void;
    onEditStep: (step: number) => void;
}

interface SideSummaryData {
    mediaName: string;
    inletFluidType: string;
    outletFluidType: string;
    inletMassFlow: string;
    outletMassFlow: string;
    inletVolumeFlow: string;
    outletVolumeFlow: string;
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
    customFlangeStandard: string;
    inletFlangeNominalDiameter: string;
    outletFlangeNominalDiameter: string;
    flangeMaterial: string;
    flangePressureRating: string;
    flangeTypeSealingFace: string;
}

export function FinalConfirmStep({ context, specs, email, isAnonymous, sourceManufacturerName, isTargetingSourceManufacturer, onToggleAnonymous, onToggleTargetingSourceManufacturer, onEditStep }: FinalConfirmStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const industries = t("industries", { returnObjects: true }) as Option[];
    const fluidTypes = t("fluidTypes", { returnObjects: true }) as Option[];
    const plateMaterials = t("plateMaterials", { returnObjects: true }) as Option[];
    const flangeStandards = t("flangeStandards", { returnObjects: true }) as Option[];

    const getLabel = (options: Option[], id: string) => options.find((option) => option.id === id)?.label || id;
    const resolveOutletValue = (inletValue: string, outletValue: string) => outletValue || inletValue;

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
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <span className="max-w-[60%] break-words text-right text-sm font-bold text-slate-900">{value}</span>
            </div>
        )
    }

    const renderSideSummary = (title: string, toneClassName: string, sideData: SideSummaryData) => {
        const outletFluidType = resolveOutletValue(sideData.inletFluidType, sideData.outletFluidType);
        const outletMassFlow = resolveOutletValue(sideData.inletMassFlow, sideData.outletMassFlow);
        const outletVolumeFlow = resolveOutletValue(sideData.inletVolumeFlow, sideData.outletVolumeFlow);
        const outletGasPhaseFraction = resolveOutletValue(sideData.inletGasPhaseFraction, sideData.outletGasPhaseFraction);
        const outletTemp = resolveOutletValue(sideData.inlet, sideData.outlet);
        const outletDensity = resolveOutletValue(sideData.inletDensity, sideData.outletDensity);
        const outletSpecificHeat = resolveOutletValue(sideData.inletSpecificHeat, sideData.outletSpecificHeat);
        const outletConductivity = resolveOutletValue(sideData.inletConductivity, sideData.outletConductivity);
        const outletViscosity = resolveOutletValue(sideData.inletViscosity, sideData.outletViscosity);
        const outletFlangeNominalDiameter = resolveOutletValue(sideData.inletFlangeNominalDiameter, sideData.outletFlangeNominalDiameter);

        return (
            <div className={`${toneClassName} rounded-xl p-4`}>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest">{title}</div>
                {renderSummaryItem(t("step4.summaryMediaName"), sideData.mediaName)}
                {renderSummaryItem(t("step4.summaryInletFluidType"), formatOptionValue(fluidTypes, sideData.inletFluidType))}
                {renderSummaryItem(t("step4.summaryOutletFluidType"), formatOptionValue(fluidTypes, outletFluidType))}
                {renderSummaryItem(t("step4.summaryInletMassFlow"), sideData.inletMassFlow ? `${sideData.inletMassFlow} kg/h` : "")}
                {renderSummaryItem(t("step4.summaryOutletMassFlow"), outletMassFlow ? `${outletMassFlow} kg/h` : "")}
                {renderSummaryItem(t("step4.summaryInletVolumeFlow"), sideData.inletVolumeFlow ? `${sideData.inletVolumeFlow} m3/h` : "")}
                {renderSummaryItem(t("step4.summaryOutletVolumeFlow"), outletVolumeFlow ? `${outletVolumeFlow} m3/h` : "")}
                {renderSummaryItem(t("step4.summaryInletGasPhaseFraction"), sideData.inletGasPhaseFraction)}
                {renderSummaryItem(t("step4.summaryOutletGasPhaseFraction"), outletGasPhaseFraction)}
                {renderSummaryItem(t("step4.summaryInlet"), sideData.inlet ? `${sideData.inlet} °C` : "")}
                {renderSummaryItem(t("step4.summaryOutlet"), outletTemp ? `${outletTemp} °C` : "")}
                {renderSummaryItem(t("step4.summaryInletDensity"), sideData.inletDensity ? `${sideData.inletDensity} kg/m3` : "")}
                {renderSummaryItem(t("step4.summaryOutletDensity"), outletDensity ? `${outletDensity} kg/m3` : "")}
                {renderSummaryItem(t("step4.summaryInletSpecificHeat"), sideData.inletSpecificHeat ? `${sideData.inletSpecificHeat} kJ/kg·°C` : "")}
                {renderSummaryItem(t("step4.summaryOutletSpecificHeat"), outletSpecificHeat ? `${outletSpecificHeat} kJ/kg·°C` : "")}
                {renderSummaryItem(t("step4.summaryInletConductivity"), sideData.inletConductivity ? `${sideData.inletConductivity} W/m·°C` : "")}
                {renderSummaryItem(t("step4.summaryOutletConductivity"), outletConductivity ? `${outletConductivity} W/m·°C` : "")}
                {renderSummaryItem(t("step4.summaryInletViscosity"), sideData.inletViscosity ? `${sideData.inletViscosity} cp` : "")}
                {renderSummaryItem(t("step4.summaryOutletViscosity"), outletViscosity ? `${outletViscosity} cp` : "")}
                {renderSummaryItem(t("step4.summaryDesignPress"), sideData.designPressure ? `${sideData.designPressure} MPa` : "")}
                {renderSummaryItem(t("step4.summaryTestPress"), sideData.testPressure ? `${sideData.testPressure} MPa` : "")}
                {renderSummaryItem(t("step4.summaryDesignTemp"), sideData.designTemperature ? `${sideData.designTemperature} °C` : "")}
                {renderSummaryItem(t("step4.summaryFlangeStandard"), formatOptionValue(flangeStandards, sideData.flangeStandard, sideData.customFlangeStandard))}
                {renderSummaryItem(t("step4.summaryInletFlangeNominalDiameter"), sideData.inletFlangeNominalDiameter)}
                {renderSummaryItem(t("step4.summaryOutletFlangeNominalDiameter"), outletFlangeNominalDiameter)}
                {renderSummaryItem(t("step4.summaryFlangeMaterial"), sideData.flangeMaterial)}
                {renderSummaryItem(t("step4.summaryFlangePressureRating"), sideData.flangePressureRating)}
                {renderSummaryItem(t("step4.summaryFlangeTypeSealingFace"), sideData.flangeTypeSealingFace)}
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <div className="mb-4 rounded-full bg-green-100 p-3">
                    <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">{t("step4.emailVerifiedTitle")}</h3>
                <p className="mt-1 text-sm text-green-700">{email}</p>
            </div>

            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${isAnonymous ? "bg-primary/10" : "bg-slate-100"}`}>
                        {isAnonymous ? <ShieldCheck className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-slate-500" />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{isAnonymous ? t("step4.anonymousMode") : t("step4.publicMode")}</div>
                        <div className="mt-0.5 max-w-sm text-sm text-slate-500">{isAnonymous ? t("step4.anonymousModeDesc") : t("step4.publicModeDesc")}</div>
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isAnonymous}
                    onClick={onToggleAnonymous}
                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer self-end rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:self-auto ${isAnonymous ? "bg-primary" : "bg-slate-300"}`}
                >
                    <span className={`pointer-events-none block h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${isAnonymous ? "translate-x-6" : "translate-x-0"}`} />
                </button>
            </div>

            {sourceManufacturerName && (
                <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${isTargetingSourceManufacturer ? "bg-emerald-100" : "bg-slate-100"}`}>
                            <Send className={`h-6 w-6 ${isTargetingSourceManufacturer ? "text-emerald-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">
                                {t("step4.sourceManufacturerTargetTitle")} <span className="text-blue-600">{sourceManufacturerName}</span>
                            </div>
                            <div className="mt-0.5 max-w-sm text-sm text-slate-500">
                                {isTargetingSourceManufacturer ? t("step4.sourceManufacturerTargetEnabledDesc") : t("step4.sourceManufacturerTargetDisabledDesc")}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isTargetingSourceManufacturer}
                        onClick={onToggleTargetingSourceManufacturer}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer self-end rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:self-auto ${isTargetingSourceManufacturer ? "bg-emerald-500" : "bg-slate-300"}`}
                    >
                        <span className={`pointer-events-none block h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${isTargetingSourceManufacturer ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                </div>
            )}

            <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">{t("step4.projectContextTitle")}</h4>
                        <button onClick={() => onEditStep(1)} className="flex items-center text-xs font-bold text-primary transition-colors hover:text-primary/80">
                            <Edit2 className="mr-1.5 h-3.5 w-3.5" /> {t("step4.editBtn")}
                        </button>
                    </div>
                    {renderSummaryItem(t("step4.summaryCountry"), context.country)}
                    {renderSummaryItem(t("step4.summaryIndustry"), context.industry === "other" ? `${t("step4.otherPrefix")} (${context.customIndustry})` : getLabel(industries, context.industry))}
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">{t("step4.productSpecsTitle")}</h4>
                        <button onClick={() => onEditStep(2)} className="flex items-center text-xs font-bold text-primary transition-colors hover:text-primary/80">
                            <Edit2 className="mr-1.5 h-3.5 w-3.5" /> {t("step4.editBtn")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                        {renderSideSummary(t("step4.summaryHotSide"), "bg-rose-50 text-rose-500", {
                            mediaName: specs.hotMediaName,
                            inletFluidType: specs.hotInletFluidType,
                            outletFluidType: specs.hotOutletFluidType,
                            inletMassFlow: specs.hotInletMassFlow,
                            outletMassFlow: specs.hotOutletMassFlow,
                            inletVolumeFlow: specs.hotInletVolumeFlow,
                            outletVolumeFlow: specs.hotOutletVolumeFlow,
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
                            designPressure: specs.hotDesignPressure,
                            testPressure: specs.hotTestPressure,
                            designTemperature: specs.hotDesignTemperature,
                            flangeStandard: specs.hotFlangeStandard,
                            customFlangeStandard: specs.customHotFlangeStandard,
                            inletFlangeNominalDiameter: specs.hotInletFlangeNominalDiameter,
                            outletFlangeNominalDiameter: specs.hotOutletFlangeNominalDiameter,
                            flangeMaterial: specs.hotFlangeMaterial,
                            flangePressureRating: specs.hotFlangePressureRating,
                            flangeTypeSealingFace: specs.hotFlangeTypeSealingFace,
                        })}

                        {renderSideSummary(t("step4.summaryColdSide"), "bg-blue-50 text-blue-500", {
                            mediaName: specs.coldMediaName,
                            inletFluidType: specs.coldInletFluidType,
                            outletFluidType: specs.coldOutletFluidType,
                            inletMassFlow: specs.coldInletMassFlow,
                            outletMassFlow: specs.coldOutletMassFlow,
                            inletVolumeFlow: specs.coldInletVolumeFlow,
                            outletVolumeFlow: specs.coldOutletVolumeFlow,
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
                            designPressure: specs.coldDesignPressure,
                            testPressure: specs.coldTestPressure,
                            designTemperature: specs.coldDesignTemperature,
                            flangeStandard: specs.coldFlangeStandard,
                            customFlangeStandard: specs.customColdFlangeStandard,
                            inletFlangeNominalDiameter: specs.coldInletFlangeNominalDiameter,
                            outletFlangeNominalDiameter: specs.coldOutletFlangeNominalDiameter,
                            flangeMaterial: specs.coldFlangeMaterial,
                            flangePressureRating: specs.coldFlangePressureRating,
                            flangeTypeSealingFace: specs.coldFlangeTypeSealingFace,
                        })}

                        <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
                            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{t("step4.summaryGeneralReq")}</div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    {renderSummaryItem(t("step4.summaryDesignCode"), specs.designCode)}
                                    {renderSummaryItem(t("step4.summaryPlateMaterial"), formatOptionValue(plateMaterials, specs.plateMaterial, specs.customPlateMaterial))}
                                    {renderSummaryItem(t("step4.summaryHeatLoad"), specs.heatLoad ? `${specs.heatLoad} kW` : "")}
                                </div>
                                {specs.additionalNotes && (
                                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                                        <div className="mb-1 text-xs font-bold text-slate-500">{t("step4.summaryNotes")}</div>
                                        <p className="break-words text-sm leading-relaxed text-slate-700">{specs.additionalNotes}</p>
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