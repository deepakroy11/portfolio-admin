"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CreateTaxonomyProps = {
  success: boolean;
  error?: string;
};

export async function createTaxonomy(
  prevState: CreateTaxonomyProps,
  formData: FormData
): Promise<CreateTaxonomyProps> {
  const name = formData.get("name")?.toString();
  const slug = formData.get("slug")?.toString();

  if (!name || !slug) {
    return { success: false, error: "Name and Slug both field are required" };
  }

  await db.taxonomy.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/taxonomies");
  redirect("/taxonomies");
}
