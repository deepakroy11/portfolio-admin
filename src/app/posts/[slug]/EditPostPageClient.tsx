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
  Alert,
  Image,
} from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { BsArrowLeftSquareFill, BsArrowLeftShort } from "react-icons/bs";
import CKEditorComponent from "@/components/Editor/CKEditor";

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
  image: string;
  content: string;
  user: User;
  tags: TaxonomyMeta[];
  category: TaxonomyMeta[];
}

interface EditPostPageClientProps {
  post: PostWithData;
  categories: TaxonomyMeta[];
  tags: TaxonomyMeta[];
}

const EditPostPageClient = ({ data }: { data: EditPostPageClientProps }) => {
  const { post, categories, tags } = data;

  const [editorData, setEditorData] = useState<string>(post.content);

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [summary, setsummary] = useState(post.summary);

  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(post.tags.map((tag: TaxonomyMeta) => tag.slug))
  );
  const [selectedCategory, setSelectedCategory] = useState<Set<string>>(
    new Set(post.category.map((cat: TaxonomyMeta) => cat.slug))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string>(post.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChang = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("summary", summary);
    formData.append("content", editorData);
    formData.append("userId", post.user.id);
    formData.append("postId", post.id);
    formData.append("tags", JSON.stringify(Array.from(selectedTags)));
    formData.append("categories", JSON.stringify(Array.from(selectedCategory)));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`/api/post/${post.slug}`, {
      method: "PUT",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      setSuccess(result.message || "Updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
      setIsLoading(false);
    } else {
      setError(result.error || "Something went wrong...");
      setTimeout(() => setError(null), 3000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl  flex justify-between">
        <h1 className="text-3xl font-bold flex justify-start items-center">
          <Tooltip content="Back to all posts">
            <Link href="/posts" className="font-bold">
              <BsArrowLeftSquareFill className="w-7 h-7 me-2" />
            </Link>
          </Tooltip>
          {post?.title}
        </h1>
        <Button as={Link} href="/posts/add" color="default">
          Add New Post
        </Button>
      </div>
      <div></div>

      <section>
        <Form
          className="w-full max-w-4xl flex flex-col space-y-4 gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-row gap-2 ">
            <div className="basis-1/2">
              <Input
                isRequired
                errorMessage="Please enter a valid title"
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter your title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center bg-primary-100 p-2 rounded-2xl space-x-6 space-y-2">
            <Button
              type="button"
              onPress={handleClick}
              className="px-4 py-2 bg-primary"
              color="default"
            >
              Choose File
            </Button>

            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-64 h-auto rounded-2xl shadow"
                width={300}
              />
            )}

            <Input
              type="file"
              name="image"
              id="image-file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChang}
              accept="image/*"
            />
          </div>
          <div className="w-full ">
            <Textarea
              isRequired
              errorMessage="Please enter a valid summary"
              label="Summary"
              labelPlacement="outside"
              name="summary"
              placeholder="Enter post summary"
              value={summary}
              onChange={(e) => setsummary(e.target.value)}
            />
          </div>
          <div className="w-full">
            <h1 className="text-small">Content</h1>
            <CKEditorComponent
              content={post?.content || ""}
              onChange={handleEditorChange}
            />
          </div>

          <div className="w-full flex flex-row gap-2">
            <Select
              name="category"
              className="w-full"
              label="Category"
              labelPlacement="outside"
              selectionMode="single"
              selectedKeys={selectedCategory}
              isRequired
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
              className="w-full"
              labelPlacement="outside"
              label="Tags"
              placeholder="Select tags"
              selectionMode="multiple"
              selectedKeys={selectedTags}
              isRequired
              onSelectionChange={(keys) =>
                setSelectedTags(new Set(keys as string))
              }
            >
              {(tags ?? []).map((tag) => (
                <SelectItem key={tag.slug}>{tag.name}</SelectItem>
              ))}
            </Select>
          </div>

          {success && <Alert color="success" title={success} />}
          {error && <Alert color="danger" title={error} />}

          <div className="w-full flex justify-end gap-2">
            <Button
              color="primary"
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Updating" : "Update"}
            </Button>

            <Button
              color="default"
              as={Link}
              className="w-full"
              href="/posts"
              startContent={<BsArrowLeftShort />}
            >
              Back to All Posts
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default EditPostPageClient;
