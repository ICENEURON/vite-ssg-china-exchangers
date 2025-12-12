import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/auth"
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing"

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const loc = useLocation()
  const currentLanguage = useCurrentLanguage()

  if (loading) return null

  if (!user) {
    // Redirect to home page with proper language prefix
    const homePath = addLanguageToPath("/", currentLanguage)
    return <Navigate to={homePath} replace state={{ from: loc }} />
  }

  return <Outlet />
}
