import { NextResponse } from 'next/server';
import { auth } from './auth';
 
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // If the user is not logged in and trying to access dashboard, redirect to login
  if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }
  
  // If the user is logged in but not an admin and trying to access admin pages, redirect to dashboard
  if (isLoggedIn && 
      req.auth?.user.role !== 'admin' && 
      nextUrl.pathname.startsWith('/dashboard/admin')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }
  
  return NextResponse.next();
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
