/*
  Warnings:

  - You are about to drop the column `status` on the `supplies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "supplies" DROP COLUMN "status",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "SupplyStatus";
