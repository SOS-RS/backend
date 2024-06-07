-- CreateTable
CREATE TABLE "shelter_users" (
    "user_id" TEXT NOT NULL,
    "shelter_id" TEXT NOT NULL,
    "created_at" VARCHAR(32) NOT NULL,

    CONSTRAINT "shelter_users_pkey" PRIMARY KEY ("user_id","shelter_id")
);

-- AddForeignKey
ALTER TABLE "shelter_users" ADD CONSTRAINT "shelter_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_users" ADD CONSTRAINT "shelter_users_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "shelters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
