-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "iconName" TEXT NOT NULL DEFAULT 'Handshake',
    "created_at" VARCHAR(32) NOT NULL,
    "updated_at" VARCHAR(32),

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");
