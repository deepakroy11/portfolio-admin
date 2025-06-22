import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

// Get Post
export async function GET() {
  const posts = await client.post.findMany({
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

  // Transform the data for better structure
  const transformPosts = posts.map((post) => {
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

    return {
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
  });

  return NextResponse.json({ success: true, posts: transformPosts });
}

// Create post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, slug, summary, content, categoryId, tagsId } = body;
  const tagsIdArray =
    typeof tagsId === "string" && tagsId.length > 0 ? tagsId.split(",") : [];

  const session = await auth();
  let userId = session?.user?.id;
  if (process.env.AUTH_DISABLED) {
    userId = "cmc2a4xqj0000x30ypcgmtekv";
  }

  try {
    const newPost = await client.post.create({
      data: {
        title,
        slug,
        summary,
        content,
        image: "https://picsum.photos/1120/400",
        userId,
      },
    });

    const postId = newPost.id;
    const allIds = [categoryId, ...tagsIdArray];

    // Validate all taxonomyMetaIds exist
    const validMetas = await client.taxonomyMeta.findMany({
      where: { id: { in: allIds } },
      select: { id: true },
    });

    const postTaxonomiesData = validMetas.map((meta) => ({
      postId,
      taxonomyMetaId: meta.id,
    }));

    await client.postTaxonomy.createMany({
      data: postTaxonomiesData,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: unknown) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
