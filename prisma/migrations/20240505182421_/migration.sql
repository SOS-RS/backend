-- CreateEnum
CREATE TYPE "SupplyStatus" AS ENUM ('UnderControl', 'Remaining', 'Needing', 'Urgent');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_supplies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "category_supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplies" (
    "id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "supply_category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SupplyStatus" NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelters" (
    "id" TEXT NOT NULL,
    "pix" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pet_friendly" BOOLEAN NOT NULL,
    "sheltered_people" INTEGER NOT NULL,
    "capacity" INTEGER,
    "contact" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "shelters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "shelters_pix_key" ON "shelters"("pix");

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_supply_category_id_fkey" FOREIGN KEY ("supply_category_id") REFERENCES "category_supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
