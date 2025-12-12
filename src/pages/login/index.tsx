import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { useAuth } from "../../context/auth"
import { useCurrentLanguage } from "../../utils/language-routing"
import { addLanguageToPath } from "../../utils/language-routing"

export default function LoginPage() {
  const { t } = useTranslation('translation')
  const { signIn } = useAuth()
  const nav = useNavigate()
  const currentLanguage = useCurrentLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      // Navigate to dashboard with proper language prefix
      const dashboardPath = addLanguageToPath("/dashboard", currentLanguage)
      nav(dashboardPath, { replace: true })
    }
  }

  return (
    <>
      <Head>
        <title>{t('pages.login.title')}</title>
        <meta name="description" content={t('pages.login.meta.description')} />
        <meta name="keywords" content={t('pages.login.meta.keywords')} />
        <meta property="og:title" content={t('pages.login.og.title')} />
        <meta property="og:description" content={t('pages.login.og.description')} />
      </Head>

      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t('pages.login.hero.title')}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('pages.login.hero.subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-card p-8 rounded-lg border">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  {t('pages.login.form.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  {t('pages.login.form.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('pages.login.form.signing_in') : t('pages.login.form.signin')}
              </Button>

              <div className="text-center text-sm">
                <a href="#" className="text-primary hover:underline">
                  {t('pages.login.form.forgot_password')}
                </a>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {t('pages.login.form.no_account')}{' '}
                <a href="/signup" className="text-primary hover:underline">
                  {t('pages.login.form.signup_link')}
                </a>
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-3">{t('pages.login.benefits.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {Array.isArray(t('pages.login.benefits.items', { returnObjects: true })) 
                ? (t('pages.login.benefits.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))
                : null
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
