import { Head } from 'vite-react-ssg';

type ResponsiveHeroImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  widths?: readonly number[];
  /**
   * When true (default), marks the image as high-priority for LCP and emits
   * an AVIF `<link rel="preload">` so the browser can begin fetching the
   * hero image during HTML parsing, before React hydrates.
   */
  priority?: boolean;
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
  priority = true,
}: ResponsiveHeroImageProps) {
  const avifSrcSet = getSrcSet(src, widths, 'avif');
  const webpSrcSet = getSrcSet(src, widths, 'webp');

  return (
    <>
      {priority && (
        <Head>
          <link
            rel="preload"
            as="image"
            type="image/avif"
            imageSrcSet={avifSrcSet}
            imageSizes={sizes}
            fetchPriority="high"
          />
        </Head>
      )}
      <picture
        className={`absolute inset-0 block overflow-hidden ${className}`}
        aria-hidden={alt ? undefined : true}
      >
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imageClassName}`}
          loading="eager"
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
        />
      </picture>
    </>
  );
}
