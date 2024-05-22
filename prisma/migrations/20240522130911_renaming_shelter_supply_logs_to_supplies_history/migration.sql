/*
  Warnings:

  - You are about to drop the `item_updates_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "item_updates_log";

-- CreateTable
CREATE TABLE "supplies_history" (
    "id" TEXT NOT NULL,
    "supply_name" TEXT,
    "shelter_name" TEXT,
    "ip_address" TEXT,
    "previousPriority" INTEGER,
    "currentPriority" INTEGER,
    "previousQuantity" INTEGER,
    "currentQuantity" INTEGER,
    "user_id" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplies_history_pkey" PRIMARY KEY ("id")
);
