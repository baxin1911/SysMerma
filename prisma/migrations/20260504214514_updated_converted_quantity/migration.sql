/*
  Warnings:

  - You are about to drop the column `convertedQuantity` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "convertedQuantity";

-- AlterTable
ALTER TABLE "SupplierProduct" ADD COLUMN     "convertedQuantity" DECIMAL(10,3);
