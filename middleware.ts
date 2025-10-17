import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

// Role-specific dashboard routes (client-side router will finalize)
const roleDashboards = {
  CITIZEN: "/dashboard/citizen",
  POLICE: "/dashboard/police",
  FIRE_SERVICE: "/dashboard/fire-service",
  CITY_CORPORATION: "/dashboard/city-corporation",
  ADMIN: "/dashboard/admin",
  SUPER_ADMIN: "/dashboard/admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // For protected routes, check authentication
  if (isProtectedRoute) {
    // Check for accessToken cookie (set by backend)
    const token = request.cookies.get("accessToken")?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    
  }

  // For auth routes, redirect authenticated users to their dashboard
  if (isAuthRoute) {
    // Check for accessToken cookie (set by backend)
    const token = request.cookies.get("accessToken")?.value;

    if (token) {
      // Check if there's a redirect parameter
      const redirectParam = request.nextUrl.searchParams.get("redirect");

      // User is already authenticated, redirect to dashboard or the requested page
      if (redirectParam) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }

      // Note: We can't easily decode JWT here without a library
      // So we redirect to a generic dashboard and let the client handle it
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
