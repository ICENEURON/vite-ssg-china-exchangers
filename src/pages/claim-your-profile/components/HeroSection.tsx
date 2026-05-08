
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge";
import { CheckCircle2, FileText, ImagePlus, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HeroSection() {
    const { t } = useTranslation();
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const highlights = t("pages.profile.hero.highlights", { returnObjects: true }) as string[];
    const panelItems = t("pages.profile.hero.panel.items", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const panelIcons = [FileText, ImagePlus, Mail];
    const subject = encodeURIComponent(t("pages.profile.hero.email_subject"));

    return (
        <section className="relative overflow-hidden bg-slate-50 px-2 py-16 flex flex-col items-center justify-center w-full">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none" />

            <div className="container relative mx-auto max-w-6xl pt-16">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                        <Badge variant="outline" className="border-primary/20 bg-white px-4 py-2 text-primary shadow-sm">
                            {t("pages.profile.hero.status_badge")}
                        </Badge>

                        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
                            {t('pages.profile.hero.title')}
                        </h1>

                        <p className="max-w-2xl text-lg leading-8 text-slate-600">
                            {t('pages.profile.hero.description')}
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 pt-2 lg:justify-start">
                            {highlights.map((highlight) => (
                                <div key={highlight} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                                    <CheckCircle2 className="size-4 text-primary" />
                                    {highlight}
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="mt-3 h-14 px-8 text-base font-bold" asChild>
                            <a href={`mailto:${email}?subject=${subject}`}>
                                <Mail className="mr-2 size-5" />
                                {t('pages.profile.hero.cta')}
                            </a>
                        </Button>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                            {t('pages.profile.hero.panel.eyebrow')}
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-slate-950">
                            {t('pages.profile.hero.panel.title')}
                        </h2>
                        <div className="mt-6 grid gap-4">
                            {panelItems.map((item, index) => {
                                const Icon = panelIcons[index] || FileText;

                                return (
                                    <div key={item.title} className="flex gap-4 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-950">{item.title}</h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
