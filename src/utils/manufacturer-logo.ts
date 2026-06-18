export const manufacturerLogoClassName = "h-[42px] w-auto object-contain";
export const manufacturerLogoTrayClassName = "inline-flex w-fit max-w-full items-center rounded-sm border border-white/75 bg-white/[0.88] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.45),0_20px_48px_rgba(15,23,42,0.30)] backdrop-blur-2xl backdrop-saturate-200 ring-1 ring-white/85";

export function getManufacturerLogoSrc(slug?: string | null) {
    const normalizedSlug = slug?.trim();

    if (!normalizedSlug) {
        return null;
    }

    return `/storage/assets/${normalizedSlug}/company_logo/logo.png`;
}

export function getManufacturerLogoAlt(name: string) {
    return `${name} logo`;
}

export function getManufacturerLogoClassName(slug?: string | null) {
    void slug;

    return manufacturerLogoClassName;
}
