/*
  Warnings:
  Por padrão o prisma dropa e recria a coluna do banco.
  Esse script usa um cast do postgres para converter as colunas para o tipo correto ao invés de dropá-las
  Assumo que as timestamp estão sendo salvas em UTC
  Para mudar a migration para setar as datas atuais para uma timezone específica, basta adicionar o statement "AT TIME ZONE" após a conversão
  alter table "category_supplies" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz  AT TIME ZONE 'America/Sao_Paulo';
*/

-- AlterTable
alter table "category_supplies" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "category_supplies" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable
alter table "sessions" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "sessions" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable
alter table "shelter_managers" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "shelter_managers" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable
alter table "shelter_supplies" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "shelter_supplies" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable
alter table "shelters" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "shelters" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable
alter table "supplies" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "supplies" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz;
-- AlterTable;
alter table "users" alter column "created_at" type TIMESTAMP using "created_at"::timestamptz;
alter table "users" alter column "updated_at" type TIMESTAMP using "updated_at"::timestamptz ; 

