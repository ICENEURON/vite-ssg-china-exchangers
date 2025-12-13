import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Head } from 'vite-react-ssg'
import { Button } from "../../components/ui/button"
import { supabase } from "../../lib/supabase/client"

export default function SignUpPage() {
  const { t } = useTranslation('translation')
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.session) {
      nav("/dashboard", { replace: true })
    } else {
      setInfo(t('pages.signup.messages.success_message'))
    }
  }

  return (
    <>
      <Head>
        <title>{t('pages.signup.title')}</title>
        <meta name="description" content={t('pages.signup.meta.description')} />
        <meta name="keywords" content={t('pages.signup.meta.keywords')} />
        <meta property="og:title" content={t('pages.signup.og.title')} />
        <meta property="og:description" content={t('pages.signup.og.description')} />
      </Head>

      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-5xl space-y-8">

          {/* Hero */}
          <section className="pt-12 pb-6 px-4">
            <div className="grid mx-auto max-w-5xl text-center gap-6">
              <h1 className="gradient-text mb-4">{t("pages.signup.hero.title")}</h1>
              <h4 className="text-xl md:text-2xl text-foreground mb-2">
                {t("pages.signup.hero.subtitle")}
              </h4>
              {/* <p className="text-lg text-muted-foreground">
                {t("pages.home.hero.description")}
              </p> */}

              {/* <div className="m-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <a href="/docs">{t("pages.home.hero.cta_secondary")}</a>
                </Button>
              </div> */}
            </div>
          </section>

          {/* Signup Form */}
          <div className="bg-card p-8 rounded-lg border">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  {t('pages.signup.form.email')}
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
                  {t('pages.signup.form.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirmPassword">
                  {t('pages.signup.form.confirm_password')}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('pages.signup.form.creating') : t('pages.signup.form.create_account')}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t('pages.signup.form.have_account')}{' '}
                <a href="/login" className="text-primary hover:underline">
                  {t('pages.signup.form.signin_link')}
                </a>
              </div>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-3">{t('pages.signup.benefits.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {Array.isArray(t('pages.signup.benefits.items', { returnObjects: true }))
                ? (t('pages.signup.benefits.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))
                : null
              }
            </ul>
            <div className="mt-4 text-center">
              <p className="text-sm text-green-600 font-medium">
                {t('pages.signup.messages.welcome')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
