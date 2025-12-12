import { useEffect, useState } from "react"
import { getInitialTheme } from "../initial-state"

export type Theme = "light" | "dark"
const STORAGE_KEY = "theme"

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined"

function applyTheme(theme: Theme) {
  if (!isBrowser()) return
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function useTheme() {
  // 从全局状态初始化主题，或者回退到浅色主题
  const [theme, setThemeState] = useState<Theme>(() => {
    // 在服务器端，始终返回浅色主题
    if (!isBrowser()) return "light"
    // 在客户端，先尝试从全局状态获取，然后从localStorage获取
    return getInitialTheme()
  })
  const [isHydrated, setIsHydrated] = useState(false)

  // 在hydration后与客户端状态同步
  useEffect(() => {
    setIsHydrated(true)
    // 仅在客户端且主题尚未应用时应用主题
    if (isBrowser()) {
      applyTheme(theme)
    }
  }, [theme])

  // 在主题改变时应用
  useEffect(() => {
    if (isHydrated) {
      applyTheme(theme)
    }
  }, [theme, isHydrated])

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme)
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, newTheme)
      applyTheme(newTheme)
    }
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // 在SSR时返回浅色主题，hydration后返回实际主题
  return { theme: isHydrated ? theme : "light", setTheme, toggleTheme }
}
