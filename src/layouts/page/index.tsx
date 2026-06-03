import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "../../context/auth";
import Footer from "../../components/footer";
import { Navigation } from "../../components/navigation";
import { syncLanguageToPath } from "../../i18n/config";
import { syncCookieConsentLanguage, trackPageView } from "../../lib/analytics/cookie-consent";
import { captureMarketingAttribution } from "../../lib/analytics/marketing-attribution";
import { subscribeNavigationFeedback } from "../../utils/navigation-feedback";

function NavigationProgressBar({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 right-0 top-0 z-[70] h-1 overflow-hidden bg-transparent transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="h-full w-1/2 animate-heatex-navigation-progress bg-gradient-to-r from-primary via-orange-400 to-primary shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
    </div>
  );
}

function PageLayoutContent() {
  const location = useLocation();
  const navigation = useNavigation();
  const [isManualNavigationPending, setIsManualNavigationPending] = useState(false);
  const isNavigationPending = navigation.state !== "idle" || isManualNavigationPending;

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

  useEffect(() => subscribeNavigationFeedback(setIsManualNavigationPending), []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavigationProgressBar isVisible={isNavigationPending} />
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
