"use client";

import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Alert,
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";

interface TaxonomyMeta {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  name: string;
  image: string;
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

interface IncomingDataProps {
  success: boolean;
  posts: PostWithData[];
  error: string | undefined;
}

const ListPostPageClient = ({ data }: { data: IncomingDataProps }) => {
  const { success, posts, error } = data;
  // console.log(error);
  return (
    <>
      {error && <Alert color="danger" title={error} className="mb-2" />}
      <Table aria-label="collection table">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Summary</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Author</TableColumn>
          <TableColumn>Tags</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No posts available." items={posts ?? []}>
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
                  <Chip>{post.category.map((cat) => cat.name).join(",")}</Chip>
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-start gap-2">
                  <Avatar
                    isBordered
                    showFallback
                    name={post.user.name}
                    src={post.user.image}
                  />
                  <Link href={`#`} color="secondary">
                    {post.user.name}
                  </Link>
                </div>
              </TableCell>

              <TableCell>
                {post.tags.map((tag) => (
                  <Link
                    href={`#`}
                    key={tag.name}
                    color="secondary"
                    className="me-1"
                  >
                    <Chip className="mb-1">{tag.name}</Chip>
                  </Link>
                ))}
              </TableCell>
              <TableCell>
                <div className="relative flex justify-center  gap-2">
                  <Link href={`/posts/${post.slug}`}>
                    <BsPencilSquare className="w-5 h-5" />
                  </Link>
                  <Link href={`#`}>
                    <BsTrash3 className="w-5 h-5 text-danger" />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ListPostPageClient;
