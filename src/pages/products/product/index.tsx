import { Link, useLocation, useParams, Navigate } from "react-router-dom"
import { SeoHead } from '../../../components/seo/SeoHead'
import { Button } from "../../../components/ui/button"
import { QuoteCta } from "../../../components/ui/quote-cta"
import { CheckCircle2, Settings, Factory, ArrowLeft, ArrowRight, BookOpen, Download, FileText, Mail } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { ImageCarouselGallery, ZoomableImageGrid } from '../../../components/ui/interactive-image-gallery'
import { useTranslation } from 'react-i18next'
import { addLanguageToPath, getLanguageFromPath } from '../../../utils/language-routing'
import { RfqLink } from '../../../utils/rfq-routing/link'
import { getLoadedTranslationResource } from '../../../i18n/config'
import type { LocaleResource } from '../../../locales/resources'

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
    slug?: string;
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
    manufacturer?: {
        slug?: string;
    };
    seo_data?: {
        meta_title?: string;
        meta_description?: string;
    };
}

interface RelatedProduct {
    slug: string;
    name: string;
    shortDescription?: string;
    industries?: string[];
    image?: ProductImageAsset;
}

type ProductsTranslationData = LocaleResource["pages"]["products"] & Record<string, unknown>;

function getProductsTranslationData(language: string): ProductsTranslationData | null {
    return (getLoadedTranslationResource(language) as LocaleResource | undefined)?.pages.products as ProductsTranslationData | undefined || null;
}

function getCurrentPathname(pathname: string) {
    return typeof window === "undefined" && globalThis.__SSR_PATHNAME__ ? globalThis.__SSR_PATHNAME__ : pathname;
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
    const location = useLocation();
    const currentPathname = getCurrentPathname(location.pathname);
    const currentLanguage = getLanguageFromPath(currentPathname);
    const { i18n } = useTranslation();
    const t = i18n.getFixedT(currentLanguage);
    const documentDownloadsTitle = t("pages.products.detail.document_downloads");
    const downloadLabel = t("pages.products.detail.download");

    // Construct dynamic path: pages.products.shanghai-heat-transfer-equipment-co-ltd.ht-bloc-welded-plate-heat-exchanger
    const productsData = getProductsTranslationData(currentLanguage) || {};
    const fallbackProductsData = getProductsTranslationData("en") || {};
    const manufacturerProducts = productsData[manufacturerSlug || ""] as Record<string, ProductData> | undefined;
    const fallbackManufacturerProducts = fallbackProductsData[manufacturerSlug || ""] as Record<string, ProductData> | undefined;

    const productData = manufacturerProducts?.[productSlug || ""] || fallbackManufacturerProducts?.[productSlug || ""] || null;

    if (!productData) {
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
    const manufacturerProductData = manufacturerProducts || fallbackManufacturerProducts || {};
    const relatedProducts: RelatedProduct[] = Object.entries(manufacturerProductData)
            .filter(([slug, product]) => slug !== productSlug && product && typeof product === 'object' && typeof product.name === 'string')
            .map(([slug, product]) => ({
                slug: product.slug || slug,
                name: product.name,
                shortDescription: product.short_description,
                industries: product.industries || [],
                image: product.images?.[0],
            }))
            .filter((product) => Boolean(product.slug && product.name));

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

    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://heatexdirect.com';
    const siteName = import.meta.env.VITE_SITE_TITLE || 'HeatEx Direct';
    const currentUrl = new URL(location.pathname, siteUrl).href;
    const metaTitle = productData.seo_data?.meta_title || `${name} - Product Details`;
    const metaDescription = productData.seo_data?.meta_description || description?.substring(0, 160);

    return (
        <>
            <SeoHead
                title={metaTitle}
                description={metaDescription}
                canonicalUrl={currentUrl}
                siteName={siteName}
            />

            <main className="min-h-screen bg-slate-50/50 text-foreground animate-in fade-in duration-500 pb-20 overflow-x-hidden">

                {/* Header Section */}
                <section className="bg-slate-900 border-b border-border/40 py-16 pt-32 mt-[-4rem]">
                    <div className="container max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">

                            {/* Product Image / Video Gallery */}
                            <div className="order-2 w-full lg:order-1 lg:w-1/2">
                                {gallerySlides.length > 0 ? (
                                    <ImageCarouselGallery
                                        images={gallerySlides}
                                        altFallback={name}
                                        aspectClassName="aspect-[4/3]"
                                        imageClassName="object-contain"
                                        panelClassName="bg-transparent"
                                        cornerClassName="!rounded-sm"
                                    />
                                ) : (
                                    <div className="rounded-sm overflow-hidden relative">
                                        <div className="flex aspect-[4/3] items-center justify-center rounded-sm border border-slate-700 text-slate-400">
                                            {t("pages.products.detail.no_image")}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="order-1 w-full lg:order-2 lg:w-1/2 flex flex-col items-start gap-6 pt-1">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                    {name}
                                </h1>
                                {certificates.length > 0 && (
                                    <div className="inline-flex max-w-full flex-wrap gap-3">
                                        <ZoomableImageGrid
                                            images={certificates.map((cert) => ({ src: cert.url, alt: cert.alt_text || 'Certificate' }))}
                                            altFallback="Certificate"
                                            className="flex flex-wrap gap-3"
                                            itemClassName="min-w-0 !bg-transparent !border-0 !shadow-none !rounded-none !p-0 hover:!bg-transparent [&>div:last-of-type]:mb-0 [&>div:last-of-type]:h-auto [&>div:last-of-type]:w-auto"
                                            imageClassName="h-8 w-auto max-w-[96px] object-contain"
                                            labelClassName="!hidden"
                                            cornerClassName="!rounded-sm"
                                            showExpandIcon={false}
                                        />
                                    </div>
                                )}
                                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                                    {description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {industries.map((ind: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="rounded-sm text-slate-300 border-slate-700 bg-slate-800/50">
                                            {ind}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" asChild>
                                        <Link to={addLanguageToPath(`/manufacturers/${manufacturerSlug}`, currentLanguage)}>
                                            <Factory className="mr-2 h-5 w-5" /> {t("pages.products.detail.back_to_manufacturer")}
                                        </Link>
                                    </Button>
                                    <QuoteCta size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" asChild>
                                        <RfqLink>
                                            <Mail className="mr-2 h-5 w-5" />
                                            {t("navigation.menu.rfq")}
                                        </RfqLink>
                                    </QuoteCta>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="container max-w-6xl mx-auto px-4 py-4 space-y-4">

                    {/* Product Details */}
                    {details.length > 0 && (
                        <section className="mb-4 w-full max-w-full min-w-0">
                            <div className="mt-6 mb-4 flex items-center gap-2">
                                <BookOpen className="h-6 w-6 shrink-0 text-violet-600" />
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">{t("pages.products.detail.product_details")}</h2>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                                {details.map((detail, idx) => (
                                    <div key={idx} className={idx > 0 ? "mt-6 pt-1" : undefined}>
                                        <h3 className="text-xl font-bold mb-3 text-card-foreground">{detail.title}</h3>
                                        <p className="text-slate-700 leading-relaxed text-lg">{detail.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Advantages */}
                    {advantages && advantages.length > 0 && (
                        <section className="mb-4 w-full max-w-full min-w-0">
                            <div className="mt-6 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6 shrink-0 text-blue-600" />
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">{t("pages.products.detail.key_advantages")}</h2>
                            </div>
                            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {advantages.map((adv: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-4 px-1 py-1">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="text-card-foreground leading-relaxed font-medium">{adv}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Technical Parameters */}
                    {hasTechnicalParams && (
                        <section className="mb-4 w-full max-w-full min-w-0">
                            <div className="mt-6 mb-4 flex items-center gap-2">
                                <Settings className="h-6 w-6 shrink-0 text-blue-600" />
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">{t("pages.products.detail.technical_specifications")}</h2>
                            </div>
                            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {Object.entries(technicalParams).map(([key, value], index) => (
                                            <tr key={key} className={`border-b border-slate-200 last:border-0 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                                <th className="w-1/3 border-r border-slate-200 bg-slate-100/80 p-4 font-semibold text-slate-700">{key}</th>
                                                <td className="p-4 font-medium text-slate-900">{String(value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* More Products From This Manufacturer */}
                    {relatedProducts.length > 0 && (
                        <section className="mb-4 w-full max-w-full min-w-0">
                            <div className="mt-6 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <Factory className="h-6 w-6 shrink-0 text-slate-700" />
                                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                        {t("pages.products.detail.other_products")}
                                    </h2>
                                </div>
                                <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" asChild>
                                    <Link to={addLanguageToPath(`/manufacturers/${manufacturerSlug}`, currentLanguage)}>
                                        <Factory className="mr-2 h-5 w-5" />
                                        {t("pages.products.detail.back_to_manufacturer")}
                                    </Link>
                                </Button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {relatedProducts.map((product) => (
                                    <Link
                                        key={product.slug}
                                        to={addLanguageToPath(`/products/${manufacturerSlug}/${product.slug}`, currentLanguage)}
                                        className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-blue-50/20 hover:shadow-xl hover:shadow-primary/10"
                                    >
                                        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white p-4">
                                            {product.image ? (
                                                <img
                                                    src={product.image.url}
                                                    alt={product.image.alt_text || product.name}
                                                    className="h-full w-full object-contain transition-transform duration-700 ease-in-out group-hover:scale-105 mix-blend-multiply"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <Factory className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col border-t border-slate-200 p-4">
                                            <div className="min-h-[3.5rem]">
                                                <h3
                                                    className="text-base font-bold leading-6 text-foreground transition-colors duration-300 group-hover:text-primary md:text-[22px] md:leading-7"
                                                >
                                                    {product.name}
                                                </h3>
                                            </div>
                                            {product.shortDescription && (
                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-700">
                                                    {product.shortDescription}
                                                </p>
                                            )}

                                            {product.industries && product.industries.length > 0 && (
                                                <div className="mt-3 flex flex-wrap content-start items-start gap-1.5">
                                                    {product.industries.slice(0, 3).map((industry, idx) => (
                                                        <Badge key={`${industry}-${idx}`} variant="secondary" className="rounded-sm border-blue-600/20 bg-blue-200/30 px-2 py-0.5 text-[11px] font-bold text-blue-700 hover:bg-blue-200/30">
                                                            {industry}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4">
                                                <div className="flex items-center text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-orange-600">
                                                    {t("pages.products.card.explore_details")}
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Document Downloads */}
                    {documents.length > 0 && (
                        <section className="mb-4 w-full max-w-full min-w-0">
                            <div className="mt-6 mb-4 flex items-center gap-2">
                                <FileText className="h-6 w-6 shrink-0 text-emerald-600" />
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">{documentDownloadsTitle}</h2>
                            </div>
                            <div className="space-y-4">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="bg-card p-4 rounded-sm border border-border/50 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-2.5 bg-red-50 rounded-sm shrink-0">
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
                                            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
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

            {/* Floating Back Buttons */}
            <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-2 lg:flex">
                <Link
                    to={addLanguageToPath('/manufacturers', currentLanguage)}
                    className="group flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:text-blue-600 hover:shadow-float"
                >
                    <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="truncate">{t("pages.products.detail.back_to_manufacturers")}</span>
                </Link>
                <Link
                    to={addLanguageToPath('/products', currentLanguage)}
                    className="group flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:text-blue-600 hover:shadow-float"
                >
                    <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="truncate">{t("pages.products.detail.back_to_list")}</span>
                </Link>
            </div>
        </>
    );
}
