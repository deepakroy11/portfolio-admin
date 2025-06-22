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
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import CKEditorComponent from "@/components/Editor/CKEditor";

import PostFormSkeleton from "@/components/skeltons/PostFormSkelton";

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
  content: string;
  user: User;
  tags: TaxonomyMeta[];
  category: TaxonomyMeta[];
}

export default function PostsPage() {
  const { slug } = useParams();

  const [post, setPost] = useState<PostWithData | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const [categories, setCategories] = useState<TaxonomyMeta[] | null>(null);
  const [tags, setTags] = useState<TaxonomyMeta[] | null>(null);
  const [loading, setLoading] = useState({ category: true, tags: true });

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set()
  );

  const [action, setAction] = useState<string | null>(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        setPostLoading(true);
        const response = await fetch(`/api/post/${slug}`);
        const data = await response.json();
        setPost(data.post);
        setSelectedCategory(
          new Set(data.post.category.map((cat: TaxonomyMeta) => cat.slug))
        );
        setSelectedTags(
          new Set(data.post.tags.map((tag: TaxonomyMeta) => tag.slug))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setPostLoading(false);
      }
    };
    if (slug) {
      getPost();
    }
  }, [slug]);

  useEffect(() => {
    async function fetchTaxonomy(
      endPoint: string,
      setData: (data: TaxonomyMeta[]) => void,
      key: keyof typeof loading
    ) {
      try {
        const response = await fetch(endPoint);
        const jsonData = await response.json();
        setData(jsonData?.metas || []);
      } catch (error: any) {
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    }
    fetchTaxonomy("/api/taxonomy/category", setCategories, "category");
    fetchTaxonomy("/api/taxonomy/tags", setTags, "tags");
  }, []);

  return (
    <main className="flex-1 p-8 space-y-10">
      {postLoading ? (
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
                <h1 className="text-small">Content</h1>
                <CKEditorComponent content={post?.content || ""} />
              </div>

              <div className="w-full flex flex-row gap-2">
                <Select
                  name="category"
                  className="max-w-xs"
                  label="Select a category"
                  selectionMode="single"
                  selectedKeys={selectedCategory}
                  onSelectionChange={(keys) =>
                    setSelectedCategory(new Set(keys as string))
                  }
                >
                  {(categories ?? []).map((category) => (
                    <SelectItem key={category.slug}>{category.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  name="tags"
                  className="max-w-xs"
                  label="Select tags"
                  selectionMode="multiple"
                  selectedKeys={selectedTags}
                  onSelectionChange={(keys) =>
                    setSelectedTags(new Set(keys as string))
                  }
                >
                  {(tags ?? []).map((tag) => (
                    <SelectItem key={tag.slug}>{tag.name}</SelectItem>
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
