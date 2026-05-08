import { forwardRef } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";
import { addLanguageToPath, getPathWithoutLanguage, useCurrentLanguage, type Language } from "../language-routing";

export const RFQ_SOURCE_URL_STORAGE_KEY = "heatex_rfq_source_url";

export type RfqParamValue = string | null | undefined;
export type RfqParams = Record<string, RfqParamValue>;

function getStoredSourcePath() {
    return typeof window !== "undefined" ? window.sessionStorage.getItem(RFQ_SOURCE_URL_STORAGE_KEY) : null;
}

function normalizeRfqSourcePath(value: string | null) {
    if (!value) return null;

    try {
        const path = new URL(value, "https://local.invalid").pathname || "/";
        return getPathWithoutLanguage(path) === "/rfq" ? null : path;
    } catch {
        return null;
    }
}

function getCurrentSourcePath(pathname: string, search: string) {
    const currentSource = normalizeRfqSourcePath(new URLSearchParams(search).get("source_url"));
    const storedSource = normalizeRfqSourcePath(getStoredSourcePath());

    if (getPathWithoutLanguage(pathname) === "/rfq") {
        return currentSource || storedSource || "/";
    }

    return normalizeRfqSourcePath(pathname) || "/";
}

function buildRfqPath(pathname: string, search: string, currentLanguage: Language, extraParams: RfqParams = {}) {
    const params = new URLSearchParams();

    params.set("source_url", getCurrentSourcePath(pathname, search));

    Object.entries(extraParams).forEach(([key, value]) => {
        if (typeof value !== "string") return;

        const trimmedValue = value.trim();
        if (trimmedValue) {
            params.set(key, trimmedValue);
        }
    });

    return `${addLanguageToPath("/rfq", currentLanguage)}?${params.toString()}`;
}

type RfqLinkProps = Omit<LinkProps, "to"> & {
    params?: RfqParams;
};

export const RfqLink = forwardRef<HTMLAnchorElement, RfqLinkProps>(function RfqLink(
    { params, onClick, ...props },
    ref
) {
    const currentLanguage = useCurrentLanguage();
    const location = useLocation();
    const to = buildRfqPath(location.pathname, location.search, currentLanguage, params);

    return (
        <Link
            ref={ref}
            to={to}
            onClick={(event) => {
                if (typeof window !== "undefined") {
                    const sourceUrl = new URL(to, window.location.origin).searchParams.get("source_url");
                    if (sourceUrl) {
                        window.sessionStorage.setItem(RFQ_SOURCE_URL_STORAGE_KEY, sourceUrl);
                    }
                }

                onClick?.(event);
            }}
            {...props}
        />
    );
});