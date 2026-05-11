import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dashboard is intentionally open to guests — freemium funnel handled client-side.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
