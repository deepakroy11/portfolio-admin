import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "Working on it" });
}
