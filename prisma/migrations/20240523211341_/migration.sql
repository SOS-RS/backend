-- AlterTable
ALTER TABLE "supplies_history" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
