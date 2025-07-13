import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLoginPage = nextUrl.pathname === "/login";
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicFile = nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);

  // Allow API routes and public files
  if (isApiRoute || isPublicFile) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and on login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect to login if not logged in and not on login page
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
