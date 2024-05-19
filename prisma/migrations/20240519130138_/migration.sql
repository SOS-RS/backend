-- CreateTable
CREATE TABLE "shelter_supply_logs" (
    "id" TEXT NOT NULL,
    "shelter_suply_shelter_id" TEXT NOT NULL,
    "shelter_suply_supply_id" TEXT NOT NULL,
    "priority" INTEGER,
    "quantity" INTEGER,
    "created_at" VARCHAR(32) NOT NULL,

    CONSTRAINT "shelter_supply_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shelter_supply_logs_shelter_suply_shelter_id_shelter_suply__idx" ON "shelter_supply_logs"("shelter_suply_shelter_id", "shelter_suply_supply_id");

-- AddForeignKey
ALTER TABLE "shelter_supply_logs" ADD CONSTRAINT "shelter_supply_logs_shelter_suply_shelter_id_shelter_suply_fkey" FOREIGN KEY ("shelter_suply_shelter_id", "shelter_suply_supply_id") REFERENCES "shelter_supplies"("shelter_id", "supply_id") ON DELETE RESTRICT ON UPDATE CASCADE;
