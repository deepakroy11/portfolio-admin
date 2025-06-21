"use client";
import {
  Form,
  Input,
  Button,
  Textarea,
  Link,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import CKEditorComponent from "@/components/Editor/CKEditor";

import PostFormSkeleton from "@/components/skeltons/PostFormSkelton";
import posts from "@/data/blog_posts.json";
import postMeta from "@/data/extracted_data.json";

const categoryItems = postMeta?.categories?.map((category) => ({
  key: category,
  label: category,
}));

const tagsItems = postMeta?.tags?.map((tag) => ({ key: tag, label: tag }));

type PostProps = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
};

export default function PostsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const [selectedCategory, setCategory] = useState<Set<string>>(new Set());
  const [selectedTags, setTags] = useState<Set<string>>(new Set());
  console.log(selectedTags);

  useEffect(() => {
    if (postId) {
      const foundPost = posts.find((p): p is PostProps => p.slug === postId);
      if (foundPost) {
        setPost(foundPost);
        setCategory(new Set([foundPost.category]));
        setTags(new Set(foundPost.tags));
      } else {
        setPost(null); // explicitly handle undefined case
      }
      setTimeout(() => setLoading(false), 500); // simulate loading
    }
  }, [postId]);

  return (
    <main className="flex-1 p-8 space-y-10">
      {loading ? (
        <PostFormSkeleton />
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold flex justify-start items-center">
              <Tooltip content="Back to all posts">
                <Link href="/posts" color="primary">
                  <BsArrowLeftSquareFill className="w-7 h-7 me-2" />
                </Link>
              </Tooltip>
              {post?.title}
            </h1>
          </div>

          <section>
            <Form
              className="w-full max-w-4xl flex flex-col gap-4"
              onReset={() => setAction("reset")}
              onSubmit={(e) => {
                e.preventDefault();
                let data = Object.fromEntries(new FormData(e.currentTarget));

                setAction(`submit ${JSON.stringify(data)}`);
              }}
            >
              <div className="w-full flex flex-row gap-2">
                <div className="basis-1/2">
                  <Input
                    isRequired
                    errorMessage="Please enter a valid title"
                    label="Title"
                    labelPlacement="outside"
                    name="title"
                    placeholder="Enter your title"
                    type="text"
                    value={post?.title || ""}
                  />
                </div>
                <div className="basis-1/2">
                  <Input
                    isRequired
                    errorMessage="Please enter a valid slug"
                    label="Slug"
                    labelPlacement="outside"
                    name="slug"
                    placeholder="Enter your slug"
                    type="text"
                    value={post?.slug || ""}
                  />
                </div>
              </div>
              <div className="w-full ">
                <Textarea
                  isRequired
                  errorMessage="Please enter a valid summary"
                  label="Summary"
                  labelPlacement="outside"
                  name="summary"
                  placeholder="Enter post summary"
                  value={post?.summary || ""}
                />
              </div>
              <div className="w-full ">
                <h1 className="text-small">Description</h1>
                <CKEditorComponent content={post?.description || ""} />
              </div>

              <div className="w-full flex flex-row gap-2">
                <Select
                  name="category"
                  className="max-w-xs"
                  label="Select a category"
                  selectionMode="single"
                  selectedKeys={selectedCategory}
                  onSelectionChange={(keys) =>
                    setCategory(new Set(keys as string))
                  }
                >
                  {categoryItems.map((cat) => (
                    <SelectItem key={cat.key}>{cat.label}</SelectItem>
                  ))}
                </Select>
                <Select
                  name="tags"
                  className="max-w-xs"
                  label="Select tags"
                  selectionMode="multiple"
                  selectedKeys={selectedTags}
                  onSelectionChange={(keys) => setTags(new Set(keys as string))}
                >
                  {tagsItems.map((tag) => (
                    <SelectItem key={tag.key}>{tag.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  color="primary"
                  type="submit"
                  size="lg"
                  className="max-w-xs"
                >
                  Submit
                </Button>
                <Button type="reset" variant="flat" size="lg">
                  Reset
                </Button>
              </div>
              {action && (
                <div className="text-small text-default-500">
                  Action: <code>{action}</code>
                </div>
              )}
            </Form>
          </section>
        </>
      )}
    </main>
  );
}
