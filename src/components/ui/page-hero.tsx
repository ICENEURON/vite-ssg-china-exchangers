import { ResponsiveHeroImage } from "./responsive-hero-image";

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
}

export function PageHero({
  title,
  description,
  backgroundImageSrc,
  backgroundImageAlt,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[360px] items-start overflow-hidden px-4 py-[99px]">
      <div className="absolute inset-0 z-0">
        <ResponsiveHeroImage
          src={backgroundImageSrc}
          alt={backgroundImageAlt}
        />
        <div className="absolute inset-0 bg-navbar/90" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 pt-4 text-center md:pt-5">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
