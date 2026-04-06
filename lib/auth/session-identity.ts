import type { SupabaseClient } from '@supabase/supabase-js'

type DatabaseClient = SupabaseClient<any, 'public', any>

export interface SessionIdentity {
  id: string
  email: string | null
}

interface SessionIdentityOptions {
  allowNetworkFallback?: boolean
}

function readIdentityFromClaims(claims: Record<string, unknown> | null | undefined) {
  if (!claims || typeof claims.sub !== 'string') {
    return null
  }

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
  } satisfies SessionIdentity
}

export async function getSessionIdentity(
  supabase: DatabaseClient,
  options: SessionIdentityOptions = {},
): Promise<SessionIdentity | null> {
  const { allowNetworkFallback = true } = options
  const claimsResult = await supabase.auth.getClaims()
  const claimsIdentity = readIdentityFromClaims(
    (claimsResult.data?.claims as Record<string, unknown> | undefined) ?? null,
  )

  if (claimsIdentity) {
    return claimsIdentity
  }

  const sessionResult = await supabase.auth.getSession()
  const sessionUser = sessionResult.data.session?.user

  if (sessionUser?.id) {
    return {
      id: sessionUser.id,
      email: sessionUser.email ?? null,
    }
  }

  if (!allowNetworkFallback) {
    return null
  }

  const userResult = await supabase.auth.getUser()

  if (userResult.error) {
    throw new Error(`Unable to verify session: ${userResult.error.message}`)
  }

  const user = userResult.data.user

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email ?? null,
  }
}
