
import { Building2, Factory, FileText, ImagePlus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "../../../components/ui/button";

const templatePath = "/static/websites/manufacturer-profile-update-template.docx";

export function BenefitsSection() {
    const { t } = useTranslation();
    const items = t("pages.profile.update_scope.items", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const icons = [Building2, Factory, FileText, ImagePlus];

    return (
        <section className="bg-white px-2 py-14 flex flex-col items-center">
            <div className="container mx-auto max-w-6xl flex flex-col gap-8 p-4">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('pages.profile.update_scope.eyebrow')}</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('pages.profile.update_scope.title')}</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">{t('pages.profile.update_scope.description')}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, index) => {
                        const Icon = icons[index] || FileText;

                        return (
                            <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                            </article>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-3xl">
                        <h3 className="text-xl font-bold text-slate-950">{t('pages.profile.update_scope.template.title')}</h3>
                        <p className="mt-2 text-base leading-7 text-slate-700">{t('pages.profile.update_scope.template.description')}</p>
                        <p className="mt-3 text-sm font-semibold text-primary">{t('pages.profile.update_scope.template.status')}</p>
                    </div>
                    <Button className="w-full shrink-0 md:w-auto" asChild>
                        <a href={templatePath} download>
                            {t('pages.profile.update_scope.template.cta')}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
