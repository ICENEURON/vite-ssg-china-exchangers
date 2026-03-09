import { Head } from 'vite-react-ssg'
import { Link, useParams, Navigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { CheckCircle2, Settings, Shield, Factory } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, addLanguageToPath } from '../../../utils/language-routing'

export default function ProductProfilePage() {
    const { manufacturerSlug, productSlug } = useParams<{ manufacturerSlug: string, productSlug: string }>();
    const { t } = useTranslation();
    const currentLanguage = useCurrentLanguage();

    // Construct dynamic path: pages.products.shanghai-heat-transfer-equipment-co-ltd.ht-bloc-welded-plate-heat-exchanger
    const TK = `pages.products.${manufacturerSlug}.${productSlug}`;

    // Load product data dynamically based on the slug. 
    // If it returns a string, it means the key was not found (or returnObjects failed).
    const productData = t(TK, { returnObjects: true, defaultValue: null }) as any;

    if (!productData || typeof productData === 'string') {
        return <Navigate to="/404" replace />;
    }

    const name = productData.name;
    const description = productData.full_description || productData.short_description;
    const advantages = productData.advantage || productData.advantages || [];
    const industries = productData.industries || [];
    const images = productData.images || [];
    const certificates = productData.certificates || [];

    // Technical parameters
    const technicalParams = productData.technical_parameters || {};
    const hasTechnicalParams = Object.keys(technicalParams).length > 0;

    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost';
    const currentUrl = `${siteUrl}/products/${manufacturerSlug}/${productSlug}`;

    const mainImage = images.length > 0 ? images[0].url : '/placeholder.jpg';

    return (
        <>
            <Head>
                <title>{productData.seo_data?.meta_title || `${name} - Product Details`}</title>
                <meta name="description" content={productData.seo_data?.meta_description || description?.substring(0, 160)} />
                <link rel="canonical" href={currentUrl} />
            </Head>

            <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground animate-in fade-in duration-500 pb-20">

                {/* Header Section */}
                <section className="bg-slate-900 border-b border-border/40 py-16 pt-24 mt-[-4rem]">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-12 items-center">

                            {/* Product Image */}
                            <div className="w-full md:w-1/2">
                                <div className="bg-white p-4 rounded-2xl shadow-xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 to-transparent pointer-events-none" />
                                    <img
                                        src={mainImage}
                                        alt={name}
                                        className="w-full h-auto object-cover rounded-xl border border-slate-100 mix-blend-multiply"
                                    />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
                                <Badge variant="secondary" className="bg-primary/20 text-blue-300 border-none px-4 py-1.5 backdrop-blur-md mb-2">
                                    {t("pages.products.hero.badge")}
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                    {name}
                                </h1>
                                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                                    {description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {industries.map((ind: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/50">
                                            {ind}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" asChild>
                                        <Link defaultChecked to={addLanguageToPath(`/manufacturers/${manufacturerSlug}`, currentLanguage)}>
                                            <Factory className="mr-2 h-5 w-5" /> {t("pages.products.detail.view_manufacturer")}
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white w-full sm:w-auto" asChild>
                                        <Link to={addLanguageToPath("/rfq", currentLanguage)}>
                                            {t("pages.products.detail.request_quote")}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="container max-w-6xl mx-auto px-6 py-16 space-y-24">

                    {/* Advantages */}
                    {advantages && advantages.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{t("pages.products.detail.key_advantages")}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {advantages.map((adv: string, idx: number) => (
                                    <div key={idx} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-card-foreground leading-relaxed font-medium">{adv}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Technical Parameters */}
                    {hasTechnicalParams && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{t("pages.products.detail.technical_specifications")}</h2>
                            </div>
                            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {Object.entries(technicalParams).map(([key, value], index) => (
                                            <tr key={key} className={`border-b border-border/50 last:border-0 ${index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'bg-transparent'}`}>
                                                <th className="py-4 px-6 font-semibold text-muted-foreground w-1/3 border-r border-border/50">{key}</th>
                                                <td className="py-4 px-6 text-card-foreground font-medium">{String(value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Certifications Map */}
                    {certificates && certificates.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-500">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{t("pages.products.detail.certifications")}</h2>
                            </div>
                            <div className="flex flex-wrap gap-6 items-center">
                                {certificates.map((cert: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[120px] hover:shadow-md transition-shadow">
                                        <img
                                            src={cert.url}
                                            alt={cert.alt_text || t("pages.products.detail.certificate_alt")}
                                            className="h-16 object-contain mix-blend-multiply"
                                            title={cert.alt_text}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </main>
        </>
    );
}
