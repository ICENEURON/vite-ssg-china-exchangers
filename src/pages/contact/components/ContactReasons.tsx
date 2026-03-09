import { useTranslation } from "react-i18next";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import {
    Search,
    Building2,
    Handshake,
    MessageSquare,
    Newspaper,
    HelpCircle,
} from "lucide-react";

const reasonIcons = {
    inquiry: Search,
    profile: Building2,
    partnership: Handshake,
    feedback: MessageSquare,
    media: Newspaper,
    other: HelpCircle,
};

const reasonKeys = ["inquiry", "profile", "partnership", "feedback", "media", "other"] as const;

export function ContactReasons() {
    const { t } = useTranslation("translation");

    return (
        <section className="pb-10 px-2 flex flex-col justify-center items-center max-w-6xl mx-auto relative overflow-hidden">
            <div className="w-full max-w-6xl mx-auto flex flex-col justify-center items-center p-6 gap-4">
                <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
                    <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 p-2 text-sm text-center">
                        {t("pages.contact.reasons.badge")}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-center">
                        {t("pages.contact.reasons.title")}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-light text-center p-2">
                        {t("pages.contact.reasons.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 w-full">
                    {reasonKeys.map((key) => {
                        const Icon = reasonIcons[key];
                        return (
                            <Card key={key} className="group flex flex-col items-center justify-center p-6 gap-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default text-center">
                                <div className="w-12 h-12 p-2 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-orange-500/20 transition-colors duration-300">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 text-center">
                                    {t(`pages.contact.reasons.items.${key}.title`)}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm text-center">
                                    {t(`pages.contact.reasons.items.${key}.description`)}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
