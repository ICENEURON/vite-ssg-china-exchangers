
import { Button } from "../../../components/ui/button"
import { CheckCircle2, Download, FileText, ImagePlus, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"

const templatePath = "/static/websites/manufacturer-profile-update-template.docx";

export function HeroSection() {
    const { t } = useTranslation();
    const highlights = t("pages.profile.hero.highlights", { returnObjects: true }) as string[];
    const panelItems = t("pages.profile.hero.panel.items", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const panelIcons = [FileText, ImagePlus, Mail];

    return (
        <section className="relative overflow-hidden bg-slate-50 px-2 py-16 flex flex-col items-center justify-center w-full">
            <div className="absolute inset-0 bg-grid-hero-center pointer-events-none" />

            <div className="container relative mx-auto max-w-6xl pt-16 px-4">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                    <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
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

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                            <Button size="lg" className="h-14 px-8 text-base font-bold" asChild>
                                <a href={templatePath} download>
                                    <Download className="mr-2 size-5" />
                                    {t('pages.profile.hero.template_cta')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <div className="grid gap-4">
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
