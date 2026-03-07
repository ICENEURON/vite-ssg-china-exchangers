import { useTranslation } from "react-i18next";
import { Badge } from "../../../components/ui/badge";
import { Mail } from "lucide-react";

export function ContactHero() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative pt-24 pb-8 px-4 flex flex-col items-center text-center bg-gradient-to-b from-slate-50 from-95% to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_100%_80%_at_0%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="relative max-w-5xl mx-auto px-6 space-y-4 z-10 flex flex-col items-center">
                <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 px-4 py-1 text-sm">
                    {t("pages.contact.hero.badge")}
                </Badge>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg shadow-primary/20">
                        <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
                        {t("pages.contact.hero.title")}
                    </h1>
                </div>

                <p className="text-lg md:text-xl text-primary font-medium max-w-2xl mx-auto">
                    {t("pages.contact.hero.subtitle")}
                </p>

                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                    {t("pages.contact.hero.description")}
                </p>
            </div>
        </section>
    );
}
