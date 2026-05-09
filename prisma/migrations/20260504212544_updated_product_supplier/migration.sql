/*
  Warnings:

  - You are about to drop the column `currentStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `maxUnitCost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SupplierProduct` table. All the data in the column will be lost.
  - Added the required column `currentStock` to the `SupplierProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "currentStock",
DROP COLUMN "maxUnitCost";

-- AlterTable
ALTER TABLE "SupplierProduct" DROP COLUMN "price",
ADD COLUMN     "currentStock" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "maxUnitCost" DECIMAL(10,3);
