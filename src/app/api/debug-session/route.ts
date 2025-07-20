import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  
  return NextResponse.json({
    authenticated: !!session,
    session: session,
    env: {
      authSecret: !!process.env.AUTH_SECRET,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      githubClientId: !!process.env.GITHUB_CLIENT_ID,
      githubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 20) + "..." // Only show beginning for security
    }
  });
}