import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('Middleware checking session:', !!request.cookies.get('session'));
  console.log('Current path:', request.nextUrl.pathname);

  const session = request.cookies.get('session');
  const isAuthenticated = !!session;

  // Protected routes that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Auth routes (login/signup pages)
  const isAuthRoute = request.nextUrl.pathname === '/signin';

  // If trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If already authenticated and trying to access auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/signin'],
};
