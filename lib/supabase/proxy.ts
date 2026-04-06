import { NextResponse, type NextRequest } from 'next/server'

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(
      ({ name, value }) =>
        Boolean(value) &&
        name.startsWith('sb-') &&
        name.includes('-auth-token'),
    )
}

export async function updateSession(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !hasSupabaseAuthCookie(request)
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({
    request,
  })
}
