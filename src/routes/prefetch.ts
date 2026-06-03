import { getPathWithoutLanguage } from "../utils/language-routing";

const prefetchedRoutes = new Set<string>();

function normalizePath(path: string) {
  const url = new URL(path, "https://heatexdirect.local");
  return getPathWithoutLanguage(url.pathname);
}

export function prefetchRouteForPath(path: string) {
  if (typeof window === "undefined" || import.meta.env.VITE_ENABLE_BLOG !== "true") {
    return;
  }

  const normalizedPath = normalizePath(path);

  if (!normalizedPath.startsWith("/industry-news")) {
    return;
  }

  const routeKey = normalizedPath === "/industry-news" ? "/industry-news" : "/industry-news/post";

  if (prefetchedRoutes.has(routeKey)) {
    return;
  }

  prefetchedRoutes.add(routeKey);

  if (routeKey === "/industry-news") {
    void import("../pages/industry-news").catch(() => {
      prefetchedRoutes.delete(routeKey);
    });
    return;
  }

  void import("../pages/industry-news/post").catch(() => {
    prefetchedRoutes.delete(routeKey);
  });
}
