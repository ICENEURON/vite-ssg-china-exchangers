/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../../lib/supabase/client"

type AuthCtx = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

async function signIn(email: string, password: string) {
  // ⚡ 开发模式快速虚拟登录：在 `npm run dev` 中使用固定密码绕过登录
  if (import.meta.env.DEV && email === "dev@local" && password === "dev") {
    const mockUser = {
      id: "dev-user",
      email: "dev@local",
      app_metadata: { provider: "email" },
      user_metadata: { name: "Dev User" },
      aud: "authenticated",
      role: "authenticated",
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    } as unknown as User;

    setUser(mockUser);
    return { error: null };
  }

  // 真实的Supabase登录保持不变（生产环境也只通过这里）
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <Ctx.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>")
  return v
}
