/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `category_supplies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "shelters" ALTER COLUMN "pix" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_supplies_name_key" ON "category_supplies"("name");
