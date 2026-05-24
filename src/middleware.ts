import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const savedToken = request.cookies.get("accessToken");
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") && !savedToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (pathname.startsWith("/auth") && savedToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
