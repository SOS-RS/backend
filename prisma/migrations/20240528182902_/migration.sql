-- CreateEnum
CREATE TYPE "SupplyMeasure" AS ENUM ('Unit', 'Kg', 'Litters', 'Box', 'Piece');

-- CreateEnum
CREATE TYPE "DonationOrderStatus" AS ENUM ('Pending', 'Canceled', 'Complete');

-- AlterTable
ALTER TABLE "supplies" ADD COLUMN     "measure" "SupplyMeasure" NOT NULL DEFAULT 'Unit';

-- CreateTable
CREATE TABLE "donation_order_supplies" (
    "id" TEXT NOT NULL,
    "donation_order_id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "donation_order_supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "status" "DonationOrderStatus" NOT NULL DEFAULT 'Pending',
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "donation_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donation_order_supplies" ADD CONSTRAINT "donation_order_supplies_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_order_supplies" ADD CONSTRAINT "donation_order_supplies_donation_order_id_fkey" FOREIGN KEY ("donation_order_id") REFERENCES "donation_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_orders" ADD CONSTRAINT "donation_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_orders" ADD CONSTRAINT "donation_orders_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
