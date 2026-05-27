import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "../../context/auth";
import Footer from "../../components/footer";
import { Navigation } from "../../components/navigation";
import { syncLanguageToPath } from "../../i18n/config";
import { syncCookieConsentLanguage, trackPageView } from "../../lib/analytics/cookie-consent";
import { captureMarketingAttribution } from "../../lib/analytics/marketing-attribution";

function PageLayoutContent() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const language = syncLanguageToPath(location.pathname);

      captureMarketingAttribution(location.pathname, location.search);
      void syncCookieConsentLanguage(language);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <main className="flex-1 w-full mt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function PageLayout() {
  return (
    <AuthProvider>
      <PageLayoutContent />
    </AuthProvider>
  );
}
