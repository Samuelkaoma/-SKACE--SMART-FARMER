import { createBrowserClient } from '@supabase/ssr'

import { getEnv, getSupabaseClientKey } from '@/lib/config/env'

export function createClient() {
  const env = getEnv()

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    getSupabaseClientKey(),
  )
}
