
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

export function ProductSelector({ selected, onSelect }: ProductSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {products.map((p) => {
                const isSelected = selected === p.id
                return (
                    <button
                        key={p.id}
                        onClick={() => onSelect(p.id as ProductType)}
                        className={`
                relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 text-center
                ${isSelected
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-600'
                                : 'border-muted bg-card hover:border-blue-400/50 hover:bg-muted/50'}
            `}
                    >
                        {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <span className="text-3xl mb-3">{p.icon}</span>
                        <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>
                            {p.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{p.desc}</span>
                    </button>
                )
            })}
        </div>
    )
}
