/*
  Warnings:

  - You are about to drop the column `quantityConverted` on the `MovementDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MovementDetail" DROP COLUMN "quantityConverted",
ADD COLUMN     "convertedQuantity" DECIMAL(10,2);
