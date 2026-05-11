import { ArrowRight, MapPin } from "lucide-react"
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from "react-i18next"

interface RankingSignal {
    order: number;
}

interface ManufacturerProps {
    id: string;
    name: string;
    location: string;
    description: string;
    tags: string[];
    link: string;
    ranking: RankingSignal;
}

export function ManufacturerCard({ company }: { company: ManufacturerProps }) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.manufacturers.card" });

    return (
        <article className="group flex h-full flex-col overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-blue-50/20 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex items-start">
                <a href={company.link} className="min-w-0 flex-1">
                    <div className="h-14 overflow-hidden">
                        <h3
                            className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                            style={{ fontSize: "22px", lineHeight: "28px" }}
                        >
                            {company.name}
                        </h3>
                    </div>
                </a>
            </div>

            <div className="mt-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-700">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-orange-500" />
                        <span className="truncate">{company.location}</span>
                    </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-zinc-700">
                    {company.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {company.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="rounded-full border-blue-600/20 bg-blue-200/30 px-2 py-0.5 text-[11px] font-bold text-blue-700 hover:bg-blue-200/30">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-4">
                <a href={company.link} className="flex items-center text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-orange-600">
                    {t("view_profile")}
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                </a>
            </div>
        </article>
    )
}
