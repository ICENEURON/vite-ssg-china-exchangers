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
        <section className="py-20 px-4 bg-white dark:bg-slate-950">
            <div className="container mx-auto max-w-6xl space-y-12">
                <div className="text-center space-y-4">
                    <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 px-4 py-1 text-sm">
                        {t("pages.contact.reasons.badge")}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {t("pages.contact.reasons.title")}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light">
                        {t("pages.contact.reasons.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasonKeys.map((key) => {
                        const Icon = reasonIcons[key];
                        return (
                            <Card key={key} className="group p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-orange-500/20 transition-colors duration-300">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                        {t(`pages.contact.reasons.items.${key}.title`)}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                        {t(`pages.contact.reasons.items.${key}.description`)}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
