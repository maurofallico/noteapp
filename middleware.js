import { NextResponse } from "next/server";

export async function middleware(request) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return NextResponse.next(); 
}

export const config = {
  matcher: ["/api/:path*"], 
};