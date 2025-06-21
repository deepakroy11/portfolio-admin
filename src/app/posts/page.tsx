"use client";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import posts from "@/data/blog_posts.json";
import Link from "next/link";
import { BsTags, BsThreeDotsVertical } from "react-icons/bs";
import { useMemo, useState, useEffect } from "react";
import PostsTableSkeleton from "@/components/skeltons/PostTableSkelton";

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const postPerPage = 8;
  const pages = Math.ceil(posts.length / postPerPage);

  const paginatredPosts = useMemo(() => {
    const start = (page - 1) * postPerPage;
    const end = start + postPerPage;

    return posts.slice(start, end);
  }, [page, posts]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // simulate loading delay
    return () => clearTimeout(timer);
  }, [page, paginatredPosts]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      console.log(data);
    };
    getUsers();
  }, []);

  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold">All Posts</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Deepak! Here’s a quick overview of your site's
          performance.
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>

        {loading ? (
          <PostsTableSkeleton />
        ) : (
          <Table
            aria-label="collection table"
            isCompact
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Summary</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Author</TableColumn>
              <TableColumn>Tags</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>

            <TableBody>
              {paginatredPosts.map((post, index) => (
                <TableRow key={post.slug} className="border-b">
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
                      {post.category}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`#`} color="secondary">
                      {post.author}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {post.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1">
                        <BsTags />
                        <Link href="#">{tag}</Link>
                      </span>
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
        )}
      </section>
    </main>
  );
}
