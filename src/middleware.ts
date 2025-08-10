import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth/auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/", "/product", "/product/create", "/product/edit/:path*"],
};
