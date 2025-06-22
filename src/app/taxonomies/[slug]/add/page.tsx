"use client";

import { Form, Input, Button, Link, Alert, Tooltip } from "@heroui/react";
import { useActionState, use, useState } from "react";
import { createTexonomyMeta } from "@/actions/create-taxonomy-meta";
import { BsArrowLeftSquareFill } from "react-icons/bs";

const TaxonomyMetaPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug: taxonomy } = use(params);
  const [formState, formAction, isLoading] = useActionState(
    createTexonomyMeta,
    {
      success: false,
    }
  );

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    setSlug(name.toLocaleLowerCase().trim().replace(/\s+/g, "-"));
  };

  return (
    <main className="flex-1 p-8 space-y-10">
      <h1 className="text-2xl flex items-center justify-start">
        <Tooltip content={`Back to ${taxonomy}'s meta`}>
          <Link href={`/taxonomies/${taxonomy}`}>
            <BsArrowLeftSquareFill className="w-6 h-6 me-2" />
          </Link>
        </Tooltip>
        Add meta value for Taxonomy:
        <strong className="capitalize"> {taxonomy}</strong>
      </h1>
      <section>
        <Form action={formAction} className="max-w-2xl space-y-4">
          <Input
            name="name"
            label="Name"
            labelPlacement="outside"
            placeholder="Enter meta name"
            value={name}
            onChange={handleNameChange}
            isRequired
          />
          <Input name="taxonomy" type="hidden" value={taxonomy} />
          <Input
            name="slug"
            label="Slug"
            labelPlacement="outside"
            placeholder="Enter meta slug"
            value={slug}
            isRequired
          />
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          {formState?.error && <Alert color="danger" title={formState.error} />}
        </Form>
      </section>
    </main>
  );
};

export default TaxonomyMetaPage;
