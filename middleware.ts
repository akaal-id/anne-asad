import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // NOTE: When using basePath, nextUrl.pathname does NOT include the basePath.
  // The middleware runs relative to the basePath.

  // Protect /admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_token');
    
    if (!token) {
      // Use request.nextUrl.basePath to construct the correct redirect URL
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if already logged in
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_token');
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
