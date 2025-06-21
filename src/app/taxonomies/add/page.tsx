"use client";

import { Button, Input, Form, Alert } from "@heroui/react";
import { createTaxonomy } from "@/actions/create-taxonomy";
import { FormEvent, useActionState, useState } from "react";

export default function TaxonomyAddPage() {
  const [formState, formAction, isLoading] = useActionState(createTaxonomy, {
    success: false,
  });

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setName(name);
    setSlug(name.toLocaleLowerCase().trim().replace(/\s+/g, "-"));
  };

  return (
    <main className="flex-1 p-8 space-y-10">
      <h1 className="text-3xl font-bold">Create New Taxonomy</h1>

      <Form action={formAction} className="max-w-2xl space-y-4">
        <Input
          name="name"
          label="Name"
          labelPlacement="outside"
          placeholder="Enter category name"
          value={name}
          onChange={handleNameChange}
          isRequired
        />
        <Input
          name="slug"
          label="Slug"
          labelPlacement="outside"
          placeholder="Enter slug name"
          value={slug}
          isRequired
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>

        {formState?.error && <Alert color="danger" title={formState.error} />}
      </Form>
    </main>
  );
}
