import { useTranslation } from "react-i18next"

export function VerificationSection() {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col items-center bg-slate-50 px-2 pt-8 md:pt-8">
            <div className="container mx-auto flex max-w-6xl flex-col gap-8 p-4">
                <div className="max-w-5xl">
                    <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                        {t('pages.profile.process.title')}
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        {t('pages.profile.process.description')}
                    </p>
                </div>
            </div>
        </section>
    )
}