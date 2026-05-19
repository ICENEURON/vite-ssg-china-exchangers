import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import rawCountries from "../../../data/countries.json"

export interface RqfContextData {
    firstName: string;
    lastName: string;
    companyName: string;
    country: string;
    industry: string;
    customIndustry: string;
}

interface ContextStepProps {
    data: RqfContextData;
    onChange: (data: Partial<RqfContextData>) => void;
}

const COUNTRIES = rawCountries
    .map(c => c.name)
    .filter(c => {
        const lower = c.toLowerCase()
        return !lower.includes("hong kong") && !lower.includes("macao") && !lower.includes("macau") && !lower.includes("taiwan")
    })
    .concat(["Hong Kong, China", "Macao, China", "Taiwan, China"])
    .sort()

export function ContextStep({ data, onChange }: ContextStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const industries = t("industries", { returnObjects: true }) as {id: string, label: string}[];
    const inputClass = "h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 sm:h-10 sm:text-sm";
    const requiredInputClass = inputClass;
    const requiredInputStyle = undefined;
    const labelClass = "mb-1.5 block text-[9px] font-bold tracking-wide text-slate-700 sm:text-[11px]";
    const requiredLabelClass = "mb-1.5 block text-[9px] font-bold tracking-wide text-slate-700 sm:text-[11px]";
    const requiredMark = <span className="ml-1 text-red-500">*</span>;

    const renderSelectionGroup = (
        label: string, 
        options: {id: string, label: string}[], 
        currentValue: string, 
        fieldKey: keyof RqfContextData,
        customKey?: keyof RqfContextData,
        customPlaceholder?: string,
        required?: boolean
    ) => (
        <div>
            <div className={required ? requiredLabelClass : labelClass}>{label}{required && requiredMark}</div>
            <div className="grid grid-cols-2 gap-2 rounded-md md:grid-cols-3">
                {options.map((option) => {
                    const isSelected = currentValue === option.id;
                    return (
                        <button
                            type="button"
                            key={option.id}
                            onClick={() => onChange({ [fieldKey]: option.id })}
                            className={`
                                relative flex min-h-9 items-center justify-center rounded-md border px-2 py-1.5 text-center text-[11px] font-semibold leading-tight transition-all duration-200 sm:min-h-10 sm:px-3 sm:py-2 sm:text-xs
                                ${isSelected
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/40'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-white">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                            {option.label}
                        </button>
                    )
                })}
            </div>
            
            {customKey && currentValue === "other" && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                    <input
                        id={`rfq-${String(customKey)}`}
                        name={String(customKey)}
                        type="text"
                        placeholder={customPlaceholder}
                        value={data[customKey] as string}
                        onChange={(e) => onChange({ [customKey]: e.target.value })}
                        className={(required && !(data[customKey] as string).trim()) ? requiredInputClass : inputClass}
                        style={(required && !(data[customKey] as string).trim()) ? requiredInputStyle : undefined}
                    />
                </div>
            )}
        </div>
    )

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="rfq-firstName" className={requiredLabelClass}>{t("step1.firstNameLabel")}{requiredMark}</label>
                        <input
                            id="rfq-firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={data.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            className={data.firstName.trim() ? inputClass : requiredInputClass}
                            style={data.firstName.trim() ? undefined : requiredInputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="rfq-lastName" className={requiredLabelClass}>{t("step1.lastNameLabel")}{requiredMark}</label>
                        <input
                            id="rfq-lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={data.lastName}
                            onChange={(e) => onChange({ lastName: e.target.value })}
                            className={data.lastName.trim() ? inputClass : requiredInputClass}
                            style={data.lastName.trim() ? undefined : requiredInputStyle}
                        />
                    </div>

                    <div className="col-span-2">
                    <label htmlFor="rfq-companyName" className={labelClass}>{t("step1.companyLabel")}</label>
                    <input
                        id="rfq-companyName"
                        name="companyName"
                        type="text"
                        autoComplete="organization"
                        value={data.companyName}
                        onChange={(e) => onChange({ companyName: e.target.value })}
                        className={inputClass}
                    />
                    </div>

                    <div className="col-span-2">
                    <label htmlFor="rfq-country" className={requiredLabelClass}>{t("step1.countryLabel")}{requiredMark}</label>
                    <div className="relative">
                        <select
                            id="rfq-country"
                            name="country"
                            autoComplete="country-name"
                            value={data.country}
                            onChange={(e) => onChange({ country: e.target.value })}
                            className={`
                                h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-1 text-xs ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 sm:h-10 sm:text-sm
                                ${data.country ? 'text-slate-900' : 'text-slate-500'}
                            `}
                        >
                            <option value="" disabled>{t("step1.countryPlaceholder")}</option>
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                            </svg>
                        </div>
                    </div>
                    </div>

                    <div className="col-span-2">
                        {renderSelectionGroup(t("step1.industryLabel"), industries, data.industry, "industry", "customIndustry", t("step1.customIndustryPlaceholder"), true)}
                    </div>
                </div>
             </div>
        </div>
    )
}
