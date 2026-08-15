import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/members", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/members/login")) {
          return true;
        }
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/members/:path*", "/admin/:path*"],
};
