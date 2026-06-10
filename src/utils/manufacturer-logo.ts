export const manufacturerLogoClassName = "h-[42px] w-auto object-contain";

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
