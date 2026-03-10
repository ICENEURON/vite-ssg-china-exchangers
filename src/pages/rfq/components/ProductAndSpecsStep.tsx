import { FieldSet, FieldLabel, FieldGroup } from "../../../components/ui/field"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

export interface RfqProductSpecsData {
    productType: string;
    customProductType: string;
    hotFluid: string;
    hotIn: string;
    hotOut: string;
    hotFlow: string;
    coldFluid: string;
    coldIn: string;
    coldOut: string;
    coldFlow: string;
    designPressure: string;
    pressureDrop: string;
    heatLoad: string;
    additionalNotes: string;
}

interface ProductAndSpecsStepProps {
    data: RfqProductSpecsData;
    onChange: (data: Partial<RfqProductSpecsData>) => void;
}

export function ProductAndSpecsStep({ data, onChange }: ProductAndSpecsStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const productTypes = t("productTypes", { returnObjects: true }) as {id: string, label: string}[];
    
    // Basic anti-injection to prevent basic script tags or SQL patterns, plus a 500-char limit
    const MAX_NOTES_LENGTH = 500;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (value.length > MAX_NOTES_LENGTH) return;
        
        // Strip out basic angle brackets to prevent obvious HTML/Script injection
        value = value.replace(/[<>]/g, "");
        onChange({ additionalNotes: value });
    }

    const inputClass = "flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
    const sideLabelClass = "text-xs font-semibold text-slate-700 dark:text-slate-300 leading-none mb-2 block uppercase tracking-wider"

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            {/* 1. Product Selection */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
                <FieldSet className="mb-0">
                    <FieldLabel className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">{t("step2.equipmentTypeLabel")}</FieldLabel>
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {productTypes.map((p) => {
                            const isSelected = data.productType === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => onChange({ productType: p.id })}
                                    className={`
                                        relative flex items-center justify-center p-4 rounded-xl border transition-all duration-300 text-center
                                        ${isSelected
                                            ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/50'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-primary/40'
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {p.label}
                                    </span>
                                </button>
                            )
                        })}
                    </FieldGroup>
                    {data.productType === "other" && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <input
                                type="text"
                                placeholder={t("step2.customEquipmentPlaceholder")}
                                value={data.customProductType || ""}
                                onChange={(e) => onChange({ customProductType: e.target.value })}
                                className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                            />
                        </div>
                    )}
                </FieldSet>
            </div>

            {/* 2. Basic Technical Requirements */}
            {data.productType && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{t("step2.thermalSpecsTitle")}</h3>
                        <p className="text-sm text-slate-500 mt-1">{t("step2.thermalSpecsSubtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        {/* Hot Side */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-rose-100 dark:border-rose-900/30 pb-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">{t("step2.hotSide")}</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={sideLabelClass}>{t("step2.fluidLabel")}</label>
                                    <input
                                        className={inputClass}
                                        placeholder={t("step2.hotFluidPlaceholder")}
                                        value={data.hotFluid}
                                        onChange={(e) => onChange({ hotFluid: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={sideLabelClass}>{t("step2.inletTempLabel")}</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={data.hotIn}
                                            placeholder="0.0"
                                            onChange={(e) => onChange({ hotIn: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={sideLabelClass}>{t("step2.outletTempLabel")}</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={data.hotOut}
                                            placeholder="0.0"
                                            onChange={(e) => onChange({ hotOut: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={sideLabelClass}>{t("step2.flowRateLabel")}</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={data.hotFlow}
                                        placeholder="0.00"
                                        onChange={(e) => onChange({ hotFlow: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cold Side */}
                        <div className="space-y-6 lg:border-l lg:pl-8 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3 border-b border-blue-100 dark:border-blue-900/30 pb-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{t("step2.coldSide")}</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={sideLabelClass}>{t("step2.fluidLabel")}</label>
                                    <input
                                        className={inputClass}
                                        placeholder={t("step2.coldFluidPlaceholder")}
                                        value={data.coldFluid}
                                        onChange={(e) => onChange({ coldFluid: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={sideLabelClass}>{t("step2.inletTempLabel")}</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={data.coldIn}
                                            placeholder="0.0"
                                            onChange={(e) => onChange({ coldIn: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={sideLabelClass}>{t("step2.outletTempLabel")}</label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            value={data.coldOut}
                                            placeholder="0.0"
                                            onChange={(e) => onChange({ coldOut: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={sideLabelClass}>{t("step2.flowRateLabel")}</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={data.coldFlow}
                                        placeholder="0.00"
                                        onChange={(e) => onChange({ coldFlow: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-8">
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest">{t("step2.opLimitsTitle")}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={sideLabelClass}>{t("step2.designPressureLabel")}</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={data.designPressure}
                                    placeholder={t("step2.designPressurePlaceholder")}
                                    onChange={(e) => onChange({ designPressure: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={sideLabelClass}>{t("step2.pressureDropLabel")}</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={data.pressureDrop}
                                    placeholder={t("step2.pressureDropPlaceholder")}
                                    onChange={(e) => onChange({ pressureDrop: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={sideLabelClass}>{t("step2.heatLoadLabel")}</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={data.heatLoad}
                                    placeholder={t("step2.heatLoadPlaceholder")}
                                    onChange={(e) => onChange({ heatLoad: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="mt-8">
                            <label className="text-sm font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-3 block">{t("step2.additionalNotesLabel")}</label>
                            <div className="relative">
                                <textarea
                                    className="flex w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 resize-y"
                                    placeholder={t("step2.additionalNotesPlaceholder")}
                                    value={data.additionalNotes || ""}
                                    onChange={handleNotesChange}
                                />
                                <div className={`absolute bottom-3 right-4 text-xs font-semibold ${data.additionalNotes?.length > MAX_NOTES_LENGTH - 50 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {data.additionalNotes?.length || 0} / {MAX_NOTES_LENGTH}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
