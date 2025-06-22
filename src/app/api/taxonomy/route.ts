import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const taxonomy = await prisma.taxonomy.findMany();

  return NextResponse.json(taxonomy);
}
