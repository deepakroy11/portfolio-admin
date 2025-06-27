import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";

const client = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Get Post
export async function GET() {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong, Please try after sometime.",
      },
      { status: 500 }
    );
  }
}

// Create Post
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const tagsId = formData.get("tagsId") as string;
  const imageFile = formData.get("image") as File;

  const tagsIdArray =
    typeof tagsId === "string" && tagsId.length > 0 ? tagsId.split(",") : [];

  const session = await auth();
  let userId = session?.user?.id;
  if (process.env.AUTH_DISABLED) {
    userId = "cmc2a4xqj0000x30ypcgmtekv";
  }

  let imageUrl = "https://picsum.photos/1120/400"; // fallback
  if (imageFile) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const file_name = Date.now() + "-" + imageFile.name;
    const filePath = path.join(uploadDir, file_name);
    await writeFile(filePath, buffer);
    imageUrl = `${baseUrl}/uploads/${file_name}`;
  }

  try {
    const newPost = await client.post.create({
      data: {
        title,
        slug,
        summary,
        content,
        image: imageUrl,
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
    revalidatePath(`/posts`);
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
