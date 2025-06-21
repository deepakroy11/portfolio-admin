"use client";

import {
  Button,
  Link,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  Spinner,
} from "@heroui/react";
import type { Taxonomy } from "@prisma/client";
import { useEffect, useState } from "react";

export default function TaxonomyAddPage() {
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]); // start with an empty array to prevent `.map()` on undefined
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTaxonomies = async () => {
      const response = await fetch("/api/taxonomy");
      const data = await response.json();
      setTaxonomies(data); // <- Fix: set to actual fetched data
      setIsLoading(false);
    };

    getTaxonomies(); // <- Don't forget to actually call the function!
  }, []);

  return (
    <main className="flex-1 p-8 space-y-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Taxonomies</h1>
        <Button href="/taxonomies/add" as={Link}>
          New Taxonomy
        </Button>
      </div>

      <Table aria-label="Taxonomy table">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Slug</TableColumn>
          <TableColumn>Created At</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="No rows to display."
          isLoading={isLoading}
          items={taxonomies}
          loadingContent={<Spinner label="Loading..." />}
        >
          {taxonomies.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Link href={`taxonomies/${item.slug}`} color="foreground">
                  {item.name}
                </Link>
              </TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
