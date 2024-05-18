-- CreateEnum
CREATE TYPE "ShelterCategory" AS ENUM ('Shelter', 'DistributionCenter');

-- AlterTable
ALTER TABLE "shelters" ADD COLUMN     "actived" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "category" "ShelterCategory" NOT NULL DEFAULT 'Shelter';
