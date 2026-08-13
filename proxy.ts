import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import { safeInternalPath } from "@/lib/security";

const protectedPrefixes = ["/portal"];
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "next",
      safeInternalPath(`${path}${req.nextUrl.search}`, "/portal")
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/login"],
};
