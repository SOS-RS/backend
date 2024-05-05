/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `shelters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `shelters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shelters" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shelters_name_key" ON "shelters"("name");
