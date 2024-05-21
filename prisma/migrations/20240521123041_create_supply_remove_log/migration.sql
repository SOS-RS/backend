-- CreateTable
CREATE TABLE "supply_auto_remove_logs" (
    "id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "removed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supply_auto_remove_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "supply_auto_remove_logs" ADD CONSTRAINT "supply_auto_remove_logs_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_auto_remove_logs" ADD CONSTRAINT "supply_auto_remove_logs_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
