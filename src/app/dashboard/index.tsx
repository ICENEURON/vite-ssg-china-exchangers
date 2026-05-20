import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { SeoHead } from "../../components/seo/SeoHead"
import { Button } from "../../components/ui/button"
import { useAuth } from "../../context/auth"

export default function DashboardPage() {
  const { t } = useTranslation('translation')
  const { user, signOut } = useAuth()
  const location = useLocation()
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com"
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct"
  const currentUrl = new URL(location.pathname, siteUrl).href

  return (
    <>
      <SeoHead
        title={t('pages.dashboard.title')}
        description={t('pages.dashboard.meta.description')}
        keywords={t('pages.dashboard.meta.keywords')}
        canonicalUrl={currentUrl}
        ogTitle={t('pages.dashboard.og.title')}
        ogDescription={t('pages.dashboard.og.description')}
        siteName={siteName}
      />

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('pages.dashboard.welcome.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t('pages.dashboard.welcome.subtitle', { email: user?.email })}
          </p>
          <p className="text-muted-foreground mx-auto">
            {t('pages.dashboard.welcome.description')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-2">
              {t('pages.dashboard.stats.components')}
            </div>
            <p className="text-sm text-muted-foreground">Components</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-2">
              {t('pages.dashboard.stats.themes')}
            </div>
            <p className="text-sm text-muted-foreground">Themes</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-2">
              {t('pages.dashboard.stats.responsive')}
            </div>
            <p className="text-sm text-muted-foreground">Design</p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-2">
              {t('pages.dashboard.stats.accessible')}
            </div>
            <p className="text-sm text-muted-foreground">Standards</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Components Showcase */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('pages.dashboard.sections.components.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.dashboard.sections.components.description')}
            </p>
            <Button variant="outline" className="w-full">
              {t('pages.dashboard.actions.view_code')}
            </Button>
          </div>

          {/* Performance Metrics */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('pages.dashboard.sections.performance.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.dashboard.sections.performance.description')}
            </p>
            <Button variant="outline" className="w-full">
              {t('pages.dashboard.actions.download')}
            </Button>
          </div>

          {/* Development Tools */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('pages.dashboard.sections.development.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.dashboard.sections.development.description')}
            </p>
            <Button variant="outline" className="w-full">
              {t('pages.dashboard.actions.customize')}
            </Button>
          </div>

          {/* Theme Configuration */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">
              {t('pages.dashboard.sections.theming.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.dashboard.sections.theming.description')}
            </p>
            <Button variant="outline" className="w-full">
              {t('pages.dashboard.actions.view_code')}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
          <Button onClick={signOut}>
            {t('pages.dashboard.actions.sign_out')}
          </Button>
          <Button variant="outline">
            {t('pages.dashboard.actions.view_code')}
          </Button>
          <Button variant="outline">
            {t('pages.dashboard.actions.download')}
          </Button>
          <Button variant="outline">
            {t('pages.dashboard.actions.customize')}
          </Button>
        </div>
      </div>
    </>
  )
}
