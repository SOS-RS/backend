/*
  Warnings:

  - Added the required column `departure_state` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "departure_state" "State" NOT NULL;
