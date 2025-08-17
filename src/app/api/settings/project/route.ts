import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { form, image } from "@heroui/react";

const client = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const defaulProjectImage = `${baseUrl}/uploads/place-holder-logo.svg`;

export async function GET() {
  return NextResponse.json({ success: true, message: "Working on it" });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("project-title") as string;
  const summary = formData.get("project-summary") as string;
  const link = formData.get("project-link") as string;
  const skillSet = formData.get("skillSet") as string;
  const image = formData.get("projectImage") as File | null;

  const data = {
    title,
    summary,
    link,
    image: defaulProjectImage, // default initially
  };
  const skillIds = (skillSet || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean); // removes empty entries

  // Validate that it's a non-empty array
  if (
    !Array.isArray(skillIds) ||
    skillIds.some((id) => typeof id !== "string")
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid skill set" },
      { status: 400 }
    );
  }

  const uploadFile = async (file: File) => {
    if (!file) return "https://picsum.photos/1120/400";
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "projects"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const file_name = Date.now() + "-" + file.name;
      const filePath = path.join(uploadDir, file_name);
      await writeFile(filePath, buffer);
      return `uploads/projects/${file_name}`;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error(`Failed to upload file: ${file?.name}`);
    }
  };

  if (image && image.name !== "" && image.size > 0) {
    const imageUrl = await uploadFile(image);
    data.image = imageUrl;
  }

  try {
    const project = await client.project.create({
      data: {
        ...data,
        skills: { connect: skillIds.map((id) => ({ id })) },
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        error: "Something went wrong...",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("project-title") as string;
  const summary = formData.get("project-summary") as string;
  const link = formData.get("project-link") as string;
  const skillSet = formData.get("skillSet") as string;
  const image = formData.get("projectImage") as File | null;
  const id = formData.get("id") as string;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Project ID is required" },
      { status: 400 }
    );
  }

  const data: any = {
    title,
    summary,
    link,
  };

  let skillIds: string[] = [];
  if (skillSet) {
    try {
      skillIds = JSON.parse(skillSet);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid skill set format" },
        { status: 400 }
      );
    }
  }

  const uploadFile = async (file: File) => {
    if (!file) return null;
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "projects"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const file_name = Date.now() + "-" + file.name;
      const filePath = path.join(uploadDir, file_name);
      await writeFile(filePath, buffer);
      return `uploads/projects/${file_name}`;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error(`Failed to upload file: ${file?.name}`);
    }
  };

  if (image && image.name !== "" && image.size > 0) {
    const imageUrl = await uploadFile(image);
    data.image = imageUrl;
  }

  try {
    const project = await client.project.update({
      where: { id },
      data: {
        ...data,
        skills: {
          set: skillIds.map((skillId) => ({ id: skillId }))
        }
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong...",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Project ID is required" },
      { status: 400 }
    );
  }

  try {
    await client.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong...",
      },
      { status: 500 }
    );
  }
}
