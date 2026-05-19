import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import { addLanguageToPath, getPathWithoutLanguage, useCurrentLanguage, type Language } from "../language-routing";

export const QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY = "heatex_quote_request_source_url";

function getStoredSourcePath() {
    return typeof window !== "undefined" ? window.sessionStorage.getItem(QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY) : null;
}

function normalizeRfqSourcePath(value: string | null) {
    if (!value) return null;

    try {
        const path = new URL(value, "https://local.invalid").pathname || "/";
        const stripped = getPathWithoutLanguage(path);
        return stripped === "/quote-request" ? null : stripped;
    } catch {
        return null;
    }
}

function getCurrentSourcePath(pathname: string, search: string) {
    const currentSource = normalizeRfqSourcePath(new URLSearchParams(search).get("source_url"));
    const storedSource = normalizeRfqSourcePath(getStoredSourcePath());

    if (getPathWithoutLanguage(pathname) === "/quote-request") {
        return currentSource || storedSource || "/";
    }

    // Strip language prefix so SSR (built per /, /zh, etc.) and client hydration
    // agree on the same canonical source path.
    return normalizeRfqSourcePath(getPathWithoutLanguage(pathname)) || "/";
}

function buildRfqPath(pathname: string, search: string, currentLanguage: Language) {
    const params = new URLSearchParams();

    params.set("source_url", getCurrentSourcePath(pathname, search));

    return `${addLanguageToPath("/quote-request", currentLanguage)}?${params.toString()}`;
}

type RfqLinkProps = Omit<LinkProps, "to">;

export const RfqLink = forwardRef<HTMLAnchorElement, RfqLinkProps>(function RfqLink(
    { onClick, ...props },
    ref
) {
    const currentLanguage = useCurrentLanguage();
    const location = useLocation();
    const [isHydrated, setIsHydrated] = useState(false);
    const pathname = isHydrated ? location.pathname : "/";
    const search = isHydrated ? location.search : "";
    const to = buildRfqPath(pathname, search, currentLanguage);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        <Link
            ref={ref}
            to={to}
            onClick={(event) => {
                if (typeof window !== "undefined") {
                    const sourceUrl = new URL(to, window.location.origin).searchParams.get("source_url");
                    if (sourceUrl) {
                        window.sessionStorage.setItem(QUOTE_REQUEST_SOURCE_URL_STORAGE_KEY, sourceUrl);
                    }
                }

                onClick?.(event);
            }}
            {...props}
        />
    );
});