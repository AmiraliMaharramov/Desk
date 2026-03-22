import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected customer panel routes
  if (pathname.startsWith("/panel")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protected admin panel routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN" && role !== "STAFF") {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    (pathname === "/login" || pathname === "/register") &&
    session
  ) {
    const role = (session.user as { role?: string }).role;
    if (role === "ADMIN" || role === "STAFF") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/login", "/register"],
};
