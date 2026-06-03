type ResponsiveHeroImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  widths?: readonly number[];
};

const DEFAULT_WIDTHS = [768, 1280, 1920] as const;

function getVariantSrc(src: string, width: number, format: 'avif' | 'webp') {
  return src.replace(/\.[^.]+$/, `-${width}.${format}`);
}

function getSrcSet(src: string, widths: readonly number[], format: 'avif' | 'webp') {
  return widths.map((width) => `${getVariantSrc(src, width, format)} ${width}w`).join(', ');
}

export function ResponsiveHeroImage({
  src,
  alt = '',
  className = '',
  imageClassName = '',
  sizes = '100vw',
  widths = DEFAULT_WIDTHS,
}: ResponsiveHeroImageProps) {
  return (
    <picture
      className={`absolute inset-0 block overflow-hidden ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      <source type="image/avif" srcSet={getSrcSet(src, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={getSrcSet(src, widths, 'webp')} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
