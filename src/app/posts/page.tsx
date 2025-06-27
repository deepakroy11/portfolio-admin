import { Button, Chip } from "@heroui/react";

import Link from "next/link";
import ListPostPageClient from "./ListPostPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const fetchPost = async (endpint: string) => {
  const response = await fetch(`${baseUrl}/${endpint}`, { cache: "no-store" });
  const data = await response.json();

  return data;
};

export default async function PostsPage() {
  const [posts] = await Promise.all([fetchPost("api/post")]);
  // console.log("Posts", posts);

  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex justify-center items-center">
          All Posts{" "}
          {posts && (
            <Chip radius="full" variant="shadow" className="ms-2">
              {posts?.posts.length}
            </Chip>
          )}
        </h1>
        <Button as={Link} href="/posts/add" prefetch={true}>
          Add New Post
        </Button>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <ListPostPageClient data={posts} />
      </section>
    </main>
  );
}
