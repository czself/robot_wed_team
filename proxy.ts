import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const protectedPrefixes = ["/portal"];
const authPages = ["/login"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && authPages.includes(path)) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/login"],
};
