import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_PATH = '/anne-asad';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // NOTE: When using basePath, nextUrl.pathname does NOT include the basePath.
  // The middleware runs relative to the basePath.

  // Protect /admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_token');
    
    if (!token) {
      // Construct URL with basePath explicitly
      const loginUrl = new URL(`${BASE_PATH}/admin/login`, request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if already logged in
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_token');
    if (token) {
      const adminUrl = new URL(`${BASE_PATH}/admin`, request.nextUrl.origin);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
