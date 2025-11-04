import { NextRequest, NextResponse } from 'next/server'
import { createClient } from './global/lib/supabase/server'

export const middleware = async (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl

  // Define public routes
  const publicRoutes = ['/', '/auth/callback', '/auth/login', '/error', '/not-found', '/categories/*']
  const isCategoryRoute = pathname.startsWith('/categories/')

  // Check if route is public or already has login parameter (to prevent redirect loop)
  const isPublicRoute = publicRoutes.includes(pathname) || isCategoryRoute

  // Allow public routes or routes with login parameter without authentication
  if (isPublicRoute) {
    console.log('isPublicRoute', isPublicRoute)
    return NextResponse.next()
  }

  // For private routes, check authentication
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // If not authenticated, redirect to current URL with login modal trigger
  if (!session) {
    console.log('redirecting to login modal')
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
