import type { ComponentType } from "react"

import HomePage from "../../pages/home"

import ManufacturersPage from "../../pages/manufacturers"
import ShphePage from "../../pages/manufacturers/shanghai-heat-transfer-equipment-co-ltd"
import FaqPage from "../../pages/rfq"

import AboutPage from "../../pages/about"
import DocsPage from "../../pages/claim-your-profile"
import ContentMarketingServicesPage from "../../pages/content-marketing-services"

import LoginPage from "../../pages/login"
import SignUpPage from "../../pages/register"
import DashboardPage from "../../app/dashboard"

import TermsPage from "../../pages/terms"
import PrivacyPage from "../../pages/privacy"
import NotFoundPage from "../../pages/404"

import BlogIndex from "../../pages/industry-news"
import BlogPost from "../../pages/industry-news/post"

// import ComponentsPage from "../../pages/components"

export type Auth = "public" | "private"
export type NavGroup = "none" | "public" | "guest" | "auth"
export type MobileGroup = "none" | "public" | "guest" | "auth"

export type RouteDef = {
    path: string
    element: ComponentType
    auth: Auth
    nav: NavGroup
    mobile: MobileGroup
    label?: string
    translationKey?: string
}


const blogEnvValue = import.meta.env.VITE_ENABLE_BLOG;
const enableBlog = blogEnvValue === "true";

const allRoutes: RouteDef[] = [
    { path: "/", element: HomePage, auth: "public", nav: "none", mobile: "none" },

    { path: "/manufacturers", element: ManufacturersPage, auth: "public", nav: "public", mobile: "public", label: "Manufacturers", translationKey: "navigation.menu.manufacturers" },
    { path: "/manufacturers/shanghai-heat-transfer-equipment-co-ltd", element: ShphePage, auth: "public", nav: "none", mobile: "none" },
    { path: "/manufacturers/jiangsu-pioneer-machinery", element: ShphePage, auth: "public", nav: "none", mobile: "none" },
    { path: "/manufacturers/lanzhou-ls-heavy-equipment", element: ShphePage, auth: "public", nav: "none", mobile: "none" },
    { path: "/rfq", element: FaqPage, auth: "public", nav: "none", mobile: "public", label: "RFQ", translationKey: "navigation.menu.rfq" },

    { path: "/claim-your-profile", element: DocsPage, auth: "public", nav: "public", mobile: "public", label: "Claim Your Profile", translationKey: "navigation.menu.profile" },

    { path: "/content-marketing-services", element: ContentMarketingServicesPage, auth: "public", nav: "none", mobile: "public", label: "Content Marketing", translationKey: "navigation.menu.content_marketing_services" },

    { path: "/about", element: AboutPage, auth: "public", nav: "public", mobile: "public", label: "About", translationKey: "navigation.menu.about" },

    // Blog routes
    ...(enableBlog ? [
        { path: "/industry-news", element: BlogIndex, auth: "public", nav: "public", mobile: "public", label: "Industry News", translationKey: "navigation.menu.industry-news" },
        { path: "/industry-news/:slug", element: BlogPost, auth: "public", nav: "none", mobile: "none" },
    ] as RouteDef[] : []),

    { path: "/login", element: LoginPage, auth: "public", nav: "guest", mobile: "guest", label: "Login", translationKey: "navigation.menu.login" },
    { path: "/register", element: SignUpPage, auth: "public", nav: "guest", mobile: "guest", label: "Register", translationKey: "navigation.menu.register" },
    { path: "/dashboard", element: DashboardPage, auth: "private", nav: "auth", mobile: "auth", label: "Dashboard", translationKey: "navigation.menu.dashboard" },

    { path: "/terms", element: TermsPage, auth: "public", nav: "none", mobile: "none", label: "Terms", translationKey: "navigation.menu.terms" },
    { path: "/privacy", element: PrivacyPage, auth: "public", nav: "none", mobile: "none", label: "Privacy", translationKey: "navigation.menu.privacy" },
    { path: "*", element: NotFoundPage, auth: "public", nav: "none", mobile: "none", label: "NotFound" },
]

export const ROUTES = allRoutes;