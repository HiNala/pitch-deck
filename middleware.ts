import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  
  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Protect deck routes - redirect to login if not authenticated
  if (req.nextUrl.pathname.startsWith('/deck') && !session) {
    const redirectUrl = new URL('/', req.url)
    redirectUrl.searchParams.set('login', 'true')
    return NextResponse.redirect(redirectUrl)
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - share (public deck sharing routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|share).*)',
  ],
} 