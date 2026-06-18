export type UnitSystem = "metric" | "imperial"

import { useTranslation } from "react-i18next"

interface TechSpecsFormProps {
    units: UnitSystem
    onUnitChange: (u: UnitSystem) => void
    specs: LegacyTechSpecs
    onChange: (field: string, value: string) => void
}

interface LegacyTechSpecs {
    hotFluid: string
    hotIn: string
    hotOut: string
    hotFlow: string
    coldFluid: string
    coldIn: string
    coldOut: string
    coldFlow: string
}

export function TechSpecsForm({ units, onUnitChange, specs, onChange }: TechSpecsFormProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq.step2" });

    const tempUnit = units === "metric" ? "°C" : "°F"
    const flowUnit = units === "metric" ? "m³/h" : "GPM"

    // Helper for input styles
    const inputClass = "flex h-12 w-full rounded-sm border-2 border-slate-200 bg-white px-4 py-2 text-sm ring-offset-background transition-all hover:border-primary/40 focus:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
    const labelClass = "text-sm font-semibold text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{t("thermalSpecsTitle")}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t("thermalSpecsSubtitle")}</p>
                </div>
                {/* Unit Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200 shadow-inner">
                    <button
                        onClick={() => onUnitChange("metric")}
                        className={`text-sm px-6 py-2 rounded-sm font-semibold transition-all duration-300 ${units === "metric" ? "bg-white shadow-md text-primary" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        {t("unitMetric")}
                    </button>
                    <button
                        onClick={() => onUnitChange("imperial")}
                        className={`text-sm px-6 py-2 rounded-sm font-semibold transition-all duration-300 ${units === "imperial" ? "bg-white shadow-md text-primary" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        {t("unitImperial")}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-sm p-6 md:p-10 shadow-sm">

                {/* Hot Side */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
                        <div className="w-8 h-8 rounded-sm bg-rose-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm bg-rose-500 animate-pulse" />
                        </div>
                        <span className="text-lg font-bold text-rose-600">{t("hotSide")}</span>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>{t("fluidLabel")}</label>
                            <input
                                className={inputClass}
                                placeholder={t("hotFluidPlaceholder")}
                                value={specs.hotFluid}
                                onChange={(e) => onChange("hotFluid", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t("inletTempLabel").split(' ')[0]}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className={`${inputClass} pr-10 font-mono`}
                                        value={specs.hotIn}
                                        placeholder="0.0"
                                        onChange={(e) => onChange("hotIn", e.target.value)}
                                    />
                                    <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{tempUnit}</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t("outletTempLabel").split(' ')[0]}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className={`${inputClass} pr-10 font-mono`}
                                        value={specs.hotOut}
                                        placeholder="0.0"
                                        onChange={(e) => onChange("hotOut", e.target.value)}
                                    />
                                    <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{tempUnit}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>{t("flowRateLabel").split(' ')[0]}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-14 font-mono`}
                                    value={specs.hotFlow}
                                    placeholder="0.00"
                                    onChange={(e) => onChange("hotFlow", e.target.value)}
                                />
                                <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{flowUnit}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cold Side */}
                <div className="space-y-6 lg:border-l lg:pl-8 border-dashed border-slate-200">
                    <div className="flex items-center gap-3 border-b border-blue-100 pb-4">
                        <div className="w-8 h-8 rounded-sm bg-blue-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-sm bg-blue-500 animate-pulse" />
                        </div>
                        <span className="text-lg font-bold text-blue-600">{t("coldSide")}</span>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>{t("fluidLabel")}</label>
                            <input
                                className={inputClass}
                                placeholder={t("coldFluidPlaceholder")}
                                value={specs.coldFluid}
                                onChange={(e) => onChange("coldFluid", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>{t("inletTempLabel").split(' ')[0]}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className={`${inputClass} pr-10 font-mono`}
                                        value={specs.coldIn}
                                        placeholder="0.0"
                                        onChange={(e) => onChange("coldIn", e.target.value)}
                                    />
                                    <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{tempUnit}</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t("outletTempLabel").split(' ')[0]}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className={`${inputClass} pr-10 font-mono`}
                                        value={specs.coldOut}
                                        placeholder="0.0"
                                        onChange={(e) => onChange("coldOut", e.target.value)}
                                    />
                                    <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{tempUnit}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>{t("flowRateLabel").split(' ')[0]}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-14 font-mono`}
                                    value={specs.coldFlow}
                                    placeholder="0.00"
                                    onChange={(e) => onChange("coldFlow", e.target.value)}
                                />
                                <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold">{flowUnit}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
