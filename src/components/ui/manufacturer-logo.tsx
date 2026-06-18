import {
    getManufacturerLogoAlt,
    getManufacturerLogoClassName,
    getManufacturerLogoSrc,
} from "../../utils/manufacturer-logo";

interface ManufacturerLogoProps {
    slug?: string | null;
    name: string;
    className?: string;
}

export function ManufacturerLogo({ slug, name, className }: ManufacturerLogoProps) {
    const src = getManufacturerLogoSrc(slug);

    if (!src) {
        return null;
    }

    return (
        <img
            src={src}
            alt={getManufacturerLogoAlt(name)}
            className={[getManufacturerLogoClassName(slug), className].filter(Boolean).join(" ")}
            loading="lazy"
            decoding="async"
        />
    );
}
