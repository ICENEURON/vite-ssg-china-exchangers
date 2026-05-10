import { ArrowRight, Clock3, Gauge, MapPin, PackageSearch } from "lucide-react"
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from "react-i18next"

interface RankingSignal {
    order: number;
    overallScore: number;
    responseTime: "within_24h" | "within_3_days" | "within_1_week" | "unknown" | "n/a";
    responseTierRank: number;
    productCount: number;
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
    const responseLabel = t(`response_tiers.${company.ranking.responseTime}`);
    const metrics = [
        {
            label: t("metrics.profile"),
            value: company.ranking.overallScore,
            icon: Gauge,
            className: "border-slate-200 bg-slate-50",
        },
        {
            label: t("metrics.response"),
            value: responseLabel,
            icon: Clock3,
            className: "border-blue-500/20 bg-blue-50",
        },
        {
            label: t("metrics.products"),
            value: company.ranking.productCount,
            icon: PackageSearch,
            className: "border-amber-500/25 bg-amber-50",
        },
    ];

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

                <div className="mt-4 grid grid-cols-3 gap-2 md:hidden">
                    {metrics.map((metric) => (
                        <div key={metric.label} className={`flex min-h-16 flex-col items-center justify-center rounded-xl border text-center shadow-sm transition-colors duration-300 ${metric.className}`}>
                            <div className="text-[11px] font-semibold leading-tight text-zinc-600">{metric.label}</div>
                            <div className="mt-1 text-sm font-extrabold leading-tight text-foreground">{metric.value}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 hidden grid-cols-3 gap-2 md:grid">
                    {metrics.map((metric) => {
                        const MetricIcon = metric.icon;

                        return (
                            <div
                                key={metric.label}
                                className={`group/metric relative flex min-h-12 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 shadow-sm transition-colors duration-300 ${metric.className}`}
                                aria-label={`${metric.label}: ${metric.value}`}
                            >
                                <MetricIcon className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                                <span className="text-xs font-semibold leading-none text-foreground">{metric.value}</span>
                                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-44 -translate-x-1/2 rounded-md bg-zinc-950 px-2.5 py-1.5 text-center text-xs font-semibold leading-tight text-white opacity-0 shadow-lg transition-opacity group-hover/metric:opacity-100">
                                    {metric.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

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
