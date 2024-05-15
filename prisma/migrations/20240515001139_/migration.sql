-- CreateTable
CREATE TABLE "transports" (
    "id" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "vehicle_registration_plate" TEXT,
    "contact" TEXT,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_managers" (
    "transport_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "transport_managers_pkey" PRIMARY KEY ("transport_id","user_id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "transport_id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "departure_city" TEXT NOT NULL,
    "departure_datetime" TIMESTAMP(3) NOT NULL,
    "contact" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transport_managers" ADD CONSTRAINT "transport_managers_transport_id_fkey" FOREIGN KEY ("transport_id") REFERENCES "transports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_managers" ADD CONSTRAINT "transport_managers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_transport_id_fkey" FOREIGN KEY ("transport_id") REFERENCES "transports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
