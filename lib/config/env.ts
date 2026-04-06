import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  ENABLE_DEV_SEED_ROUTES: z.enum(['true', 'false']).optional(),
}).superRefine((env, context) => {
  if (
    !env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      message:
        'Provide NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.',
    })
  }
})

type AppEnv = z.infer<typeof envSchema>

let cachedEnv: AppEnv | null = null

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv
  }

  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    ENABLE_DEV_SEED_ROUTES: process.env.ENABLE_DEV_SEED_ROUTES,
  })

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.issues
        .map((issue) => issue.path.join('.'))
        .join(', ')}`,
    )
  }

  cachedEnv = parsed.data
  return cachedEnv
}

export function getSiteUrl() {
  return getEnv().NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function getSupabaseClientKey(): string {
  const env = getEnv()
  const key =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!key) {
    throw new Error(
      'Missing Supabase client key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.',
    )
  }

  return key
}

export function isDevSeedRouteEnabled() {
  const env = getEnv()

  if (process.env.NODE_ENV === 'production') {
    return false
  }

  return env.ENABLE_DEV_SEED_ROUTES !== 'false'
}
