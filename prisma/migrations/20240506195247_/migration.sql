-- CreateTable
CREATE TABLE "shelter_managers" (
    "shelter_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "shelter_managers_pkey" PRIMARY KEY ("shelter_id","user_id")
);

-- AddForeignKey
ALTER TABLE "shelter_managers" ADD CONSTRAINT "shelter_managers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_managers" ADD CONSTRAINT "shelter_managers_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
