import PostPageClient from "./AddPostPageClient";

const fetchTaxonomy = async (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/${endpoint}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.metas;
};

export default async function PostAdd() {
  const [categories, tags] = await Promise.all([
    fetchTaxonomy("api/taxonomy/category"),
    fetchTaxonomy("api/taxonomy/tags"),
  ]);

  return <PostPageClient categories={categories} tags={tags} />;
}
