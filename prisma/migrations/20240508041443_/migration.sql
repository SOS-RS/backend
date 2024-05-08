/*
  Warnings:

  - You are about to drop the column `priority` on the `supplies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shelter_supplies" ALTER COLUMN "priority" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "supplies" DROP COLUMN "priority";
