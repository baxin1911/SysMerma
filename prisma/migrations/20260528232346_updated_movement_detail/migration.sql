/*
  Warnings:

  - Made the column `type` on table `InventoryMovement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InventoryMovement" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "MovementDetail" ALTER COLUMN "productBase" DROP NOT NULL,
ALTER COLUMN "productBase" DROP DEFAULT,
ALTER COLUMN "productHeight" DROP NOT NULL,
ALTER COLUMN "productHeight" DROP DEFAULT;
