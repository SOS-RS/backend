-- CreateTable
CREATE TABLE "supplies_history" (
    "id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "priority" INTEGER,
    "quantity" INTEGER,
    "created_at" VARCHAR(32) NOT NULL,

    CONSTRAINT "supplies_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplies_history_shelter_id_supply_id_idx" ON "supplies_history"("shelter_id", "supply_id");

-- AddForeignKey
ALTER TABLE "supplies_history" ADD CONSTRAINT "supplies_history_shelter_id_supply_id_fkey" FOREIGN KEY ("shelter_id", "supply_id") REFERENCES "shelter_supplies"("shelter_id", "supply_id") ON DELETE RESTRICT ON UPDATE CASCADE;
