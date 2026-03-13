import { FieldSet, FieldLabel } from "../../../components/ui/field"
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
    timeline: string;
    customTimeline: string;
    quantity: string;
    customQuantity: string;
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
    const quantities = t("quantities", { returnObjects: true }) as {id: string, label: string}[];
    const timelines = t("timelines", { returnObjects: true }) as {id: string, label: string}[];

    // Helper to render a selection group using simple grid of buttons
    const renderSelectionGroup = (
        label: string, 
        options: {id: string, label: string}[], 
        currentValue: string, 
        fieldKey: keyof RqfContextData,
        customKey?: keyof RqfContextData,
        customPlaceholder?: string
    ) => (
        <FieldSet className="mb-8">
            <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{label}</FieldLabel>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {options.map((option) => {
                    const isSelected = currentValue === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onChange({ [fieldKey]: option.id })}
                            className={`
                                relative flex items-center justify-center text-center px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium leading-tight
                                ${isSelected
                                    ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/50'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:border-primary/40'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full p-0.5">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                            )}
                            {option.label}
                        </button>
                    )
                })}
            </div>
            
            {customKey && currentValue === "other" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        type="text"
                        placeholder={customPlaceholder}
                        value={data[customKey] as string}
                        onChange={(e) => onChange({ [customKey]: e.target.value })}
                        className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                    />
                </div>
            )}
        </FieldSet>
    )

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <FieldSet>
                        <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{t("step1.firstNameLabel")} <span className="text-red-500">*</span></FieldLabel>
                        <input
                            type="text"
                            value={data.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            placeholder={t("step1.firstNamePlaceholder")}
                            className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                        />
                    </FieldSet>
                    <FieldSet>
                        <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{t("step1.lastNameLabel")} <span className="text-red-500">*</span></FieldLabel>
                        <input
                            type="text"
                            value={data.lastName}
                            onChange={(e) => onChange({ lastName: e.target.value })}
                            placeholder={t("step1.lastNamePlaceholder")}
                            className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                        />
                    </FieldSet>
                </div>

                <FieldSet className="mb-8">
                    <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{t("step1.companyLabel")}</FieldLabel>
                    <input
                        type="text"
                        value={data.companyName}
                        onChange={(e) => onChange({ companyName: e.target.value })}
                        placeholder={t("step1.companyPlaceholder")}
                        className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                    />
                </FieldSet>

                <FieldSet className="mb-8">
                    <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{t("step1.countryLabel")}</FieldLabel>
                    <div className="relative">
                        <select
                            value={data.country}
                            onChange={(e) => onChange({ country: e.target.value })}
                            className={`
                                flex h-12 w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 appearance-none
                                ${data.country ? 'border-primary/50 ring-1 ring-primary/30 text-slate-900 dark:text-slate-100' : 'border-slate-200 dark:border-slate-800 text-slate-500'}
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
                </FieldSet>

                {renderSelectionGroup(t("step1.industryLabel"), industries, data.industry, "industry", "customIndustry", t("step1.customIndustryPlaceholder"))}
                {renderSelectionGroup(t("step1.quantityLabel"), quantities, data.quantity, "quantity", "customQuantity", t("step1.customQuantityPlaceholder"))}
                {renderSelectionGroup(t("step1.timelineLabel"), timelines, data.timeline, "timeline", "customTimeline", t("step1.customTimelinePlaceholder"))}
             </div>
        </div>
    )
}
