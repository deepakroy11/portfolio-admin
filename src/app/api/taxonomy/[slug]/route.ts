// File: /src/app/api/taxonomy/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const taxonomyWithMetas = await client.taxonomy.findUnique({
    where: { slug },
    include: { metas: true },
  });

  if (!taxonomyWithMetas) {
    return NextResponse.json({ error: "Taxonomy not found" }, { status: 404 });
  }

  return NextResponse.json(taxonomyWithMetas);
}
