/*
  Warnings:

  - You are about to drop the column `sheltered_people` on the `shelters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shelters" RENAME COLUMN "sheltered_people" TO "total_sheltered_people";

-- CreateTable
CREATE TABLE "sheltered_people" (
    "id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "gender" TEXT,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "sheltered_people_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sheltered_people" ADD CONSTRAINT "sheltered_people_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
