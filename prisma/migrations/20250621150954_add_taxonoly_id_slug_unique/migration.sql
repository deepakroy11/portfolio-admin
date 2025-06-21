/*
  Warnings:

  - A unique constraint covering the columns `[taxonomyId,slug]` on the table `TaxonomyMeta` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TaxonomyMeta_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyMeta_taxonomyId_slug_key" ON "TaxonomyMeta"("taxonomyId", "slug");
