"use client";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Spinner,
  Chip,
} from "@heroui/react";

import Link from "next/link";
import { BsTags, BsThreeDotsVertical } from "react-icons/bs";
import { useMemo, useState, useEffect } from "react";

interface TaxonomyMeta {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
}

interface PostWithData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  user: User;
  tags: TaxonomyMeta[];
  category: TaxonomyMeta[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithData[] | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(posts);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch("/api/post");
        const data = await response.json();

        setPosts(data.posts ?? []);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, []);

  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Button as={Link} href="/posts/add">
          Add New Post
        </Button>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>

        <Table aria-label="collection table" isCompact>
          <TableHeader>
            <TableColumn>SL</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Summary</TableColumn>
            <TableColumn>Category</TableColumn>
            <TableColumn>Author</TableColumn>
            <TableColumn>Tags</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody
            emptyContent="No posts available."
            isLoading={loading}
            items={posts ?? []}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(posts ?? []).map((post, index) => (
              <TableRow key={post.slug}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link href={`/posts/${post.slug}`} color="secondary">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-xs">{post.summary}</div>
                </TableCell>

                <TableCell>
                  <Link href={`#`} color="secondary">
                    <Chip>
                      {post.category.map((cat) => cat.name).join(",")}
                    </Chip>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`#`} color="secondary">
                    {post.user.name}
                  </Link>
                </TableCell>

                <TableCell>
                  {post.tags.map((tag) => (
                    <Link href={`#`} color="secondary" className="me-1">
                      <Chip>{tag.name}</Chip>
                    </Link>
                  ))}
                </TableCell>
                <TableCell>
                  <div className="relative flex justify-end  gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button size="sm" variant="light">
                          <BsThreeDotsVertical className="h-5 w-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="view">View</DropdownItem>
                        <DropdownItem key="edit">Edit</DropdownItem>
                        <DropdownItem key="delete">Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
