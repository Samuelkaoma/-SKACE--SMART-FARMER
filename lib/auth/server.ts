import { redirect } from 'next/navigation'

import { ApiError } from '@/lib/api/route-helpers'
import { getSessionIdentity, type SessionIdentity } from '@/lib/auth/session-identity'
import { createClient } from '@/lib/supabase/server'

export async function getServerSessionOrRedirect(redirectTo = '/auth/login') {
  const supabase = await createClient()
  const user = await getSessionIdentity(supabase, {
    allowNetworkFallback: false,
  })

  if (!user) {
    redirect(redirectTo)
  }

  return { supabase, user }
}

export async function requireRouteUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<SessionIdentity> {
  const user = await getSessionIdentity(supabase)

  if (!user) {
    throw new ApiError(401, 'Unauthorized')
  }

  return user
}
