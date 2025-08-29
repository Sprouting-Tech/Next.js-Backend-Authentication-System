import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_FILE = /\.(.*)$/;

async function verifyToken(token) {
  if (!token) throw new Error("No token supplied");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload; // { sub, role, iat, exp }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip static files, public assets, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const protectedPrefixes = ["/dashboard", "/profile"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = await verifyToken(token);
    const userRole = payload.role;

    // Role-based access control
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/profile/admin")) {
      if (userRole !== "admin") return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    if (pathname.startsWith("/dashboard/user") || pathname.startsWith("/profile/user")) {
      if (userRole !== "user") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    // Pass user info downstream
    const res = NextResponse.next();
    res.headers.set("x-user-id", String(payload.sub));
    res.headers.set("x-user-role", String(userRole));

    return res;
  } catch (err) {
    console.log("Middleware token verify failed:", err?.message || err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
