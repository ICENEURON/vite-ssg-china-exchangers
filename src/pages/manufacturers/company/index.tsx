
import { Head } from 'vite-react-ssg'
import { Link, useParams, Navigate } from "react-router-dom"
import { BadgeCheck, Factory, ArrowLeft, Star, MapPin, CheckCircle2, ShieldCheck, Award, Users, Globe2, Sparkles, Zap, Flame, Gauge, Mail, Phone, Linkedin, Youtube, ExternalLink, Download, FileText } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { ImageCarouselGallery, ZoomableImageGrid } from '../../../components/ui/interactive-image-gallery'
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, addLanguageToPath } from '../../../utils/language-routing'
import { QuoteCta } from '../../../components/ui/quote-cta'
import countriesData from '../../../data/countries.json'
import rankingSignals from '../../../data/manufacturer_ranking_signals.json'

interface ImageAsset {
    alt_text?: string;
    url: string;
    order?: number;
}

interface DocumentAsset {
    alt_text?: string;
    url: string;
    file_name?: string;
}

interface ManufacturerProductCategory {
    name?: string;
}

interface SocialMediaLink {
    url: string;
    platform: string;
    is_visible?: boolean;
}

interface CountryData {
    id: string;
    name: string;
    name_zh?: string;
}

type ResponseTimeTier = "within_24h" | "within_3_days" | "within_1_week" | "unknown";

interface ManufacturerRankingSignal {
    order: number;
    slug: string;
    profile_completeness_percent: number;
    response_time_tier: ResponseTimeTier;
    published_article_count: number;
}

interface ManufacturerRankingSignalFile {
    records: ManufacturerRankingSignal[];
}

interface ManufacturerData {
    name: string;
    city?: string;
    country_name?: string;
    address?: string;
    established_year?: string;
    factory_area?: string;
    employee_count?: string;
    full_description?: string | string[];
    advantages?: string[];
    industries?: string[];
    product_categories?: string[];
    products?: Product[];
    website?: string;
    video_link?: string;
    social_media_links?: SocialMediaLink[];
    email?: string[];
    phone?: string[];
    export_markets?: string[];
    certifications?: ImageAsset[];
    customers?: ImageAsset[];
    images?: ImageAsset[];
    documents?: DocumentAsset[];
    seo_data?: {
        meta_title?: string;
        meta_description?: string;
    };
}

interface ProductParameter {
    name: string;
    value: string;
}

interface ProductCertificate {
    name: string;
    image: string;
    order?: number;
}

interface Product {
    name: string;
    image?: string;
    url: string;
    short_description: string;
    Parameters?: ProductParameter[];
    certificate?: ProductCertificate[];
    order?: number;
}

function getDocumentDisplayName(document: DocumentAsset): string {
    if (document.file_name?.trim()) {
        return document.file_name.trim();
    }

    const lastSegment = document.url.split('/').pop()?.split('?')[0]?.split('#')[0];

    if (!lastSegment) {
        return 'document';
    }

    try {
        return decodeURIComponent(lastSegment);
    } catch {
        return lastSegment;
    }
}

export default function ManufacturerProfilePage() {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation();
    const currentLanguage = useCurrentLanguage();

    const SHARED_TK = "pages.manufacturers.company";
    const TK = `pages.manufacturers.${slug}`;
    const documentDownloadsTitle = t(`${SHARED_TK}.document_downloads`, { defaultValue: currentLanguage === 'zh' ? '文档下载' : 'Document Downloads' });
    const downloadLabel = t(`${SHARED_TK}.download`, { defaultValue: currentLanguage === 'zh' ? '下载' : 'Download' });

    // Load manufacturer data dynamically based on the slug. 
    // If it returns a string, it means the key was not found (or returnObjects failed).
    const mfgData = t(TK, { returnObjects: true, defaultValue: null }) as ManufacturerData | string | null;

    if (!mfgData || typeof mfgData === 'string') {
        return <Navigate to="/404" replace />;
    }

    const basicInfo = {
        name: mfgData.name,
        address: mfgData.address || `${mfgData.city || ''}, ${mfgData.country_name || ''}`.trim().replace(/^,\s*/, ''),
        established: mfgData.established_year,
        factory_area: mfgData.factory_area,
        employee_count: mfgData.employee_count,
    };

    const verifiedInfo = {
        iso: Boolean(mfgData.certifications?.find((certificate) => certificate.alt_text?.toLowerCase().includes('iso'))) || true,
        ASME: Boolean(mfgData.certifications?.find((certificate) => certificate.alt_text?.toLowerCase().includes('asme'))) || true,
        business_license: true,
        export_experience: true,
    };
    const rankingSignal = (rankingSignals as ManufacturerRankingSignalFile).records.find((record) => record.slug === slug);
    const profileCompleteness = rankingSignal?.profile_completeness_percent ?? 70;
    const responseTimeTier = rankingSignal?.response_time_tier ?? "unknown";
    const responseTimeLabel = t(`pages.manufacturers.card.response_tiers.${responseTimeTier}`);

    const description = mfgData.full_description;
    const advantages = mfgData.advantages || [];
    const industries = mfgData.industries || [];

    const manufacturerProductCategories = mfgData.product_categories || [];
    const productCategoryDefinitions = t("pages.products.categories", { returnObjects: true }) as Record<string, ManufacturerProductCategory>;

    const products = mfgData.products || [];
    const website = mfgData.website;
    const email = mfgData.email || [];
    const phone = mfgData.phone || [];
    const exportMarkets = mfgData.export_markets || [];
    const customers = mfgData.customers || [];
    const certificates = mfgData.certifications || [];
    const galleryImages = mfgData.images || [];
    const documents = mfgData.documents || [];
    const videoLink = mfgData.video_link;
    const socialMediaLinks = (mfgData.social_media_links || []).filter(l => l.is_visible !== false);
    const typedCountriesData = countriesData as CountryData[];

    // Convert YouTube URL to embeddable format
    function getYoutubeEmbedUrl(url: string): string | null {
        try {
            const u = new URL(url);
            if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
            if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
        } catch { /* ignore */ }
        return null;
    }

    const videoEmbedUrl = videoLink ? getYoutubeEmbedUrl(videoLink) : null;

    // Build gallery items: video first (if exists), then images
    const gallerySlides = [
        ...(videoEmbedUrl ? [{ type: 'video' as const, src: videoEmbedUrl, alt: `${basicInfo?.name} Video` }] : []),
        ...galleryImages.map(img => ({ type: 'image' as const, src: img.url, alt: img.alt_text || basicInfo?.name || 'Factory image' }))
    ];

    const socialIcons: Record<string, typeof Linkedin> = {
        linkedin: Linkedin,
        youtube: Youtube,
    };

    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost';
    const currentUrl = `${siteUrl}/manufacturers/${slug}`;

    return (
        <>
            <Head>
                <title>{mfgData.seo_data?.meta_title || `${basicInfo?.name || t(`${SHARED_TK}.page_title`)} - ${t(`${SHARED_TK}.premium_supplier`)}`}</title>
                <meta name="description" content={mfgData.seo_data?.meta_description || (Array.isArray(description) ? description.join(' ') : description)?.substring(0, 160) || t(`${SHARED_TK}.meta_description_default`)} />
                <link rel="canonical" href={currentUrl} />
            </Head>

            <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 text-foreground animate-in fade-in duration-500">

                {/* HERO SECTION - Vibrant Dark Gradient */}
                <section className="relative overflow-hidden py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 text-white">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                    <div className="container relative mx-auto px-4 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                            <div className="flex-1 self-start space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-bold tracking-wider text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {t(`${SHARED_TK}.premium_supplier`)}
                                </div>

                                <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-sm">
                                        {basicInfo?.name}
                                    </span>
                                </h1>

                                <div className="space-y-3 text-slate-300 text-sm font-medium">
                                    <div className="flex flex-wrap items-center gap-4">
                                        {basicInfo?.established && (
                                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                                <Factory className="w-4 h-4 text-emerald-400" /> {t(`${SHARED_TK}.established`, { year: basicInfo.established })}
                                            </div>
                                        )}
                                        {basicInfo?.factory_area && (
                                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                                <Globe2 className="w-4 h-4 text-purple-400" /> {basicInfo.factory_area}
                                            </div>
                                        )}
                                        {basicInfo?.employee_count && (
                                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                                <Users className="w-4 h-4 text-orange-400" /> {basicInfo.employee_count}
                                            </div>
                                        )}
                                    </div>
                                    {basicInfo?.address && (
                                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                            <MapPin className="w-4 h-4 text-blue-400" /> {basicInfo.address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RFQ Box - Frosted Glass */}
                            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{t(`${SHARED_TK}.connect_directly`)}</h3>
                                <p className="text-slate-300 text-sm mb-6 relative z-10">{t(`${SHARED_TK}.connect_description`)}</p>

                                <QuoteCta size="lg" className="relative z-10 w-full h-14 text-lg" asChild>
                                    <Link to={`${addLanguageToPath('/rfq', currentLanguage)}?company=${encodeURIComponent(basicInfo?.name)}`}>
                                        <Mail className="w-5 h-5" />
                                        {t("navigation.menu.rfq")}
                                    </Link>
                                </QuoteCta>

                                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3 text-sm font-semibold text-slate-200 relative z-10">
                                    <div className="flex min-w-0 items-center gap-3 whitespace-nowrap">
                                        <Gauge className="h-5 w-5 shrink-0 text-emerald-400" />
                                        <span>{t('pages.manufacturers.card.metrics.profile')}: {profileCompleteness}%</span>
                                    </div>
                                    <div className="flex min-w-0 items-center gap-3 whitespace-nowrap">
                                        <Zap className="h-5 w-5 shrink-0 text-amber-400" />
                                        <span>{t('pages.manufacturers.card.metrics.response')}: {responseTimeLabel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VERIFICATION STRIP - Clean & Trustworthy */}
                <div className="border-b bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-2 sm:flex sm:flex-row justify-between w-full">
                            {[
                                { icon: ShieldCheck, label: t(`${SHARED_TK}.iso_certified`), active: verifiedInfo?.iso, color: "text-emerald-500" },
                                { icon: Award, label: t(`${SHARED_TK}.asme_stamp`), active: verifiedInfo?.ASME, color: "text-blue-500" },
                                { icon: BadgeCheck, label: t(`${SHARED_TK}.business_license`), active: verifiedInfo?.business_license, color: "text-purple-500" },
                                { icon: Globe2, label: t(`${SHARED_TK}.global_trade`), active: verifiedInfo?.export_experience, color: "text-indigo-500" }
                            ].map((item, index) => {
                                let borderClasses = "";
                                if (index === 0) borderClasses = "border-b border-r md:border-b-0";
                                if (index === 1) borderClasses = "border-b md:border-b-0 md:border-r";
                                if (index === 2) borderClasses = "border-r";
                                if (index === 3) borderClasses = "border-none";

                                return (
                                    <div key={index} className={`flex-1 py-4 px-2 sm:px-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors min-w-[120px] border-slate-100 dark:border-zinc-800 ${borderClasses}`}>
                                        <item.icon className={`w-6 h-6 ${item.active ? item.color : "text-slate-300"}`} />
                                        <div className="flex items-center gap-2 whitespace-nowrap leading-tight">
                                            <div className={`font-bold text-xs sm:text-sm ${item.active ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{item.label}</div>
                                            <div className="text-xs sm:text-sm font-semibold text-slate-500">{item.active ? t(`${SHARED_TK}.verified`) : t(`${SHARED_TK}.not_available`)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="container mx-auto px-4 max-w-7xl py-12 lg:py-16">

                    {/* 1. OVERVIEW & ADVANTAGES (Combined Flow) */}
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
                        <div className="lg:col-span-8 space-y-8">
                            {gallerySlides.length > 0 && (
                                <div className="w-full">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                                            <Factory className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                {t(`${SHARED_TK}.factory_gallery`)}
                                            </h2>
                                        </div>
                                    </div>

                                    <ImageCarouselGallery
                                        images={gallerySlides}
                                        altFallback={basicInfo?.name || 'Factory image'}
                                        className="w-full"
                                        aspectClassName="aspect-[16/9]"
                                        imageClassName="object-cover p-0"
                                        panelClassName="bg-slate-950"
                                    />
                                </div>
                            )}

                            {/* Description Card */}
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                                    <Factory className="w-6 h-6 text-blue-600" /> {t(`${SHARED_TK}.company_overview`)}
                                </h2>
                                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
                                    {Array.isArray(description) 
                                        ? description.map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                          ))
                                        : <p className="whitespace-pre-line">{description}</p>
                                    }
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

                            {/* Export Markets Tag Cloud */}
                            {exportMarkets.length > 0 && (
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm h-fit">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Globe2 className="w-5 h-5 text-indigo-500" /> {t(`${SHARED_TK}.export_markets`, { defaultValue: 'Export Markets' })}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {exportMarkets.map((code: string, i: number) => {
                                            const cData = typedCountriesData.find((country) => country.id === code);
                                            const cName = cData ? (currentLanguage === 'zh' && cData.name_zh ? cData.name_zh : cData.name) : code;
                                            return (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/30 text-sm font-medium">
                                                    {cName}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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

                            {/* Contact Information */}
                            {(email.length > 0 || phone.length > 0) && (
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm h-fit">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Phone className="w-5 h-5 text-emerald-500" /> {t(`${SHARED_TK}.contact_info`, { defaultValue: 'Contact Info' })}
                                    </h3>
                                    <div className="space-y-3">
                                        {email.length > 0 && (
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                                                <a href={`mailto:${email[0]}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium break-all">{email[0]}</a>
                                            </div>
                                        )}
                                        {phone.length > 0 && (
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                                                <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                                                <a href={`tel:${phone[0]}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">{phone[0]}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Social Media Links */}
                            {socialMediaLinks.length > 0 && (
                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm h-fit">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Globe2 className="w-5 h-5 text-blue-500" /> {t(`${SHARED_TK}.follow_us`, { defaultValue: 'Follow Us' })}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {socialMediaLinks.map((link, i) => {
                                            const SocialIcon = socialIcons[link.platform] || ExternalLink;
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.platform}
                                                    className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-zinc-700 hover:shadow-md transition-all"
                                                >
                                                    <SocialIcon className="w-5 h-5" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
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
                                        <span className="font-semibold text-foreground">{t(`${SHARED_TK}.available_categories`)}</span>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products?.map((product: Product, index: number) => (
                                <div key={index} className="flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 group">
                                    {/* Image Section */}
                                    <div className="aspect-square bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 border-b border-slate-100 dark:border-zinc-800 relative">
                                        <Link to={addLanguageToPath(`/products/${product.url}`, currentLanguage)} className="w-full h-full">
                                            {product.image ? (
                                                <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center">
                                                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center cursor-pointer">
                                                    <Gauge className="w-16 h-16 text-slate-300" />
                                                </div>
                                            )}
                                        </Link>

                                        {/* Product Certificates Overlay */}
                                        {product.certificate && product.certificate.length > 0 && (
                                            <div className="absolute bottom-4 left-0 w-full px-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {product.certificate.slice(0, 3).map((cert: ProductCertificate, cIdx: number) => (
                                                    <div key={cIdx} className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-slate-200" title={cert.name}>
                                                        {cert.image ? (
                                                            <img src={cert.image} alt={cert.name} className="h-5 w-auto object-contain" />
                                                        ) : (
                                                            <span className="text-[10px] font-bold">{cert.name}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-6 flex flex-col">
                                        <div className="mb-4">
                                            <Link to={addLanguageToPath(`/products/${product.url}`, currentLanguage)}>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Short Description */}
                                            {product.short_description && (
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-3">
                                                    {product.short_description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Parameters Grid - Compact */}
                                        {product.Parameters && product.Parameters.length > 0 && (
                                            <div className="mt-auto space-y-2">
                                                <div className="h-px bg-slate-100 dark:bg-zinc-800 mb-4" />
                                                {product.Parameters.slice(0, 3).map((param: ProductParameter, pIdx: number) => (
                                                    <div key={pIdx} className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">{param.name}</span>
                                                        <span className="font-bold text-slate-900 dark:text-white">{param.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. FACTORY CERTIFICATES */}
                    <div className="mb-20">
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 lg:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-[100px]" />
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <Award className="w-6 h-6" />
                                </div>
                                {t(`${SHARED_TK}.factory_certifications`)}
                            </h3>
                            <div className="relative z-10">
                                <ZoomableImageGrid
                                    images={certificates.map((cert) => ({ src: cert.url, alt: cert.alt_text }))}
                                    altFallback={t(`${SHARED_TK}.certificate`, { defaultValue: 'Certificate' })}
                                    imageClassName="filter grayscale transition-all duration-300 group-hover:grayscale-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4.5 DOCUMENT DOWNLOADS */}
                    {documents.length > 0 && (
                        <div className="mb-20">
                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 lg:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-[100px]" />
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    {documentDownloadsTitle}
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg shrink-0">
                                                    <FileText className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 dark:text-white truncate">{getDocumentDisplayName(doc)}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url}
                                                download={getDocumentDisplayName(doc)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                                            >
                                                <Download className="w-4 h-4" />
                                                {downloadLabel}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. TRUSTED CUSTOMERS */}
                    {customers.length > 0 && (
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

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-6 relative z-10">
                                    {customers.map((customer, index) => (
                                        <div key={index} className="aspect-square bg-slate-50 dark:bg-zinc-950 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg border border-transparent hover:border-amber-200 transition-all duration-300 group">
                                            {customer.url ? (
                                                <img src={customer.url} alt={customer.alt_text} className="w-full h-full object-contain opacity-60 group-hover:opacity-100 filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                                                    <span className="font-bold text-slate-500">{customer.alt_text?.[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* FINAL CTA - Gradient */}
                <section className="py-20 bg-gradient-to-br from-indigo-900 to-blue-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:16px_16px]" />
                    <div className="container relative mx-auto px-4 max-w-2xl">
                        <BadgeCheck className="w-12 h-12 text-blue-300 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            {t(`${SHARED_TK}.partner_with`, { name: basicInfo?.name })}
                        </h2>
                        <p className="text-blue-100 mb-10 text-lg">
                            {t(`${SHARED_TK}.partner_desc`)}
                        </p>
                        <QuoteCta size="lg" className="h-16 px-10 text-xl" asChild>
                            <Link to={`${addLanguageToPath('/rfq', currentLanguage)}?company=${encodeURIComponent(basicInfo?.name)}`}>
                                <Mail className="w-5 h-5" />
                                {t("navigation.menu.rfq")}
                            </Link>
                        </QuoteCta>
                    </div>
                </section>

            </main>

            {/* Floating Back Button */}
            <Link
                to={addLanguageToPath('/manufacturers', currentLanguage)}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-full shadow-2xl border border-slate-200 dark:border-zinc-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group font-bold"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>{t(`${SHARED_TK}.back_to_list`, { defaultValue: 'Back to Manufacturers' })}</span>
            </Link>
        </>
    )
}
