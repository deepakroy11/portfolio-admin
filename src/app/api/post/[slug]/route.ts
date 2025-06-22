import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

type UrlSlug = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: UrlSlug) {
  const { slug } = await params;

  const post = await client.post.findUnique({
    where: { slug },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      postTaxonomies: {
        include: {
          taxonomyMeta: {
            include: {
              taxonomy: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json(
      { success: false, message: "Post not found" },
      { status: 404 }
    );
  }

  // Transform the data for better structure
  const category: (typeof post.postTaxonomies)[0]["taxonomyMeta"][] = [];
  const tags: (typeof post.postTaxonomies)[0]["taxonomyMeta"][] = [];
  for (const pt of post.postTaxonomies) {
    const meta = pt.taxonomyMeta;
    if (meta?.taxonomy?.slug === "category") {
      category.push(meta);
    }
    if (meta?.taxonomy?.slug === "tags") {
      tags.push(meta);
    }
  }

  const transformPosts = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    image: post.image,
    date: post.date,
    user: post.user,
    category,
    tags,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  return NextResponse.json({ success: true, post: transformPosts });
}
