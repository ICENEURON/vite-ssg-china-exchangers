
import { Check } from "lucide-react"

export type ProductType = "phe" | "shell" | "spares"

interface ProductSelectorProps {
    selected: ProductType
    onSelect: (value: ProductType) => void
}

const products = [
    { id: "phe", label: "Plate Heat Exchanger", icon: "🍱", desc: "Gasketed, Brazed, or Welded types." },
    { id: "shell", label: "Shell & Tube", icon: "🏺", desc: "High pressure or TEMA standard units." },
    { id: "spares", label: "Spare Parts", icon: "⚙️", desc: "Plates, Gaskets, or replacement bundles." },
]

export function ProductSelector({ selected, onSelect, application, onApplicationChange }: ProductSelectorProps & { application?: string, onApplicationChange?: (v: string) => void }) {
    const applications = [
        "HVAC & Building Services",
        "Food & Beverage",
        "Chemical Processing",
        "Marine & Offshore",
        "Power Generation",
        "General Industrial / Other"
    ];

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => {
                    const isSelected = selected === p.id
                    return (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p.id as ProductType)}
                            className={`
                    relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 text-center
                    ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary'
                                    : 'border-slate-200 dark:border-slate-800 bg-card hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'}
                `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 bg-gradient-to-br from-primary to-orange-500 text-white rounded-full p-1 shadow-md">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            <span className="text-4xl mb-4">{p.icon}</span>
                            <span className={`text-base font-bold mb-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {p.label}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{p.desc}</span>
                        </button>
                    )
                })}
            </div>

            {application !== undefined && onApplicationChange && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Intended Application / Industry</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {applications.map(app => (
                            <button
                                key={app}
                                onClick={() => onApplicationChange(app)}
                                className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${application === app
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/40'
                                    }`}
                            >
                                {app}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
