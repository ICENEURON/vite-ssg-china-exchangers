import { useTranslation } from "react-i18next";
import { Badge } from "../../../components/ui/badge";
import { Mail } from "lucide-react";

export function ContactHero() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative py-10 px-2 min-h-96 flex flex-col justify-start items-center w-full bg-gradient-to-b from-slate-50 from-95% to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_100%_80%_at_0%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="relative pt-16 max-w-5xl mx-auto flex flex-col justify-center items-center gap-4 z-10">
                <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 p-2 text-sm text-center">
                    {t("pages.contact.hero.badge")}
                </Badge>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full p-2">
                    <div className="p-4 bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1] text-center">
                        {t("pages.contact.hero.title")}
                    </h1>
                </div>

                <p className="text-lg md:text-xl max-w-4xl text-primary font-medium w-full text-center px-4">
                    {t("pages.contact.hero.subtitle")}
                </p>

                <p className="text-lg max-w-4xl text-slate-600 dark:text-slate-300 w-full text-center leading-relaxed font-light px-4">
                    {t("pages.contact.hero.description")}
                </p>
            </div>
        </section>
    );
}
