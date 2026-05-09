/*
  Warnings:

  - Made the column `convertedQuantity` on table `SupplierProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SupplierProduct" ALTER COLUMN "convertedQuantity" SET NOT NULL,
ALTER COLUMN "convertedQuantity" SET DEFAULT 0;
