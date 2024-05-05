-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('User', 'Staff');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accessLevel" "AccessLevel" NOT NULL DEFAULT 'User';
