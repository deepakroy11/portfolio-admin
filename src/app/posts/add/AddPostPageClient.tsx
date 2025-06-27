"use client";

import {
  Button,
  Form,
  Input,
  Link,
  Select,
  SelectItem,
  Textarea,
  Alert,
  Image,
} from "@heroui/react";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

interface TaxonomyMeta {
  id: string;
  name: string;
  slug: string;
  taxonomyId: string;
}

interface PostPageClientProps {
  categories: TaxonomyMeta[];
  tags: TaxonomyMeta[];
}

const PostPageClient = ({ categories, tags }: PostPageClientProps) => {
  const [postSaving, setPostSaving] = useState(false);
  const [selectedTags, setSelectedTags] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChang = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTags(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setName(name);
    setSlug(name.toLocaleLowerCase().trim().replace(/\s+/g, "-"));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPostSaving(true);

    const formData = new FormData(event.currentTarget);
    formData.append("tagsId", selectedTags);

    const response = await fetch("/api/post", {
      method: "POST",
      body: formData, // Send as FormData instead of JSON
    });
    const result = await response.json();
    if (response.ok) {
      setSuccess(result.message || "Post saved successfully.");
      setTimeout(() => setSuccess(null), 3000);
      setPostSaving(false);

      //Reset form
      formRef.current?.reset();
      setName("");
      setSlug("");
      setSelectedTags("");
    } else {
      setError(result.error || "Something went wrong...");
      setTimeout(() => setError(null), 3000);
      setPostSaving(false);
    }
  };

  return (
    <main className="flex-1 p-8 space-y-10">
      <div className="w-full max-w-4xl flex justify-between">
        <h1 className="text-3xl font-bold">Add Post</h1>
      </div>

      <section>
        <Form
          ref={formRef}
          className="max-w-2xl space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            name="title"
            label="Title"
            labelPlacement="outside"
            placeholder="Enter post title"
            value={name}
            onChange={handleNameChange}
            isRequired
          />
          <Input
            name="slug"
            label="Slug"
            labelPlacement="outside"
            placeholder="Enter post slug"
            value={slug}
            isRequired
          />

          <div className="w-full flex justify-start items-center bg-default-100 rounded-2xl p-2 py-4 space-x-2">
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
                className="w-64 h-auto rounded-2xl shadow"
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

          <Textarea
            name="summary"
            label="Summary"
            labelPlacement="outside"
            isRequired
          />
          <Textarea
            name="content"
            label="Post Content"
            labelPlacement="outside"
            isRequired
          />
          <div className="w-full flex flex-row gap-2">
            <Select
              name="categoryId"
              placeholder="Select a category"
              label="Category"
              labelPlacement="outside"
              selectionMode="single"
              isRequired
            >
              {(categories ?? []).map((category) => (
                <SelectItem key={category.id}>{category.name}</SelectItem>
              ))}
            </Select>
            <Select
              name="tagsId"
              label="Tags"
              labelPlacement="outside"
              placeholder="Select tags"
              selectionMode="multiple"
              onChange={handleTagChange}
              isRequired
            >
              {(tags ?? []).map((tag) => (
                <SelectItem key={tag.id}>{tag.name}</SelectItem>
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
              disabled={postSaving}
              isLoading={postSaving}
            >
              {postSaving ? "Saving..." : "Save"}
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
          {/* {formState?.error && <Alert color="danger" title={formState.error} />} */}
        </Form>
      </section>
    </main>
  );
};

export default PostPageClient;
