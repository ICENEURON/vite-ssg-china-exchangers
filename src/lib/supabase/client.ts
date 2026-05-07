import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

export async function getSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars")
  }

  if (!client) {
    const { createClient } = await import("@supabase/supabase-js")
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return client
}
