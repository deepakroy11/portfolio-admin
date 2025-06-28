import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const client = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const siteName = formData.get("site-name") as string;
  const tagLine = formData.get("tag-line") as string;
  const aboutMe = formData.get("about-me") as string;
  const contactEmail = formData.get("contact-email") as string;
  const profileImage = formData.get("profileImg") as File | null;
  const aboutMeImage = formData.get("aboutMeImg") as File | null;

  const data: {
    siteName: string;
    tagLine: string;
    aboutMe: string;
    contactEmail: string;
    profileImage?: string;
    aboutMeImage?: string;
  } = {
    siteName,
    tagLine,
    aboutMe,
    contactEmail,
  };

  const uploadFile = async (file: File) => {
    if (!file) return "https://picsum.photos/1120/400";
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const file_name = Date.now() + "-" + file.name;
      const filePath = path.join(uploadDir, file_name);
      await writeFile(filePath, buffer);
      return `${baseUrl}/uploads/${file_name}`;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error(`Failed to upload file: ${file?.name}`);
    }
  };

  if (profileImage && profileImage.name !== "" && profileImage.size > 0) {
    const profileImgUrl = await uploadFile(profileImage);
    data.profileImage = profileImgUrl;
  }

  if (aboutMeImage && aboutMeImage.name !== "" && aboutMeImage.size > 0) {
    const aboutMeImgUrl = await uploadFile(aboutMeImage);
    data.aboutMeImage = aboutMeImgUrl;
  }

  try {
    //Find existing data
    const existing = await client.basicDetails.findFirst();

    let result = existing;
    if (existing) {
      //update
      result = await client.basicDetails.update({
        where: { id: existing.id },
        data,
      });
    } else {
      //create
      result = await client.basicDetails.create({ data });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong..." },
      { status: 500 }
    );
  }
}
