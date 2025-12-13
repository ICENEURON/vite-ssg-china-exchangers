import { cn } from "../../utils/cn";
import reactLogo from "../../assets/react.svg";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const { t } = useTranslation('translation');
  const currentLanguage = useCurrentLanguage();
  const [currentYear, setCurrentYear] = useState<number>(2025); // Default fallback

  // Use useEffect to set year after hydration to avoid any potential SSR mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const logo = {
    src: reactLogo,
    alt: "React Tech Stack",
    title: "React Tech Stack",
    url: addLanguageToPath("/", currentLanguage),
  };

  // Build menu items using translations
  const menuItems = [
    {
      title: t('footer.technologies.title'),
      links: [
        { text: t('footer.technologies.links.react'), url: "https://react.dev" },
        { text: t('footer.technologies.links.vite'), url: "https://vitejs.dev" },
        { text: t('footer.technologies.links.tailwindcss'), url: "https://tailwindcss.com" },
        { text: t('footer.technologies.links.shadcn'), url: "https://ui.shadcn.com" },
      ],
    },
    {
      title: t('footer.resources.title'),
      links: [
        { text: t('footer.resources.links.documentation'), url: addLanguageToPath("/claim-your-profile", currentLanguage) },
        { text: t('footer.resources.links.components'), url: addLanguageToPath("/components", currentLanguage) },
        { text: t('footer.resources.links.examples'), url: addLanguageToPath("/examples", currentLanguage) },
        { text: t('footer.resources.links.github'), url: "#" },
      ],
    },
    {
      title: t('footer.guides.title'),
      links: [
        { text: t('footer.guides.links.getting_started'), url: addLanguageToPath("/claim-your-profile", currentLanguage) },
        { text: t('footer.guides.links.customization'), url: addLanguageToPath("/claim-your-profile", currentLanguage) },
        { text: t('footer.guides.links.deployment'), url: addLanguageToPath("/claim-your-profile", currentLanguage) },
        { text: t('footer.guides.links.best_practices'), url: addLanguageToPath("/claim-your-profile", currentLanguage) },
      ],
    },
    {
      title: t('footer.community.title'),
      links: [
        { text: t('footer.community.links.discord'), url: "#" },
        { text: t('footer.community.links.twitter'), url: "#" },
        { text: t('footer.community.links.github'), url: "#" },
        { text: t('footer.community.links.discussions'), url: "#" },
      ],
    },
  ];

  const bottomLinks = [
    { text: t('footer.legal.terms'), url: addLanguageToPath("/terms", currentLanguage) },
    { text: t('footer.legal.privacy_policy'), url: addLanguageToPath("/privacy", currentLanguage) },
  ];
  return (
    <section className={cn("py-16 bg-background border-t", className)}>
      <div className="container mx-auto px-4">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            {/* Logo Area */}
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <a
                  href={logo.url}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-8 w-8 dark:invert"
                  />
                  <span className="text-xl font-bold text-foreground">
                    {logo.title}
                  </span>
                </a>
              </div>
              <p className="mt-4 text-muted-foreground font-medium max-w-sm">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Menu Links */}
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url}
                        className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Area */}
          <div className="mt-16 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p className="text-muted-foreground">
              {t('footer.legal.copyright', { year: currentYear })}
            </p>
            <ul className="flex gap-6">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a
                    href={link.url}
                    className="text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors duration-200"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };