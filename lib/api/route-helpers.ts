import { NextResponse } from 'next/server'
import { ZodError, type ZodSchema } from 'zod'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function parseRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON.')
  }

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw new ApiError(400, 'Request body validation failed.', parsed.error.flatten())
  }

  return parsed.data
}

export function handleRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status },
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Request body validation failed.',
        details: error.flatten(),
      },
      { status: 400 },
    )
  }

  console.error(fallbackMessage, error)

  return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}

export function assertDevelopmentOnlyRoute(label: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new ApiError(403, `${label} is disabled in production.`)
  }
}
