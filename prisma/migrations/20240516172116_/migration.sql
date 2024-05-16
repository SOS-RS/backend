/*
  Warnings:

  - Changed the type of `departure_datetime` on the `trips` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "departure_datetime",
ADD COLUMN     "departure_datetime" TIMESTAMP(3) NOT NULL;
