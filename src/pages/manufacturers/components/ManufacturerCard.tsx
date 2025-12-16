import { BadgeCheck, MapPin, Factory, ArrowRight } from "lucide-react"
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button"
import { useTranslation } from "react-i18next"

interface ManufacturerProps {
    id: string;
    name: string;
    location: string;
    verified: boolean;
    description: string;
    tags: string[];
    link: string;
}

export function ManufacturerCard({ company }: { company: ManufacturerProps }) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.manufacturers.card" });

    return (
        <div className="group w-full bg-card/60 border border-border/40 rounded-2xl p-8 hover:shadow-xl flex flex-col md:flex-row gap-6 overflow-hidden relative">
            <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-navbar/90 flex items-center justify-center">
                    <Factory className="w-8 h-8 text-muted-foreground" />
                </div>
            </div>

            {/* Verified Badge - Absolute Positioning */}
            {company.verified && (
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded shrink-0 width-fit z-10 transition-transform group-hover:scale-105">
                    <Badge variant="secondary" className="bg-green-200/40 text-accent border-green-600/50 hover:bg-green-200 px-2 py-1 text-sm">
                        <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-bold text-green-600">{t("verified")}</span>
                    </Badge>
                </div>
            )}

            <div className="flex-1 min-w-0 pr-8"> {/* Added padding-right to prevent overlap with badge */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors min-w-0 leading-tight">
                        {company.name}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground italic mb-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                    </div>
                </div>

                <p className="text-muted leading-relaxed mb-4 text-sm line-clamp-5">
                    {company.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {company.tags.map(tag => (
                        <span key={tag}>
                            <Badge variant="secondary" className="bg-blue-200/40 text-accent border-blue-600/50 hover:bg-blue-200 px-2 py-1 text-sm">
                                <span className="text-xs font-bold text-blue-600">{tag}</span>
                            </Badge>
                        </span>
                    ))}
                </div>
            </div>

            {/* Action */}
            <div className="flex flex-col justify-end shrink-0">
                <Button className="w-full md:w-auto rounded-full group-hover:bg-primary" asChild>
                    <a href={company.link}>
                        {t("view_profile")}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </Button>
            </div>
        </div>
    )
}
