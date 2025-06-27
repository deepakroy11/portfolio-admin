"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableCell,
  Spinner,
  TableRow,
  Button,
  Tooltip,
  Chip,
} from "@heroui/react";
import { BsArrowLeftSquareFill, BsPencilSquare } from "react-icons/bs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DateTime } from "next-auth/providers/kakao";

interface TaxonomyMeta {
  id: string;
  name: string;
  slug: string;
  taxonomyId: string;
  createdAt: DateTime;
}

type TaxonomyWithMetasProps = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  metas: TaxonomyMeta[];
};

const TaxonomyMetaPage = () => {
  const { slug } = useParams();
  const [taxonomyWithMetas, setTaxonomyWithMetas] =
    useState<TaxonomyWithMetasProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(taxonomyWithMetas);

  useEffect(() => {
    const getTaxonomyMeta = async () => {
      const response = await fetch(`/api/taxonomy/${slug}`);
      const data = await response.json();
      setIsLoading(false);
      setTaxonomyWithMetas(data);
    };
    if (slug) getTaxonomyMeta();
  }, [slug]);

  // Now taxonomyWithMetas.metas is your array of TaxonomyMeta

  return (
    <main className="flex-1 p-8 space-y-10">
      <div className="flex justify-between">
        <h1 className="text-2xl capitalize flex items-center justify-start space-x-2">
          <Tooltip content="Back to all taxonomies">
            <Link href="/taxonomies">
              <BsArrowLeftSquareFill className="w-6 h-6 me-2" />
            </Link>
          </Tooltip>
          <strong>Taxonomy: </strong> {slug}{" "}
          {taxonomyWithMetas?.metas && (
            <Chip radius="full" variant="shadow" className="ms-2">
              {taxonomyWithMetas?.metas.length}
            </Chip>
          )}
        </h1>
        <Button as={Link} href={`/taxonomies/${slug}/add`}>
          Add Meta Data for <strong className="capitalize">{slug}</strong>
        </Button>
      </div>

      <Table aria-label="Taxonomy table">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Slug</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="No meta data is available."
          isLoading={isLoading}
          items={taxonomyWithMetas?.metas ?? []}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(taxonomyWithMetas?.metas ?? []).map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`#`}>
                  <BsPencilSquare className="w-5 h-5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default TaxonomyMetaPage;
