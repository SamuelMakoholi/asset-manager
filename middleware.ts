import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { nextUrl } = request;

  const isLoggedIn = !!token;
  const isAdmin = token?.role === 'admin';

  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isOnAdminPages = nextUrl.pathname.startsWith('/dashboard/admin');

  // If not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // If logged in but not an admin and trying to access admin pages, redirect to dashboard
  if (isLoggedIn && isOnAdminPages && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  // Match all request paths except for:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - api routes (API endpoints)
  // - public folder files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
