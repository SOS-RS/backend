/*
  Warnings:

  - A unique constraint covering the columns `[sucessor_id]` on the table `supplies_history` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "supplies_history" DROP CONSTRAINT "supplies_history_shelter_id_supply_id_fkey";

-- DropIndex
DROP INDEX "supplies_history_shelter_id_supply_id_idx";

-- AlterTable
ALTER TABLE "supplies_history" ADD COLUMN     "sucessor_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "supplies_history_sucessor_id_key" ON "supplies_history"("sucessor_id");

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_sucessor_id_fkey" FOREIGN KEY ("sucessor_id") REFERENCES "supplies_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
