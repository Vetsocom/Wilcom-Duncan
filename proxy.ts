import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_TOKEN_COOKIE = 'admin_token';
const ADMIN_AUTH_PATH = '/api/admin/auth';
const ADMIN_LOGIN_PATH = '/admin/login';

function isValidAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const validToken = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';

  return token === validToken;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ADMIN_AUTH_PATH || pathname.startsWith(ADMIN_LOGIN_PATH)) {
    return NextResponse.next();
  }

  if (!isValidAdminRequest(request)) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
