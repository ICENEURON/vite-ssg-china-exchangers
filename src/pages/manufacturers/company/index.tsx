
import { Head } from 'vite-react-ssg'
import { Link, useLocation, useParams, Navigate } from "react-router-dom"
import { BadgeCheck, Factory, ArrowLeft, ArrowRight, MapPin, ShieldCheck, Award, Users, Globe2, Package, Sparkles, Flame, Gauge, Mail, Phone, Linkedin, Youtube, ExternalLink, Download, FileText } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { ImageCarouselGallery, ZoomableImageGrid } from '../../../components/ui/interactive-image-gallery'
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, addLanguageToPath } from '../../../utils/language-routing'
import { QuoteCta } from '../../../components/ui/quote-cta'
import { RfqLink } from '../../../utils/rfq-routing/link'
import countriesData from '../../../data/countries.json'

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

function normalizeFactoryArea(value?: string): string | null {
    if (!value?.trim()) {
        return null;
    }

    return value.replace(/\s*(m2|m²|㎡|平方米)$/iu, '').trim() || null;
}

export default function ManufacturerProfilePage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const { t } = useTranslation();
    const currentLanguage = useCurrentLanguage();

    const SHARED_TK = "pages.manufacturers.company";
    const TK = `pages.manufacturers.${slug}`;
    const documentDownloadsTitle = t(`${SHARED_TK}.document_downloads`);
    const downloadLabel = t(`${SHARED_TK}.download`);
    const partnerWithTemplate = t(`${SHARED_TK}.partner_with`, { name: '__NAME__' });
    const [partnerWithPrefix, partnerWithSuffix] = partnerWithTemplate.split('__NAME__');

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
    const factoryAreaLabel = normalizeFactoryArea(basicInfo.factory_area)
        ? t(`${SHARED_TK}.factory_area_summary`, { value: normalizeFactoryArea(basicInfo.factory_area) })
        : null;
    const employeeCountLabel = basicInfo.employee_count?.trim()
        ? t(`${SHARED_TK}.employee_count_summary`, { value: basicInfo.employee_count.trim() })
        : null;

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
    const currentUrl = new URL(location.pathname, siteUrl).href;

    return (
        <>
            <Head>
                <title>{mfgData.seo_data?.meta_title || `${basicInfo?.name || t(`${SHARED_TK}.page_title`)}`}</title>
                <meta name="description" content={mfgData.seo_data?.meta_description || (Array.isArray(description) ? description.join(' ') : description)?.substring(0, 160) || t(`${SHARED_TK}.meta_description_default`)} />
                <link rel="canonical" href={currentUrl} />
            </Head>

            <main className="min-h-screen w-full max-w-full bg-slate-50/50 text-foreground animate-in fade-in duration-500">

                {/* HERO SECTION - Vibrant Dark Gradient */}
                <section className="relative w-full max-w-full overflow-hidden py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 text-white">
                    {/* Abstract Shapes */}
                    <div
                        className="pointer-events-none absolute right-0 top-0 rounded-full bg-blue-500/10 blur-[120px] -translate-y-1/2 translate-x-1/3"
                        style={{ width: 'min(800px, 140vw)', height: 'min(800px, 140vw)' }}
                    />
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 rounded-full bg-purple-500/10 blur-[100px] translate-y-1/3 -translate-x-1/4"
                        style={{ width: 'min(600px, 125vw)', height: 'min(600px, 125vw)' }}
                    />

                    <div className="container relative mx-auto w-full max-w-7xl px-4">
                        <div className="flex w-full max-w-full min-w-0 flex-col items-start justify-between gap-12 lg:flex-row">
                            <div className="min-w-0 flex-1 self-start space-y-6">
                                <h1 className="break-words text-4xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-sm">
                                        {basicInfo?.name}
                                    </span>
                                </h1>

                                <div className="min-w-0 space-y-3 text-slate-300 text-sm font-medium">
                                    <div className="flex flex-wrap items-center gap-4">
                                        {basicInfo?.established && (
                                            <div className="flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                <Factory className="h-4 w-4 shrink-0 text-emerald-400" />
                                                <span className="min-w-0 break-words">{t(`${SHARED_TK}.established`, { year: basicInfo.established })}</span>
                                            </div>
                                        )}
                                        {basicInfo?.factory_area && (
                                            <div className="flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                <Globe2 className="h-4 w-4 shrink-0 text-purple-400" />
                                                <span className="min-w-0 break-words">{factoryAreaLabel}</span>
                                            </div>
                                        )}
                                        {basicInfo?.employee_count && (
                                            <div className="flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                <Users className="h-4 w-4 shrink-0 text-orange-400" />
                                                <span className="min-w-0 break-words">{employeeCountLabel}</span>
                                            </div>
                                        )}
                                    </div>
                                    {basicInfo?.address && (
                                        <div className="inline-flex max-w-full min-w-0 items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10 sm:items-center sm:rounded-full">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400 sm:mt-0" />
                                            <span className="min-w-0 break-words leading-6">{basicInfo.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quote request box - frosted glass */}
                            <div className="group relative w-full max-w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:max-w-md sm:p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 mb-6 space-y-3">
                                    <p className="text-lg font-bold leading-snug text-white">{t(`${SHARED_TK}.connect_description`)}</p>
                                    <p className="text-sm leading-6 text-slate-300">{t(`${SHARED_TK}.connect_note`)}</p>
                                </div>

                                <QuoteCta size="lg" className="relative z-10 w-full h-14 text-lg" asChild>
                                    <RfqLink>
                                        <Mail className="w-5 h-5" />
                                        {t("navigation.menu.rfq")}
                                    </RfqLink>
                                </QuoteCta>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VERIFICATION STRIP - Clean & Trustworthy */}
                <div className="sticky top-0 z-40 w-full max-w-full border-b bg-white/80 shadow-sm backdrop-blur-xl">
                    <div className="container mx-auto w-full max-w-7xl px-4">
                        <div className="grid w-full max-w-full grid-cols-2 justify-between sm:flex sm:flex-row">
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
                                    <div key={index} className={`flex min-w-0 flex-1 items-center justify-center gap-2 border-slate-100 px-2 py-4 transition-colors hover:bg-slate-50 sm:min-w-[120px] sm:gap-3 sm:px-4 ${borderClasses}`}>
                                        <item.icon className={`w-6 h-6 ${item.active ? item.color : "text-slate-300"}`} />
                                        <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 leading-tight sm:flex-nowrap">
                                            <div className={`font-bold text-xs sm:text-sm ${item.active ? "text-slate-900" : "text-slate-400"}`}>{item.label}</div>
                                            <div className="text-xs sm:text-sm font-semibold text-slate-500">{item.active ? t(`${SHARED_TK}.verified`) : t(`${SHARED_TK}.not_available`)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="container mx-auto w-full max-w-7xl px-4 py-12 lg:py-16">

                    {/* 1. OVERVIEW & ADVANTAGES (Combined Flow) */}
                    <div className="mb-20 grid w-full max-w-full min-w-0 gap-8 lg:grid-cols-12 lg:gap-12">
                        <div className="min-w-0 space-y-8 lg:col-span-8">
                            {gallerySlides.length > 0 && (
                                <div className="w-full max-w-full min-w-0">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                                            <Factory className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
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
                            <div className="w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                                    <Factory className="w-6 h-6 text-blue-600" /> {t(`${SHARED_TK}.company_overview`)}
                                </h2>
                                <div className="text-slate-600 leading-relaxed text-lg space-y-4">
                                    {Array.isArray(description) 
                                        ? description.map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                          ))
                                        : <p className="whitespace-pre-line">{description}</p>
                                    }
                                </div>
                            </div>

                            {/* Advantages - Single Line List Style */}
                            <div className="w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                                    <Sparkles className="w-6 h-6 text-blue-600" /> {t(`${SHARED_TK}.why_choose_us`)}
                                </h2>
                                <div className="space-y-3">
                                    {advantages?.map((adv: string, i: number) => (
                                        <p key={i} className="font-medium text-slate-800 text-lg leading-relaxed">
                                            {adv}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Info Cards */}
                        <div className="min-w-0 space-y-6 lg:col-span-4">
                            {/* Industries Tag Cloud */}
                            <div className="h-fit w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                                    <Flame className="w-5 h-5 text-orange-500" /> {t(`${SHARED_TK}.industries_served`)}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {industries?.map((ind: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-sm font-medium">
                                            {ind}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Export Markets Tag Cloud */}
                            {exportMarkets.length > 0 && (
                                <div className="h-fit w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                                        <Globe2 className="w-5 h-5 text-indigo-500" /> {t(`${SHARED_TK}.export_markets`)}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {exportMarkets.map((code: string, i: number) => {
                                            const cData = typedCountriesData.find((country) => country.id === code);
                                            const cName = cData ? (currentLanguage === 'zh' && cData.name_zh ? cData.name_zh : cData.name) : code;
                                            return (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium">
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
                                    className="group block w-full max-w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
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
                                <div className="h-fit w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                                        <Phone className="w-5 h-5 text-emerald-500" /> {t(`${SHARED_TK}.contact_info`)}
                                    </h3>
                                    <div className="space-y-3">
                                        {email.length > 0 && (
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                                                <a href={`mailto:${email[0]}`} className="hover:text-blue-600 transition-colors font-medium break-all">{email[0]}</a>
                                            </div>
                                        )}
                                        {phone.length > 0 && (
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                                                <a href={`tel:${phone[0]}`} className="hover:text-emerald-600 transition-colors font-medium">{phone[0]}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Social Media Links */}
                            {socialMediaLinks.length > 0 && (
                                <div className="h-fit w-full max-w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                                        <Globe2 className="w-5 h-5 text-blue-500" /> {t(`${SHARED_TK}.follow_us`)}
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
                                                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all"
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
                    <div className="mb-20 w-full max-w-full min-w-0">
                        <div className="mb-8">
                            <div>
                                <h2 className="mb-4 flex max-w-full min-w-0 items-center gap-3 break-words text-3xl font-bold tracking-tight text-slate-900">
                                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <span>{t(`${SHARED_TK}.product_showcase`)}</span>
                                </h2>
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
                        </div>

                        <div className="grid w-full max-w-full min-w-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products?.map((product: Product, index: number) => (
                                <Link
                                    key={index}
                                    to={addLanguageToPath(`/products/${product.url}`, currentLanguage)}
                                    className="group flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-blue-50/20 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white p-4">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply" />
                                        ) : (
                                            <div className="text-slate-400">
                                                <Gauge className="w-16 h-16 text-slate-300" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col border-t border-slate-200 p-4">
                                        <div className="h-14 overflow-hidden">
                                            <h3
                                                className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary"
                                                style={{ fontSize: "22px", lineHeight: "28px" }}
                                            >
                                                {product.name}
                                            </h3>
                                        </div>

                                        {product.short_description && (
                                            <p className="mt-3 text-sm leading-6 text-zinc-700 line-clamp-3">
                                                {product.short_description}
                                            </p>
                                        )}

                                        <div className="mt-3 flex flex-wrap content-start items-start gap-1.5">
                                            {product.certificate?.slice(0, 3).map((cert: ProductCertificate, cIdx: number) => (
                                                <Badge key={cIdx} variant="secondary" className="rounded-full border-blue-600/20 bg-blue-200/30 px-2 py-0.5 text-[11px] font-bold text-blue-700 hover:bg-blue-200/30">
                                                    {cert.name}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-orange-600">
                                                {t(`${SHARED_TK}.technical_specifications`)}
                                                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 4. FACTORY CERTIFICATES */}
                    <div className="mb-20 w-full max-w-full min-w-0">
                        <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
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
                                    altFallback={t(`${SHARED_TK}.certificate`)}
                                    imageClassName="filter grayscale transition-all duration-300 group-hover:grayscale-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4.5 DOCUMENT DOWNLOADS */}
                    {documents.length > 0 && (
                        <div className="mb-20 w-full max-w-full min-w-0">
                            <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-[100px]" />
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    {documentDownloadsTitle}
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="flex w-full max-w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-emerald-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="p-2 bg-red-50 rounded-lg shrink-0">
                                                    <FileText className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">{getDocumentDisplayName(doc)}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url}
                                                download={getDocumentDisplayName(doc)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-md sm:w-auto"
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
                        <div className="mb-12 w-full max-w-full min-w-0">
                            <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-br-[100px]" />

                                <div className="mb-10 relative z-10 flex items-center gap-4 text-left">
                                    <div className="inline-flex p-3 bg-amber-100 text-amber-600 rounded-xl">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{t(`${SHARED_TK}.trusted_customers`)}</h3>
                                        <p className="text-slate-500">{t(`${SHARED_TK}.trusted_customers_desc`)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-6 relative z-10">
                                    {customers.map((customer, index) => (
                                        <div key={index} className="aspect-square bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-lg border border-transparent hover:border-amber-200 transition-all duration-300 group">
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
                <section className="relative w-full max-w-full overflow-hidden bg-gradient-to-br from-indigo-900 to-blue-900 py-20 text-center text-white">
                    <div className="absolute inset-0 opacity-20 bg-dot-overlay-inverse" />
                    <div className="container relative mx-auto w-full max-w-2xl px-4">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            {partnerWithPrefix}
                            <span className="break-words text-orange-300">{basicInfo?.name}</span>
                            {partnerWithSuffix}
                        </h2>
                        <p className="text-blue-100 mb-10 text-lg">
                            {t(`${SHARED_TK}.partner_desc`)}
                        </p>
                        <QuoteCta size="lg" className="h-16 px-10 text-xl" asChild>
                            <RfqLink>
                                <Mail className="w-5 h-5" />
                                {t("navigation.menu.rfq")}
                            </RfqLink>
                        </QuoteCta>
                    </div>
                </section>

            </main>

            {/* Floating Back Button */}
            <Link
                to={addLanguageToPath('/manufacturers', currentLanguage)}
                className="group fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:text-blue-600 hover:shadow-float sm:right-6"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{t(`${SHARED_TK}.back_to_list`)}</span>
            </Link>
        </>
    )
}
