import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {}
export const config = {
  matcher: "/admin/:path*",
};
