import type { ComponentType } from "react"

import HomePage from "../../pages/home"
import DocsPage from "../../pages/docs"
import HistoryPage from "../../pages/history"
import AboutPage from "../../pages/about"
import FaqPage from "../../pages/faq"

import LoginPage from "../../pages/login"
import SignUpPage from "../../pages/signup"
import DashboardPage from "../../app/dashboard"

import TermsPage from "../../pages/terms"
import PrivacyPage from "../../pages/privacy"
import NotFoundPage from "../../pages/404"

import BlogIndex from "../../pages/blogs"
import BlogPost from "../../pages/blogs/post"


export type Auth = "public" | "private"
export type NavGroup = "none" | "public" | "guest" | "auth"

export type RouteDef = {
    path: string
    element: ComponentType
    auth: Auth
    nav: NavGroup
    label?: string
    translationKey?: string
}


const blogEnvValue = import.meta.env.VITE_ENABLE_BLOG;
const enableBlog = blogEnvValue === "true";

const allRoutes: RouteDef[] = [
    { path: "/", element: HomePage, auth: "public", nav: "none" },
    { path: "/about", element: AboutPage, auth: "public", nav: "public", label: "About", translationKey: "navigation.menu.about" },
    { path: "/docs", element: DocsPage, auth: "public", nav: "public", label: "Docs", translationKey: "navigation.menu.docs" },

    // Blog routes
    ...(enableBlog ? [
        { path: "/blog", element: BlogIndex, auth: "public", nav: "public", label: "Blog", translationKey: "navigation.menu.blog" },
        { path: "/blog/:slug", element: BlogPost, auth: "public", nav: "none" },
    ] as RouteDef[] : []),

    { path: "/history", element: HistoryPage, auth: "public", nav: "public", label: "History", translationKey: "navigation.menu.history" },
    { path: "/faq", element: FaqPage, auth: "public", nav: "public", label: "FAQ", translationKey: "navigation.menu.faq" },

    { path: "/login", element: LoginPage, auth: "public", nav: "guest", label: "Login", translationKey: "navigation.menu.login" },
    { path: "/signup", element: SignUpPage, auth: "public", nav: "guest", label: "Sign up", translationKey: "navigation.menu.signup" },
    { path: "/dashboard", element: DashboardPage, auth: "private", nav: "auth", label: "Dashboard", translationKey: "navigation.menu.dashboard" },

    { path: "/terms", element: TermsPage, auth: "public", nav: "none", label: "Terms", translationKey: "navigation.menu.terms" },
    { path: "/privacy", element: PrivacyPage, auth: "public", nav: "none", label: "Privacy", translationKey: "navigation.menu.privacy" },
    { path: "*", element: NotFoundPage, auth: "public", nav: "none", label: "NotFound" },
]

export const ROUTES = allRoutes;