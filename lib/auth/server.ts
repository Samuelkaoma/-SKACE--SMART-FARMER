import type { User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

import { ApiError } from '@/lib/api/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function getServerSessionOrRedirect(redirectTo = '/auth/login') {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(`Unable to verify session: ${error.message}`)
  }

  if (!user) {
    redirect(redirectTo)
  }

  return { supabase, user }
}

export async function requireRouteUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new ApiError(401, 'Unable to verify session.')
  }

  if (!user) {
    throw new ApiError(401, 'Unauthorized')
  }

  return user
}
