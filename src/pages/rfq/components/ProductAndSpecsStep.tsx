import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

export interface RfqProductSpecsData {
    hotMediaName: string;
    hotInletFluidType: string;
    hotOutletFluidType: string;
    hotInletMassFlow: string;
    hotOutletMassFlow: string;
    hotInletGasPhaseFraction: string;
    hotOutletGasPhaseFraction: string;
    hotIn: string;
    hotOut: string;
    hotInletDensity: string;
    hotOutletDensity: string;
    hotInletSpecificHeat: string;
    hotOutletSpecificHeat: string;
    hotInletConductivity: string;
    hotOutletConductivity: string;
    hotInletViscosity: string;
    hotOutletViscosity: string;
    coldMediaName: string;
    coldInletFluidType: string;
    coldOutletFluidType: string;
    coldInletMassFlow: string;
    coldOutletMassFlow: string;
    coldInletGasPhaseFraction: string;
    coldOutletGasPhaseFraction: string;
    coldIn: string;
    coldOut: string;
    coldInletDensity: string;
    coldOutletDensity: string;
    coldInletSpecificHeat: string;
    coldOutletSpecificHeat: string;
    coldInletConductivity: string;
    coldOutletConductivity: string;
    coldInletViscosity: string;
    coldOutletViscosity: string;
    heatLoad: string;
    plateMaterial: string;
    customPlateMaterial: string;
    designPressure: string;
    testPressure: string;
    hotDesignTemperature: string;
    coldDesignTemperature: string;
    hotFlangeStandard: string;
    customHotFlangeStandard: string;
    coldFlangeStandard: string;
    customColdFlangeStandard: string;
    additionalNotes: string;
}

interface Option {
    id: string;
    label: string;
}

interface ProductAndSpecsStepProps {
    data: RfqProductSpecsData;
    onChange: (data: Partial<RfqProductSpecsData>) => void;
}

export function ProductAndSpecsStep({ data, onChange }: ProductAndSpecsStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const fluidTypes = t("fluidTypes", { returnObjects: true }) as Option[];
    const plateMaterials = t("plateMaterials", { returnObjects: true }) as Option[];
    const flangeStandards = t("flangeStandards", { returnObjects: true }) as Option[];
    
    // Basic anti-injection to prevent basic script tags or SQL patterns, plus a 500-char limit
    const MAX_NOTES_LENGTH = 500;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (value.length > MAX_NOTES_LENGTH) return;
        
        // Strip out basic angle brackets to prevent obvious HTML/Script injection
        value = value.replace(/[<>]/g, "");
        onChange({ additionalNotes: value });
    }

    const updateField = (field: keyof RfqProductSpecsData, value: string) => {
        onChange({ [field]: value } as Partial<RfqProductSpecsData>);
    }

    const isGasLiquid = (fluidType: string) => fluidType === "gas_liquid";

    const inputClass = "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
    const selectClass = `${inputClass} pr-10`
    const sideLabelClass = "text-xs font-semibold text-slate-700 leading-none mb-2 block uppercase tracking-wider"

    const renderSideThermalSection = ({
        side,
        title,
        accentClass,
        borderClass,
        mediaPlaceholder,
    }: {
        side: "hot" | "cold";
        title: string;
        accentClass: string;
        borderClass: string;
        mediaPlaceholder: string;
    }) => {
        const mediaNameField = `${side}MediaName` as keyof RfqProductSpecsData;
        const inletFluidTypeField = `${side}InletFluidType` as keyof RfqProductSpecsData;
        const outletFluidTypeField = `${side}OutletFluidType` as keyof RfqProductSpecsData;
        const inletMassFlowField = `${side}InletMassFlow` as keyof RfqProductSpecsData;
        const outletMassFlowField = `${side}OutletMassFlow` as keyof RfqProductSpecsData;
        const inletGasPhaseFractionField = `${side}InletGasPhaseFraction` as keyof RfqProductSpecsData;
        const outletGasPhaseFractionField = `${side}OutletGasPhaseFraction` as keyof RfqProductSpecsData;
        const inletField = `${side}In` as keyof RfqProductSpecsData;
        const outletField = `${side}Out` as keyof RfqProductSpecsData;
        const inletDensityField = `${side}InletDensity` as keyof RfqProductSpecsData;
        const outletDensityField = `${side}OutletDensity` as keyof RfqProductSpecsData;
        const inletSpecificHeatField = `${side}InletSpecificHeat` as keyof RfqProductSpecsData;
        const outletSpecificHeatField = `${side}OutletSpecificHeat` as keyof RfqProductSpecsData;
        const inletConductivityField = `${side}InletConductivity` as keyof RfqProductSpecsData;
        const outletConductivityField = `${side}OutletConductivity` as keyof RfqProductSpecsData;
        const inletViscosityField = `${side}InletViscosity` as keyof RfqProductSpecsData;
        const outletViscosityField = `${side}OutletViscosity` as keyof RfqProductSpecsData;
        const inletFluidTypeValue = data[inletFluidTypeField] || "";
        const outletFluidTypeValue = data[outletFluidTypeField] || "";

        return (
            <div className={`space-y-6 ${side === "cold" ? `lg:border-l lg:pl-8 ${borderClass}` : ""}`}>
                <div className={`flex items-center gap-3 border-b ${borderClass} pb-3`}>
                    <span className={`text-sm font-bold uppercase tracking-widest ${accentClass}`}>{title}</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={sideLabelClass}>{t("step2.mediaNameLabel")}</label>
                        <input
                            className={inputClass}
                            placeholder={mediaPlaceholder}
                            value={data[mediaNameField] || ""}
                            onChange={(e) => updateField(mediaNameField, e.target.value)}
                        />
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.fluidTypeLabel")} <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletFluidTypeLabel")}</label>
                                <select
                                    className={selectClass}
                                    value={inletFluidTypeValue}
                                    onChange={(e) => updateField(inletFluidTypeField, e.target.value)}
                                >
                                    <option value="">{t("step2.fluidTypePlaceholder")}</option>
                                    {fluidTypes.map((option) => (
                                        <option key={option.id} value={option.id}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletFluidTypeLabel")}</label>
                                <select
                                    className={selectClass}
                                    value={outletFluidTypeValue}
                                    onChange={(e) => updateField(outletFluidTypeField, e.target.value)}
                                >
                                    <option value="">{t("step2.fluidTypePlaceholder")}</option>
                                    {fluidTypes.map((option) => (
                                        <option key={option.id} value={option.id}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {(isGasLiquid(inletFluidTypeValue) || isGasLiquid(outletFluidTypeValue)) && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className={sideLabelClass}>{t("step2.gasPhaseFractionLabel")} <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    {isGasLiquid(inletFluidTypeValue) && (
                                        <>
                                            <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletGasPhaseFractionLabel")}</label>
                                            <input
                                                className={inputClass}
                                                value={data[inletGasPhaseFractionField] || ""}
                                                placeholder={t("step2.gasPhaseFractionPlaceholder")}
                                                onChange={(e) => updateField(inletGasPhaseFractionField, e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>
                                <div>
                                    {isGasLiquid(outletFluidTypeValue) && (
                                        <>
                                            <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletGasPhaseFractionLabel")}</label>
                                            <input
                                                className={inputClass}
                                                value={data[outletGasPhaseFractionField] || ""}
                                                placeholder={t("step2.gasPhaseFractionPlaceholder")}
                                                onChange={(e) => updateField(outletGasPhaseFractionField, e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={sideLabelClass}>{t("step2.massFlowLabel")} <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletMassFlowLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[inletMassFlowField] || ""}
                                    placeholder={t("step2.massFlowPlaceholder")}
                                    onChange={(e) => updateField(inletMassFlowField, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletMassFlowLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[outletMassFlowField] || ""}
                                    placeholder={t("step2.massFlowPlaceholder")}
                                    onChange={(e) => updateField(outletMassFlowField, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={sideLabelClass}>{t("step2.inletTempLabel")}</label>
                            <input
                                type="number"
                                step="any"
                                className={inputClass}
                                value={data[inletField] || ""}
                                placeholder="0.0"
                                onChange={(e) => updateField(inletField, e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={sideLabelClass}>{t("step2.outletTempLabel")}</label>
                            <input
                                type="number"
                                step="any"
                                className={inputClass}
                                value={data[outletField] || ""}
                                placeholder="0.0"
                                onChange={(e) => updateField(outletField, e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.densityLabel")}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[inletDensityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(inletDensityField, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[outletDensityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(outletDensityField, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.specificHeatLabel")}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[inletSpecificHeatField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(inletSpecificHeatField, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[outletSpecificHeatField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(outletSpecificHeatField, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.conductivityLabel")}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[inletConductivityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(inletConductivityField, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[outletConductivityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(outletConductivityField, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.viscosityLabel")}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.inletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[inletViscosityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(inletViscosityField, e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={`${sideLabelClass} text-[11px] mb-1`}>{t("step2.outletPropertyLabel")}</label>
                                <input
                                    type="number"
                                    step="any"
                                    className={inputClass}
                                    value={data[outletViscosityField] || ""}
                                    placeholder="0.0"
                                    onChange={(e) => updateField(outletViscosityField, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSideEquipmentSection = ({
        side,
        title,
        accentClass,
        borderClass,
    }: {
        side: "hot" | "cold";
        title: string;
        accentClass: string;
        borderClass: string;
    }) => {
        const designTemperatureField = `${side}DesignTemperature` as keyof RfqProductSpecsData;
        const flangeStandardField = `${side}FlangeStandard` as keyof RfqProductSpecsData;
        const customFlangeStandardField = `custom${side === "hot" ? "Hot" : "Cold"}FlangeStandard` as keyof RfqProductSpecsData;
        const flangeStandardValue = data[flangeStandardField] || "";

        return (
            <div className={`space-y-6 ${side === "cold" ? `lg:border-l lg:pl-8 ${borderClass}` : ""}`}>
                <div className={`flex items-center gap-3 border-b ${borderClass} pb-3`}>
                    <span className={`text-sm font-bold uppercase tracking-widest ${accentClass}`}>{title}</span>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <label className={sideLabelClass}>{t("step2.designTemperatureLabel")}</label>
                            <input
                                type="number"
                                step="any"
                                className={inputClass}
                                value={data[designTemperatureField] || ""}
                                placeholder="0.0"
                                onChange={(e) => updateField(designTemperatureField, e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={sideLabelClass}>{t("step2.flangeStandardLabel")} <span className="text-red-500">*</span></label>
                        <select
                            className={selectClass}
                            value={flangeStandardValue}
                            onChange={(e) => updateField(flangeStandardField, e.target.value)}
                        >
                            <option value="">{t("step2.flangeStandardPlaceholder")}</option>
                            {flangeStandards.map((option) => (
                                <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {flangeStandardValue === "other" && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className={sideLabelClass}>{t("step2.flangeStandardLabel")} <span className="text-red-500">*</span></label>
                            <input
                                className={inputClass}
                                value={data[customFlangeStandardField] || ""}
                                placeholder={t("step2.customFlangeStandardPlaceholder")}
                                onChange={(e) => updateField(customFlangeStandardField, e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900">{t("step2.thermalSpecsTitle")}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t("step2.thermalSpecsSubtitle")}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {renderSideThermalSection({
                        side: "hot",
                        title: t("step2.hotSide"),
                        accentClass: "text-rose-600",
                        borderClass: "border-rose-100",
                        mediaPlaceholder: t("step2.hotMediaPlaceholder"),
                    })}
                    {renderSideThermalSection({
                        side: "cold",
                        title: t("step2.coldSide"),
                        accentClass: "text-blue-600",
                        borderClass: "border-blue-100",
                        mediaPlaceholder: t("step2.coldMediaPlaceholder"),
                    })}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-8">
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 block">{t("step2.heatLoadLabel")} <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        step="any"
                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                        value={data.heatLoad}
                        placeholder={t("step2.heatLoadPlaceholder")}
                        onChange={(e) => updateField("heatLoad", e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900">{t("step2.equipmentParamsTitle")}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t("step2.equipmentParamsSubtitle")}</p>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 block">{t("step2.designPressureLabel")}</label>
                            <input
                                type="number"
                                step="any"
                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                                value={data.designPressure}
                                placeholder="0.0"
                                onChange={(e) => updateField("designPressure", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 block">{t("step2.testPressureLabel")}</label>
                            <input
                                type="number"
                                step="any"
                                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                                value={data.testPressure}
                                placeholder="0.0"
                                onChange={(e) => updateField("testPressure", e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 block">{t("step2.plateMaterialLabel")} <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                            {plateMaterials.map((option) => {
                                const isSelected = data.plateMaterial === option.id;
                                return (
                                    <button
                                        type="button"
                                        key={option.id}
                                        onClick={() => updateField("plateMaterial", option.id)}
                                        className={`
                                            relative flex items-center justify-center p-4 rounded-xl border transition-all duration-300 text-center
                                            ${isSelected
                                                ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/50'
                                                : 'border-slate-200 bg-white hover:border-primary/40'
                                            }
                                        `}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                            {option.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {data.plateMaterial === "other" && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    placeholder={t("step2.customPlateMaterialPlaceholder")}
                                    value={data.customPlateMaterial || ""}
                                    onChange={(e) => updateField("customPlateMaterial", e.target.value)}
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                        {renderSideEquipmentSection({
                            side: "hot",
                            title: t("step2.hotSide"),
                            accentClass: "text-rose-600",
                            borderClass: "border-rose-100",
                        })}
                        {renderSideEquipmentSection({
                            side: "cold",
                            title: t("step2.coldSide"),
                            accentClass: "text-blue-600",
                            borderClass: "border-blue-100",
                        })}
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <label className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 block">{t("step2.additionalNotesLabel")}</label>
                        <div className="relative">
                            <textarea
                                className="flex w-full min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 resize-y"
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
        </div>
    )
}
