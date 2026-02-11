import { createBrowserClient } from '@supabase/ssr'

let supabase = null

// Only create client if env exists (prevents build crash)
if (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export { supabase }

export async function getUser() {
  if (!supabase) return null

  const { data } = await supabase.auth.getUser()
  return data.user
}
