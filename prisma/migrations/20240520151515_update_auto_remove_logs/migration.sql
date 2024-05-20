/*
  Warnings:

  - You are about to drop the column `created_at` on the `supply_auto_remove_logs` table. All the data in the column will be lost.
  - Added the required column `removed_at` to the `supply_auto_remove_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "supply_auto_remove_logs" DROP COLUMN "created_at",
ADD COLUMN     "removed_at" VARCHAR(32) NOT NULL;
