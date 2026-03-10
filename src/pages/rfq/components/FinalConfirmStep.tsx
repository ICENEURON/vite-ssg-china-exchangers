import type { RqfContextData } from "./ContextStep"
import type { RfqProductSpecsData } from "./ProductAndSpecsStep"
import { Check, ShieldCheck, User, Edit2 } from "lucide-react"
import { useTranslation } from "react-i18next"

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
    const industries = t("industries", { returnObjects: true }) as {id: string, label: string}[];
    const quantities = t("quantities", { returnObjects: true }) as {id: string, label: string}[];
    const timelines = t("timelines", { returnObjects: true }) as {id: string, label: string}[];
    const productTypes = t("productTypes", { returnObjects: true }) as {id: string, label: string}[];

    const getLabel = (opts: {id: string, label: string}[], id: string) => opts.find(o => o.id === id)?.label || id;

    const renderSummaryItem = (label: string, value: string) => {
        if (!value) return null;
        return (
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <span className="text-slate-500 text-sm font-medium">{label}</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-bold text-right max-w-[60%]">{value}</span>
            </div>
        )
    }

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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isAnonymous ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary/10 dark:bg-primary/20'}`}>
                        {isAnonymous ? <ShieldCheck className="w-6 h-6 text-slate-400" /> : <User className="w-6 h-6 text-primary" />}
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
                        ${isAnonymous ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary'}
                    `}
                >
                    <span
                        className={`
                            pointer-events-none block h-7 w-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out
                            ${isAnonymous ? 'translate-x-0' : 'translate-x-6'}
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
                        {renderSummaryItem(t("step4.summaryQuantity"), context.quantity === "other" ? `${t("step4.otherPrefix")} (${context.customQuantity})` : getLabel(quantities, context.quantity))}
                        {renderSummaryItem(t("step4.summaryTimeline"), context.timeline === "other" ? `${t("step4.otherPrefix")} (${context.customTimeline})` : getLabel(timelines, context.timeline))}
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
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl md:col-span-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t("step4.summaryGeneralReq")}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {renderSummaryItem(t("step4.summaryEqType"), specs.productType === "other" ? `${t("step4.otherPrefix")} (${specs.customProductType})` : getLabel(productTypes, specs.productType))}
                                    {renderSummaryItem(t("step4.summaryDesignPress"), specs.designPressure ? `${specs.designPressure} bar` : "")}
                                    {renderSummaryItem(t("step4.summaryPressDrop"), specs.pressureDrop ? `${specs.pressureDrop} kPA` : "")}
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

                         <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl">
                            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">{t("step4.summaryHotSide")}</div>
                            {renderSummaryItem(t("step4.summaryFluid"), specs.hotFluid)}
                            {renderSummaryItem(t("step4.summaryInlet"), specs.hotIn ? `${specs.hotIn}°` : "")}
                            {renderSummaryItem(t("step4.summaryOutlet"), specs.hotOut ? `${specs.hotOut}°` : "")}
                            {renderSummaryItem(t("step4.summaryFlow"), specs.hotFlow ? `${specs.hotFlow} m³/h` : "")}
                        </div>

                         <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl md:col-start-2">
                            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">{t("step4.summaryColdSide")}</div>
                            {renderSummaryItem(t("step4.summaryFluid"), specs.coldFluid)}
                            {renderSummaryItem(t("step4.summaryInlet"), specs.coldIn ? `${specs.coldIn}°` : "")}
                            {renderSummaryItem(t("step4.summaryOutlet"), specs.coldOut ? `${specs.coldOut}°` : "")}
                            {renderSummaryItem(t("step4.summaryFlow"), specs.coldFlow ? `${specs.coldFlow} m³/h` : "")}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
