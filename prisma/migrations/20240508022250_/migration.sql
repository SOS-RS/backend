/*
  Warnings:

  - You are about to drop the column `shelter_id` on the `supplies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "supplies" DROP CONSTRAINT "supplies_shelter_id_fkey";

-- AlterTable
ALTER TABLE "supplies" DROP COLUMN "shelter_id";
