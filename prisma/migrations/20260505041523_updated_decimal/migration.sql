/*
  Warnings:

  - You are about to alter the column `productBase` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `productHeight` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `convertedQuantity` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `maxUnitCost` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `projectConvertedQuantity` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `convertedQuantityDifference` on the `GoodsIssueDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `totalQuantity` on the `GoodsReceipt` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `totalNetPurchaseAmount` on the `GoodsReceipt` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `totalGrossPurchaseAmount` on the `GoodsReceipt` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `quantity` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `conversionUnitCost` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `costPerUnitType` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `convertedQuantity` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `netPurchaseAmount` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `grossPurchaseAmount` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `productBase` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `productHeight` on the `GoodsReceiptDetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `maxUnitCost` on the `SupplierProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `convertedQuantity` on the `SupplierProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "GoodsIssueDetail" ALTER COLUMN "productBase" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "productHeight" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "convertedQuantity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "maxUnitCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "projectConvertedQuantity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "convertedQuantityDifference" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "GoodsReceipt" ALTER COLUMN "totalQuantity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalNetPurchaseAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalGrossPurchaseAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "GoodsReceiptDetail" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "conversionUnitCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "costPerUnitType" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "convertedQuantity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "netPurchaseAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "grossPurchaseAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "productBase" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "productHeight" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "SupplierProduct" ALTER COLUMN "maxUnitCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "convertedQuantity" SET DATA TYPE DECIMAL(10,2);
