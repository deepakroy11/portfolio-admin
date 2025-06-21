"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateTexonomyMetaProps = {
  success: boolean;
  error?: string;
};

export async function createTexonomyMeta(
  prevState: CreateTexonomyMetaProps,
  formData: FormData
): Promise<CreateTexonomyMetaProps> {
  const name = formData.get("name")?.toString();
  const slug = formData.get("slug")?.toString();
  const taxonomySlug = formData.get("taxonomy")?.toString();

  if (!name || !slug) {
    return { success: false, error: "Name and slug are required field." };
  }

  const taxonomy = await db.taxonomy.findUnique({
    where: { slug: taxonomySlug },
    select: { id: true },
  });

  if (!taxonomy) {
    return { success: false, error: "Invalid taxonomy slug" };
  }

  try {
    await db.taxonomyMeta.create({
      data: {
        name,
        slug,
        taxonomyId: taxonomy.id,
      },
    });
  } catch (err) {
    console.error("Server action error:", err);
    return {
      success: false,
      error: "Something went wrong while creating the meta.",
    };
  }

  revalidatePath(`/taxonomies/${taxonomySlug}/`);
  redirect(`/taxonomies/${taxonomySlug}/`);
}
