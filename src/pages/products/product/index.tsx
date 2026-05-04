import { Head } from 'vite-react-ssg'
import { Link, useParams, Navigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { CheckCircle2, Settings, Factory, ArrowLeft, BookOpen, Shield, Download, FileText } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { ImageCarouselGallery, ZoomableImageGrid } from '../../../components/ui/interactive-image-gallery'
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, addLanguageToPath } from '../../../utils/language-routing'

interface ProductImageAsset {
    alt_text?: string;
    url: string;
}

interface ProductDetail {
    title: string;
    content: string;
}

interface ProductDocumentAsset {
    alt_text?: string;
    url: string;
    file_name?: string;
}

interface ProductData {
    name: string;
    full_description?: string;
    short_description?: string;
    advantage?: string[];
    advantages?: string[];
    industries?: string[];
    images?: ProductImageAsset[];
    certificates?: ProductImageAsset[];
    technical_parameters?: Record<string, string>;
    video_link?: string;
    details?: ProductDetail[];
    documents?: ProductDocumentAsset[];
    seo_data?: {
        meta_title?: string;
        meta_description?: string;
    };
}

function getDocumentDisplayName(document: ProductDocumentAsset): string {
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

function getYoutubeEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
        if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    } catch { /* ignore */ }
    return null;
}

export default function ProductProfilePage() {
    const { manufacturerSlug, productSlug } = useParams<{ manufacturerSlug: string, productSlug: string }>();
    const { t } = useTranslation();
    const currentLanguage = useCurrentLanguage();
    const documentDownloadsTitle = t("pages.products.detail.document_downloads", { defaultValue: currentLanguage === 'zh' ? '文档下载' : 'Document Downloads' });
    const downloadLabel = t("pages.products.detail.download", { defaultValue: currentLanguage === 'zh' ? '下载' : 'Download' });

    // Construct dynamic path: pages.products.shanghai-heat-transfer-equipment-co-ltd.ht-bloc-welded-plate-heat-exchanger
    const TK = `pages.products.${manufacturerSlug}.${productSlug}`;

    // Load product data dynamically based on the slug. 
    // If it returns a string, it means the key was not found (or returnObjects failed).
    const productData = t(TK, { returnObjects: true, defaultValue: null }) as ProductData | string | null;

    if (!productData || typeof productData === 'string') {
        return <Navigate to="/404" replace />;
    }

    const name = productData.name;
    const description = productData.full_description || productData.short_description;
    const advantages = productData.advantage || productData.advantages || [];
    const industries = productData.industries || [];
    const images = productData.images || [];
    const certificates = productData.certificates || [];
    const details = productData.details || [];
    const documents = productData.documents || [];

    // Technical parameters
    const technicalParams = productData.technical_parameters || {};
    const hasTechnicalParams = Object.keys(technicalParams).length > 0;

    // Video embed
    const videoLink = productData.video_link;
    const videoEmbedUrl = videoLink ? getYoutubeEmbedUrl(videoLink) : null;

    // Build gallery slides: video first, then images
    const gallerySlides = [
        ...(videoEmbedUrl ? [{ type: 'video' as const, src: videoEmbedUrl, alt: `${name} Video` }] : []),
        ...images.map(img => ({ type: 'image' as const, src: img.url, alt: img.alt_text || name }))
    ];

    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost';
    const currentUrl = `${siteUrl}/products/${manufacturerSlug}/${productSlug}`;

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

                            {/* Product Image / Video Gallery */}
                            <div className="w-full md:w-1/2">
                                {gallerySlides.length > 0 ? (
                                    <ImageCarouselGallery
                                        images={gallerySlides}
                                        altFallback={name}
                                        aspectClassName="aspect-[4/3]"
                                        imageClassName="object-contain"
                                        panelClassName="bg-transparent"
                                    />
                                ) : (
                                    <div className="rounded-2xl overflow-hidden relative">
                                        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-slate-700 text-slate-400">
                                            {t("pages.products.detail.no_image", { defaultValue: 'No product image available' })}
                                        </div>
                                    </div>
                                )}
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

                                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" asChild>
                                        <Link to={addLanguageToPath(`/manufacturers/${manufacturerSlug}`, currentLanguage)}>
                                            <Factory className="mr-2 h-5 w-5" /> {t("pages.products.detail.view_manufacturer")}
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-white/70 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-950 w-full sm:w-auto" asChild>
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

                    {/* Certificates */}
                    {certificates.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {t("pages.products.detail.certificates", { defaultValue: 'Certificates' })}
                                </h2>
                            </div>
                            <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
                                <ZoomableImageGrid
                                    images={certificates.map((cert) => ({ src: cert.url, alt: cert.alt_text || 'Certificate' }))}
                                    altFallback="Certificate"
                                    className="flex flex-wrap gap-4"
                                    itemClassName="min-w-0 !bg-transparent !border-0 !shadow-none !rounded-none !p-0 hover:!bg-transparent [&>div:last-of-type]:mb-0 [&>div:last-of-type]:h-auto [&>div:last-of-type]:w-auto"
                                    imageClassName="h-10 w-auto"
                                    labelClassName="!hidden"
                                    showExpandIcon={false}
                                />
                            </div>
                        </section>
                    )}

                    {/* Product Details */}
                    {details.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{t("pages.products.detail.product_details", { defaultValue: 'Product Details' })}</h2>
                            </div>
                            <div className="space-y-8">
                                {details.map((detail, idx) => (
                                    <div key={idx} className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
                                        <h3 className="text-xl font-bold mb-4 text-card-foreground">{detail.title}</h3>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">{detail.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Advantages */}
                    {advantages && advantages.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{t("pages.products.detail.key_advantages")}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-200 w-1/3 border-r border-border/50">{key}</th>
                                                <td className="py-4 px-6 text-slate-900 dark:text-slate-100 font-medium">{String(value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Document Downloads */}
                    {documents.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{documentDownloadsTitle}</h2>
                            </div>
                            <div className="space-y-4">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl shrink-0">
                                                <FileText className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-card-foreground truncate">{getDocumentDisplayName(doc)}</p>
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
                        </section>
                    )}

                </div>
            </main>

            {/* Floating Back Button */}
            <Link
                to={addLanguageToPath('/products', currentLanguage)}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-full shadow-2xl border border-slate-200 dark:border-zinc-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group font-bold"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>{t("pages.products.detail.back_to_list", { defaultValue: 'Back to Products' })}</span>
            </Link>
        </>
    );
}
