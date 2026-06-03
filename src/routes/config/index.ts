import type { RouteObject } from "react-router-dom"

// import ComponentsPage from "../../pages/components"

export type Auth = "public" | "private"
export type NavGroup = "none" | "public" | "guest" | "auth"
export type MobileGroup = "none" | "public" | "guest" | "auth"
type RouteLazy = NonNullable<RouteObject["lazy"]>

export type RouteDef = {
    path: string
    lazy: RouteLazy
    auth: Auth
    nav: NavGroup
    mobile: MobileGroup
    label?: string
    translationKey?: string
}

const blogEnvValue = import.meta.env.VITE_ENABLE_BLOG;
const enableBlog = blogEnvValue === "true";

const allRoutes: RouteDef[] = [
    { path: "/", lazy: async () => ({ Component: (await import("../../pages/home")).default }), auth: "public", nav: "none", mobile: "none" },

    { path: "/manufacturers", lazy: async () => ({ Component: (await import("../../pages/manufacturers")).default }), auth: "public", nav: "public", mobile: "public", label: "Manufacturers", translationKey: "navigation.menu.manufacturers" },
    { path: "/manufacturers/:slug", lazy: async () => ({ Component: (await import("../../pages/manufacturers/company")).default }), auth: "public", nav: "none", mobile: "none" },

    { path: "/products", lazy: async () => ({ Component: (await import("../../pages/products")).default }), auth: "public", nav: "none", mobile: "none", label: "Products", translationKey: "navigation.menu.products" },
    { path: "/products/:manufacturerSlug/:productSlug", lazy: async () => ({ Component: (await import("../../pages/products/product")).default }), auth: "public", nav: "none", mobile: "none" },

    { path: "/quote-request", lazy: async () => ({ Component: (await import("../../pages/rfq")).default }), auth: "public", nav: "none", mobile: "public", label: "Get Quote", translationKey: "navigation.menu.rfq" },

    { path: "/update-your-profile", lazy: async () => ({ Component: (await import("../../pages/update-your-profile")).default }), auth: "public", nav: "public", mobile: "public", label: "Update Your Profile", translationKey: "navigation.menu.profile" },

    { path: "/content-marketing-services", lazy: async () => ({ Component: (await import("../../pages/content-marketing-services")).default }), auth: "public", nav: "none", mobile: "public", label: "Submit Articles", translationKey: "navigation.menu.content_marketing_services" },

    { path: "/about", lazy: async () => ({ Component: (await import("../../pages/about")).default }), auth: "public", nav: "public", mobile: "public", label: "About", translationKey: "navigation.menu.about" },

    // Blog routes
    ...(enableBlog ? [
        { path: "/industry-news", lazy: async () => ({ Component: (await import("../../pages/industry-news")).default }), auth: "public", nav: "public", mobile: "public", label: "Industry News", translationKey: "navigation.menu.industry-news" },
        { path: "/industry-news/:contentType/:slug", lazy: async () => ({ Component: (await import("../../pages/industry-news/post")).default }), auth: "public", nav: "none", mobile: "none" },
        { path: "/industry-news/:slug", lazy: async () => ({ Component: (await import("../../pages/industry-news/post")).default }), auth: "public", nav: "none", mobile: "none" },
    ] as RouteDef[] : []),

    { path: "/contact", lazy: async () => ({ Component: (await import("../../pages/contact")).default }), auth: "public", nav: "public", mobile: "public", label: "Contact Us", translationKey: "navigation.menu.contact" },

    { path: "/login", lazy: async () => ({ Component: (await import("../../pages/login")).default }), auth: "public", nav: "guest", mobile: "guest", label: "Login", translationKey: "navigation.menu.login" },
    { path: "/register", lazy: async () => ({ Component: (await import("../../pages/register")).default }), auth: "public", nav: "guest", mobile: "guest", label: "Register", translationKey: "navigation.menu.register" },
    { path: "/dashboard", lazy: async () => ({ Component: (await import("../../app/dashboard")).default }), auth: "private", nav: "auth", mobile: "auth", label: "Dashboard", translationKey: "navigation.menu.dashboard" },

    { path: "/terms", lazy: async () => ({ Component: (await import("../../pages/terms")).default }), auth: "public", nav: "none", mobile: "none", label: "Terms", translationKey: "navigation.menu.terms" },
    { path: "/privacy", lazy: async () => ({ Component: (await import("../../pages/privacy")).default }), auth: "public", nav: "none", mobile: "none", label: "Privacy", translationKey: "navigation.menu.privacy" },
    { path: "/404", lazy: async () => ({ Component: (await import("../../pages/404")).default }), auth: "public", nav: "none", mobile: "none", label: "NotFound" },
    { path: "*", lazy: async () => ({ Component: (await import("../../pages/404")).default }), auth: "public", nav: "none", mobile: "none", label: "NotFound" },
]

export const ROUTES = allRoutes;
