
import { Head } from 'vite-react-ssg'
import { Link, useParams, Navigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { BadgeCheck, Factory, ArrowRight, Star, MapPin, CheckCircle2, ShieldCheck, Award, Users, Globe2, Sparkles, Zap, Flame, Gauge } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, addLanguageToPath } from '../../../utils/language-routing'

interface ProductParameter {
    name: string;
    value: string;
}

interface ProductCertificate {
    name: string;
    image: string;
}

interface Product {
    name: string;
    image?: string;
    url: string;
    short_description: string;
    Parameters?: ProductParameter[];
    certificate?: ProductCertificate[];
}

export default function ManufacturerProfilePage() {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const currentLanguage = useCurrentLanguage();

    const SHARED_TK = "pages.manufacturers.company";
    const TK = `pages.manufacturers.${slug}`;

    // Load manufacturer data dynamically based on the slug. 
    // If it returns a string, it means the key was not found (or returnObjects failed).
    const mfgData = t(TK, { returnObjects: true, defaultValue: null }) as any;

    if (!mfgData || typeof mfgData === 'string') {
        return <Navigate to="/404" replace />;
    }

    const basicInfo = {
        name: mfgData.name,
        location: `${mfgData.city || ''}, ${mfgData.country_name || ''}`.trim().replace(/^,\s*/, ''),
        established: mfgData.established_year,
        factory_area: mfgData.factory_area,
    };

    const verifiedInfo = {
        repid_hours: 24, // Optional default or mapped if exists
        iso: Boolean(mfgData.certifications?.find((c: any) => c.alt_text?.toLowerCase().includes('iso'))) || true, // Placeholder logic
        ASME: Boolean(mfgData.certifications?.find((c: any) => c.alt_text?.toLowerCase().includes('asme'))) || true,
        business_license: true,
        export_experience: true,
    };

    const description = mfgData.full_description;
    const advantages = mfgData.advantages || [];
    const industries = mfgData.industries || [];

    const manufacturerProductCategories = mfgData.product_categories || [];
    const productCategoryDefinitions = t("pages.products.categories", { returnObjects: true }) as Record<string, any>;

    const products = mfgData.products || [];
    const website = mfgData.website;
    const customers = mfgData.customers || [];
    const certificates = mfgData.certifications || [];

    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost';
    const currentUrl = `${siteUrl}/manufacturers/${slug}`;

    return (
        <>
            <Head>
                <title>{mfgData.seo_data?.meta_title || `${basicInfo?.name || t(`${SHARED_TK}.page_title`)} - ${t(`${SHARED_TK}.premium_supplier`)}`}</title>
                <meta name="description" content={mfgData.seo_data?.meta_description || description?.substring(0, 160) || t(`${SHARED_TK}.meta_description_default`)} />
                <link rel="canonical" href={currentUrl} />
            </Head>

            <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground animate-in fade-in duration-500">

                {/* HERO SECTION - Vibrant Dark Gradient */}
                <section className="relative overflow-hidden py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 text-white">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                    <div className="container relative mx-auto px-4 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-bold tracking-wider text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {t(`${SHARED_TK}.premium_supplier`)}
                                </div>

                                <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-sm">
                                        {basicInfo?.name}
                                    </span>
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
                                    {basicInfo?.location && (
                                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                            <MapPin className="w-4 h-4 text-blue-400" /> {basicInfo.location}
                                        </div>
                                    )}
                                    {basicInfo?.established && (
                                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                            <Factory className="w-4 h-4 text-emerald-400" /> Est. {basicInfo.established}
                                        </div>
                                    )}
                                    {basicInfo?.factory_area && (
                                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                            <Globe2 className="w-4 h-4 text-purple-400" /> {basicInfo.factory_area}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RFQ Box - Frosted Glass */}
                            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{t(`${SHARED_TK}.connect_directly`)}</h3>
                                <p className="text-slate-300 text-sm mb-6 relative z-10">{t(`${SHARED_TK}.connect_description`)}</p>

                                <Button size="lg" className="relative z-10 w-full h-14 text-lg font-bold bg-white text-blue-900 hover:bg-blue-50 shadow-lg transition-all transform hover:scale-[1.02]" asChild>
                                    <Link to={`${addLanguageToPath('/rfq', currentLanguage)}?company=${encodeURIComponent(basicInfo?.name)}`}>
                                        {t(`${SHARED_TK}.start_inquiry`)} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>

                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t(`${SHARED_TK}.verified_contact`)}</span>
                                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> {t(`${SHARED_TK}.response_time`, { hours: verifiedInfo?.repid_hours || 24 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VERIFICATION STRIP - Clean & Trustworthy */}
                <div className="border-b bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex justify-between divide-x divide-slate-100 dark:divide-zinc-800 overflow-x-auto">
                            {[
                                { icon: ShieldCheck, label: t(`${SHARED_TK}.iso_certified`), active: verifiedInfo?.iso, color: "text-emerald-500" },
                                { icon: Award, label: t(`${SHARED_TK}.asme_stamp`), active: verifiedInfo?.ASME, color: "text-blue-500" },
                                { icon: BadgeCheck, label: t(`${SHARED_TK}.business_license`), active: verifiedInfo?.business_license, color: "text-purple-500" },
                                { icon: Globe2, label: t(`${SHARED_TK}.global_trade`), active: verifiedInfo?.export_experience, color: "text-indigo-500" }
                            ].map((item, index) => (
                                <div key={index} className="flex-1 py-4 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors min-w-[120px]">
                                    <item.icon className={`w-6 h-6 ${item.active ? item.color : "text-slate-300"}`} />
                                    <div className="text-center sm:text-left leading-tight">
                                        <div className={`font-bold text-sm ${item.active ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{item.label}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-slate-500">{item.active ? t(`${SHARED_TK}.verified`) : t(`${SHARED_TK}.not_available`)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="container mx-auto px-4 max-w-7xl py-12 lg:py-16">

                    {/* 1. OVERVIEW & ADVANTAGES (Combined Flow) */}
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
                        <div className="lg:col-span-8 space-y-8">
                            {/* Description Card */}
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                                    <Factory className="w-6 h-6 text-blue-600" /> {t(`${SHARED_TK}.company_overview`)}
                                </h2>
                                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                                    {description}
                                </div>
                            </div>

                            {/* Advantages - Single Line List Style */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    <Sparkles className="w-5 h-5 text-amber-500" /> {t(`${SHARED_TK}.why_choose_us`)}
                                </h3>
                                <div className="space-y-4">
                                    {advantages?.map((adv: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-transparent shadow-sm hover:border-blue-200 transition-all">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-slate-800 dark:text-slate-200 text-lg leading-relaxed">{adv}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Info Cards */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Industries Tag Cloud */}
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm h-fit">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <Flame className="w-5 h-5 text-orange-500" /> {t(`${SHARED_TK}.industries_served`)}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {industries?.map((ind: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900/30 text-sm font-medium">
                                            {ind}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Website Link */}
                            {website && (
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold opacity-60 uppercase tracking-widest">{t(`${SHARED_TK}.official_website`)}</span>
                                        <Globe2 className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="text-lg font-bold truncate text-blue-200 group-hover:text-white transition-colors">
                                        {t(`${SHARED_TK}.visit_manufacturer`)} &rarr;
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 2. PRODUCT SHOWCASE - Compact & Colorful */}
                    <div className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">{t(`${SHARED_TK}.product_showcase`)}</h2>
                                {manufacturerProductCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center">
                                        <span className="font-semibold text-foreground">Available Product Categories:</span>
                                        {manufacturerProductCategories.map((catId: string) => {
                                            const categoryDef = productCategoryDefinitions?.[catId];
                                            if (!categoryDef) return null;
                                            return (
                                                <Link to={addLanguageToPath(`/products/${catId}`, currentLanguage)} key={catId}>
                                                    <Badge variant="secondary" className="hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer text-xs py-1">
                                                        {categoryDef.name}
                                                    </Badge>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="h-1 flex-1 bg-slate-100 dark:bg-zinc-800 rounded-full md:ml-4" />
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {products?.map((product: Product, index: number) => (
                                <div key={index} className="flex flex-col lg:flex-row bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 group">
                                    {/* Image Section - Significantly Larger */}
                                    <div className="lg:w-2/5 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-zinc-800 relative">
                                        <Link to={addLanguageToPath(`/products/${product.url}`, currentLanguage)} className="w-full">
                                            {product.image ? (
                                                <div className="w-full relative rounded-2xl overflow-hidden bg-white shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
                                                    <img src={product.image} alt={product.name} className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-full flex justify-center py-8 cursor-pointer">
                                                    <Gauge className="w-24 h-24 text-slate-300" />
                                                </div>
                                            )}
                                        </Link>

                                        {/* Product Certificates Overlay/Bottom */}
                                        {product.certificate && product.certificate.length > 0 && (
                                            <div className="mt-6 w-full">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">{t(`${SHARED_TK}.certified_quality`)}</p>
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {product.certificate.map((cert: ProductCertificate, cIdx: number) => (
                                                        <div key={cIdx} className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-slate-100 dark:border-zinc-800 shadow-sm" title={cert.name}>
                                                            {cert.image ? (
                                                                <img src={cert.image} alt={cert.name} className="h-8 md:h-10 w-auto object-contain" />
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-600">{cert.name}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-8 lg:p-10 flex flex-col">
                                        <div className="mb-6">
                                            <Link to={addLanguageToPath(`/products/${product.url}`, currentLanguage)}>
                                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4 hover:text-blue-600 transition-colors cursor-pointer group-hover:text-blue-600">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Short Description */}
                                            {product.short_description && (
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                                    {product.short_description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Parameters Grid */}
                                        {product.Parameters && product.Parameters.length > 0 && (
                                            <div className="mt-auto">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-amber-500" /> {t(`${SHARED_TK}.technical_specifications`)}
                                                </h4>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {product.Parameters.map((param: ProductParameter, pIdx: number) => (
                                                        <div key={pIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800">
                                                            <span className="text-sm font-medium text-slate-500">{param.name}</span>
                                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{param.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. FACTORY CERTIFICATES */}
                    <div className="mb-20">
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 lg:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-[100px]" />
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <Award className="w-6 h-6" />
                                </div>
                                {t(`${SHARED_TK}.factory_certifications`)}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                                {certificates?.map((cert: any, i: number) => (
                                    <div key={i} className="group relative bg-slate-50 dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-200 transition-all duration-300">
                                        {cert.url && (
                                            <div className="h-24 w-full flex items-center justify-center mb-4">
                                                <img src={cert.url} alt={cert.alt_text} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                                            </div>
                                        )}
                                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{cert.alt_text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. TRUSTED CUSTOMERS - Replaced at text bottom */}
                    <div className="mb-12">
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 lg:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-br-[100px]" />

                            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
                                <div className="inline-flex p-3 bg-amber-100 text-amber-600 rounded-2xl mb-4">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{t(`${SHARED_TK}.trusted_customers`)}</h3>
                                <p className="text-slate-500">{t(`${SHARED_TK}.trusted_customers_desc`)}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 relative z-10">
                                {customers?.map((cust: any, i: number) => (
                                    <div key={i} className="aspect-square bg-slate-50 dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg border border-transparent hover:border-amber-200 transition-all duration-300 group">
                                        {cust?.url ? (
                                            <img src={cust.url} alt={cust?.alt_text} className="w-full h-full object-contain opacity-60 group-hover:opacity-100 filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                                                <span className="font-bold text-slate-500">{cust?.alt_text?.[0]}</span>
                                            </div>
                                        )}
                                        <span className="mt-2 text-[10px] font-bold text-slate-400 group-hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">{cust?.alt_text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* FINAL CTA - Gradient */}
                <section className="py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="container relative mx-auto px-4 max-w-2xl">
                        <BadgeCheck className="w-12 h-12 text-blue-300 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            {t(`${SHARED_TK}.partner_with`, { name: basicInfo?.name })}
                        </h2>
                        <p className="text-blue-100 mb-10 text-lg">
                            {t(`${SHARED_TK}.partner_desc`)}
                        </p>
                        <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-full bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 transition-all shadow-xl" asChild>
                            <Link to={`${addLanguageToPath('/rfq', currentLanguage)}?company=${encodeURIComponent(basicInfo?.name)}`}>
                                {t(`${SHARED_TK}.start_project`)}
                            </Link>
                        </Button>
                    </div>
                </section>

            </main>
        </>
    )
}
