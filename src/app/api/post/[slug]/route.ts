import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const client = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type UrlSlug = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: UrlSlug) {
  const { slug } = await params;

  try {
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

    revalidatePath(`/post`);
    revalidatePath(`/post/${post.slug}`);
    return NextResponse.json({ success: true, post: transformPosts });
  } catch (error) {
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

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const postId = formData.get("postId") as string;
  const userId = formData.get("userId") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const categories = formData.get("categories") as string;
  const tags = formData.get("tags") as string;
  const imageFile = formData.get("image") as File;

  const tagsIdArray =
    typeof tags === "string" && tags.length > 0 ? JSON.parse(tags) : [];

  const categoryIdArray =
    typeof categories === "string" && categories.length > 0
      ? JSON.parse(categories)
      : [];

  const payload: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    userId: string;
    updatedAt: Date;
    image?: string;
  } = {
    title,
    slug,
    summary,
    content,
    userId,
    updatedAt: new Date(),
  };

  if (imageFile) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    // console.log("Upload", uploadDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const file_name = Date.now() + "-" + imageFile.name;
    const filePath = path.join(uploadDir, file_name);
    // console.log("filePath", filePath);

    await writeFile(filePath, buffer);
    const imageUrl = `${baseUrl}/uploads/${file_name}`;
    payload.image = imageUrl;
  }

  try {
    const updatedPost = await client.post.update({
      where: { id: postId },
      data: payload,
    });

    // Remove existing PostTaxonomy relations
    const status = await client.postTaxonomy.deleteMany({
      where: { postId: String(postId) },
    });

    // Reconnect tags and category
    const allTaxonomySlugs = [...tagsIdArray, ...categoryIdArray];

    const taxonomyMeta = await client.taxonomyMeta.findMany({
      where: { slug: { in: allTaxonomySlugs } },
    });

    const postTaxonomies = taxonomyMeta.map((meta) => ({
      postId: postId,
      taxonomyMetaId: meta.id,
    }));

    await client.postTaxonomy.createMany({
      data: postTaxonomies,
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: "Post Updated Successfully.",
    });
  } catch (error) {
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
