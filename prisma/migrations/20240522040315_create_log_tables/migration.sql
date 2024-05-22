-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "user_id" TEXT,
    "ip" TEXT,
    "previous_value" JSONB,
    "current_value" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_updates_log" (
    "id" TEXT NOT NULL,
    "supply_name" TEXT,
    "shelter_name" TEXT,
    "ip_address" TEXT,
    "previousPriority" INTEGER,
    "currentPriority" INTEGER,
    "previousQuantity" INTEGER,
    "currentQuantity" INTEGER,
    "user_id" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_updates_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
