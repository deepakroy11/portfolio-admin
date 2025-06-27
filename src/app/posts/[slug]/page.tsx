import { useParams } from "next/navigation";

import PostFormSkeleton from "@/components/skeltons/PostFormSkelton";
import EditPostPageClient from "./EditPostPageClient";

export const dynamic = "force-dynamic";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const fetchSinglePost = async (endpoint: string) => {
  const response = await fetch(`${baseUrl}/${endpoint}`, { cache: "no-store" });
  if (!response.ok) {
    console.error(
      `Failed to fetch taxonomy from ${endpoint}:`,
      response.statusText
    );
    return [];
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error parsing taxonomy JSON from ${endpoint}:`, error);
    return [];
  }
};

const fetchTaxonomy = async (endpoint: string) => {
  const response = await fetch(`${baseUrl}/${endpoint}`, { cache: "no-store" });

  if (!response.ok) {
    console.error(
      `Failed to fetch taxonomy from ${endpoint}:`,
      response.statusText
    );
    return [];
  }

  try {
    const data = await response.json();
    return data?.metas || [];
  } catch (error) {
    console.error(`Error parsing taxonomy JSON from ${endpoint}:`, error);
    return [];
  }
};

export default async function PostsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // console.log("slug", slug);

  const [post, categories, tags] = await Promise.all([
    fetchSinglePost(`api/post/${slug}`),
    fetchTaxonomy("api/taxonomy/category"),
    fetchTaxonomy("api/taxonomy/tags"),
  ]);

  const data = {
    post: post.post,
    categories,
    tags,
  };

  return (
    <main className="flex-1 p-8 space-y-10">
      <EditPostPageClient data={data} />
    </main>
  );
}
