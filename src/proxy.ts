import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

export default function middleware(req: any, event: any) {
  if (req.nextUrl.pathname === '/api/auth/callback/credentials') {
    const { passed, message, status } = rateLimit({ windowMs: 60_000, max: 5 })(req);
    if (!passed) {
      return NextResponse.json({ error: message }, { status });
    }
  }

  return withAuth(
    function proxy(req) {
      const token = req.nextauth.token;
      const isAdmin = token?.role === "admin";
      const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

      if (isAdminPage && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      
      return NextResponse.next();
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
      pages: {
        signIn: '/login',
      },
    }
  )(req, event);
}

export const config = {
  matcher: [
    '/checkout',
    '/cart',
    '/profile',
    '/profile/:path*',
    '/admin',
    '/admin/:path*',
    '/api/auth/callback/credentials',
  ],
};
