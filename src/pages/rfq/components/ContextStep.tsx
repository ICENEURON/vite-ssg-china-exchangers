import { FieldSet, FieldLabel } from "../../../components/ui/field"
import { Check } from "lucide-react"
import { getNames } from "country-list"
import rfqData from "../../../data/rfq.json"

export interface RqfContextData {
    country: string;
    industry: string;
    customIndustry: string;
    timeline: string;
    quantity: string;
}

interface ContextStepProps {
    data: RqfContextData;
    onChange: (data: Partial<RqfContextData>) => void;
}

const rawCountries = getNames()
const COUNTRIES = rawCountries
    .filter(c => {
        const lower = c.toLowerCase()
        return !lower.includes("hong kong") && !lower.includes("macao") && !lower.includes("macau") && !lower.includes("taiwan")
    })
    .concat(["Hong Kong, China", "Macao, China", "Taiwan, China"])
    .sort()

export function ContextStep({ data, onChange }: ContextStepProps) {

    // Helper to render a selection group using simple grid of buttons
    const renderSelectionGroup = (
        label: string, 
        options: string[], 
        currentValue: string, 
        fieldKey: keyof RqfContextData
    ) => (
        <FieldSet className="mb-8">
            <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">{label}</FieldLabel>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {options.map((option) => {
                    const isSelected = currentValue === option;
                    return (
                        <button
                            key={option}
                            onClick={() => onChange({ [fieldKey]: option })}
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
                            {option}
                        </button>
                    )
                })}
            </div>
            
            {fieldKey === "industry" && currentValue === "Other" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        type="text"
                        placeholder="Please specify your industry..."
                        value={data.customIndustry}
                        onChange={(e) => onChange({ customIndustry: e.target.value })}
                        className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                    />
                </div>
            )}
        </FieldSet>
    )

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
                
                <FieldSet className="mb-8">
                    <FieldLabel className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">Destination Country / Region</FieldLabel>
                    <div className="relative">
                        <select
                            value={data.country}
                            onChange={(e) => onChange({ country: e.target.value })}
                            className={`
                                flex h-12 w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 appearance-none
                                ${data.country ? 'border-primary/50 ring-1 ring-primary/30 text-slate-900 dark:text-slate-100' : 'border-slate-200 dark:border-slate-800 text-slate-500'}
                            `}
                        >
                            <option value="" disabled>Select a country...</option>
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

                {renderSelectionGroup("Industry / Application", rfqData.industries, data.industry, "industry")}
                {renderSelectionGroup("Required Quantity", rfqData.quantities, data.quantity, "quantity")}
                {renderSelectionGroup("Expected Delivery Timeline", rfqData.timelines, data.timeline, "timeline")}
             </div>
        </div>
    )
}
