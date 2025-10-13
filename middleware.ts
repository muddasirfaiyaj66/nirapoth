import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // For protected routes, you would typically check for authentication
  // This is a basic implementation - in a real app, you'd check JWT tokens
  if (isProtectedRoute) {
    // In a real implementation, you would:
    // 1. Check for authentication token in cookies
    // 2. Verify the token
    // 3. Redirect to login if not authenticated
    // For now, we'll just allow access
    // You can implement proper auth checking here
  }

  // For auth routes, you might want to redirect authenticated users
  if (isAuthRoute) {
    // In a real implementation, you would:
    // 1. Check if user is already authenticated
    // 2. Redirect to dashboard if authenticated
    // For now, we'll just allow access
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
