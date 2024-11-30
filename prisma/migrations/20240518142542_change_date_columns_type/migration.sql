/*
  Warnings:

  - The `created_at` column on the `partners` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `partners` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_at` column on the `supporters` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `supporters` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/

-- AlterTable;
alter table "partners" alter column "created_at" type TIMESTAMPTZ using "created_at"::timestamptz;
alter table "partners" alter column "created_at"  set default CURRENT_TIMESTAMP;
alter table "partners" alter column "updated_at" type TIMESTAMPTZ using "updated_at"::timestamptz ;

-- AlterTable;
alter table "supporters" alter column "created_at" type TIMESTAMPTZ using "created_at"::timestamptz;
alter table "supporters" alter column "created_at"  set default CURRENT_TIMESTAMP;
alter table "supporters" alter column "updated_at" type TIMESTAMPTZ using "updated_at"::timestamptz ;

