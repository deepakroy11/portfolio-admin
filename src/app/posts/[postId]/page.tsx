"use client";
import {
  Form,
  Input,
  Button,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useState } from "react";
import posts from "@/data/blog_posts.json";
import { useParams } from "next/navigation";

export default function PostsPage() {
  const { postId } = useParams();
  const post = posts.find((p) => p.slug === postId);
  const [action, setAction] = useState<string | null>(null);

  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold">Post : {post?.title}</h1>
      </div>

      {/* Key Metrics */}
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

          <Textarea
            isRequired
            errorMessage="Please enter a valid summary"
            label="Summary"
            labelPlacement="outside"
            name="summary"
            placeholder="Enter post summary"
            value={post?.summary || ""}
          />
          <Textarea
            isRequired
            errorMessage="Please enter a valid description"
            label="Description (Main Content)"
            labelPlacement="outside"
            name="description"
            placeholder="Enter post description"
            value={post?.description || ""}
          />
          <div className="w-full flex flex-row gap-2">
            <div className="basis-1/5">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Select Category</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">New file</DropdownItem>
                  <DropdownItem key="copy">Copy link</DropdownItem>
                  <DropdownItem key="edit">Edit file</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Delete file
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="basis-1/5">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Select Tags</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="new">New file</DropdownItem>
                  <DropdownItem key="copy">Copy link</DropdownItem>
                  <DropdownItem key="edit">Edit file</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Delete file
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Submit
            </Button>
            <Button type="reset" variant="flat">
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
    </main>
  );
}
