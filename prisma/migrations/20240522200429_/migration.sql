/*
  Warnings:

  - You are about to drop the column `sucessor_id` on the `supplies_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[predecessor_id]` on the table `supplies_history` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "supplies_history" DROP CONSTRAINT "supplies_history_sucessor_id_fkey";

-- DropIndex
DROP INDEX "supplies_history_sucessor_id_key";

-- AlterTable
ALTER TABLE "supplies_history" DROP COLUMN "sucessor_id",
ADD COLUMN     "predecessor_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "supplies_history_predecessor_id_key" ON "supplies_history"("predecessor_id");

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_predecessor_id_fkey" FOREIGN KEY ("predecessor_id") REFERENCES "supplies_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;
