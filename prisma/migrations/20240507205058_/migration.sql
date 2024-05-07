-- CreateTable
CREATE TABLE "shelter_supplies" (
    "shelter_id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "shelter_supplies_pkey" PRIMARY KEY ("shelter_id","supply_id")
);

-- AddForeignKey
ALTER TABLE "shelter_supplies" ADD CONSTRAINT "shelter_supplies_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_supplies" ADD CONSTRAINT "shelter_supplies_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
