/*
  Warnings:

  - You are about to drop the column `currentPriority` on the `supplies_history` table. All the data in the column will be lost.
  - You are about to drop the column `currentQuantity` on the `supplies_history` table. All the data in the column will be lost.
  - You are about to drop the column `previousPriority` on the `supplies_history` table. All the data in the column will be lost.
  - You are about to drop the column `previousQuantity` on the `supplies_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "supplies_history" RENAME COLUMN "currentPriority" TO "current_priority";
ALTER TABLE "supplies_history" RENAME COLUMN "currentQuantity" TO "current_quantity";
ALTER TABLE "supplies_history" RENAME COLUMN "previousPriority" TO "previous_priority";
ALTER TABLE "supplies_history" RENAME COLUMN "previousQuantity" TO "previous_quantity";
