import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
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
);

export const config = {
  matcher: [
    '/checkout',
    '/cart',
    '/profile',
    '/profile/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
