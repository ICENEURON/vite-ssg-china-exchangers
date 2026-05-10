
import { Building2, Factory, FileText, ImagePlus } from "lucide-react"
import { useTranslation } from "react-i18next"

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
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('pages.profile.update_scope.title')}</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">{t('pages.profile.update_scope.description')}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, index) => {
                        const Icon = icons[index] || FileText;

                        return (
                            <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <Icon className="size-6 shrink-0" />
                                    <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                                </div>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
