
export type UnitSystem = "metric" | "imperial"

interface TechSpecsFormProps {
    units: UnitSystem
    onUnitChange: (u: UnitSystem) => void
    specs: any
    onChange: (field: string, value: string) => void
}

export function TechSpecsForm({ units, onUnitChange, specs, onChange }: TechSpecsFormProps) {

    const tempUnit = units === "metric" ? "°C" : "°F"
    const flowUnit = units === "metric" ? "m³/h" : "GPM"

    // Helper for input styles
    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    const labelClass = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

    return (
        <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Technical Parameters</h3>
                {/* Unit Switcher */}
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => onUnitChange("metric")}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${units === "metric" ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Metric
                    </button>
                    <button
                        onClick={() => onUnitChange("imperial")}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${units === "imperial" ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Imperial
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border rounded-xl p-6">

                {/* Hot Side */}
                <div className="space-y-4">
                    <span className="text-xs font-bold uppercase text-red-500 tracking-wider">Hot Side Fluid</span>

                    <div className="space-y-2">
                        <label className={labelClass}>Fluid Name</label>
                        <input
                            className={inputClass}
                            placeholder="e.g. Steam, Hot Oil"
                            value={specs.hotFluid}
                            onChange={(e) => onChange("hotFluid", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClass}>Inlet Temp</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-8`}
                                    value={specs.hotIn}
                                    onChange={(e) => onChange("hotIn", e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{tempUnit}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Outlet Temp</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-8`}
                                    value={specs.hotOut}
                                    onChange={(e) => onChange("hotOut", e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{tempUnit}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Flow Rate</label>
                        <div className="relative">
                            <input
                                type="number"
                                className={`${inputClass} pr-12`}
                                value={specs.hotFlow}
                                onChange={(e) => onChange("hotFlow", e.target.value)}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{flowUnit}</span>
                        </div>
                    </div>
                </div>

                {/* Cold Side */}
                <div className="space-y-4 md:border-l md:pl-6 border-dashed border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-bold uppercase text-blue-500 tracking-wider">Cold Side Fluid</span>

                    <div className="space-y-2">
                        <label className={labelClass}>Fluid Name</label>
                        <input
                            className={inputClass}
                            placeholder="e.g. Water, Glycol"
                            value={specs.coldFluid}
                            onChange={(e) => onChange("coldFluid", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClass}>Inlet Temp</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-8`}
                                    value={specs.coldIn}
                                    onChange={(e) => onChange("coldIn", e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{tempUnit}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Outlet Temp</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className={`${inputClass} pr-8`}
                                    value={specs.coldOut}
                                    onChange={(e) => onChange("coldOut", e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{tempUnit}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={labelClass}>Flow Rate</label>
                        <div className="relative">
                            <input
                                type="number"
                                className={`${inputClass} pr-12`}
                                value={specs.coldFlow}
                                onChange={(e) => onChange("coldFlow", e.target.value)}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">{flowUnit}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
