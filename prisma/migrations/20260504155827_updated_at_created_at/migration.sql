/*
  Warnings:

  - Added the required column `updatedAt` to the `GoodsIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GoodsIssueDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GoodsReceipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GoodsReceiptDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MovementDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PurchaseRequisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PurchaseRequisitionDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoodsIssue" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GoodsIssueDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GoodsReceipt" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GoodsReceiptDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InventoryMovement" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MovementDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseRequisition" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseRequisitionDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
