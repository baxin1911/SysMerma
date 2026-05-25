/*
  Warnings:

  - You are about to alter the column `base` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to alter the column `height` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[referenceNumber]` on the table `GoodsIssue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referenceNumber]` on the table `InventoryMovement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockAdjustmentId]` on the table `InventoryMovement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AdjustmentStatus" AS ENUM ('PENDING', 'APPLIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockAdjustmentType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('ENTRY', 'ISSUE', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "InventoryMovement" ADD COLUMN     "referenceNumber" VARCHAR(50),
ADD COLUMN     "stockAdjustmentId" UUID,
ADD COLUMN     "type" "InventoryMovementType";

-- AlterTable
ALTER TABLE "MovementDetail" ADD COLUMN     "previousConvertedQuantity" DECIMAL(10,2),
ADD COLUMN     "previousStock" DECIMAL(10,2),
ADD COLUMN     "quantityConverted" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "base" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "height" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "StockAdjustment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "type" "StockAdjustmentType" NOT NULL,
    "reasonId" UUID NOT NULL,
    "observations" VARCHAR(255),
    "status" "AdjustmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" UUID NOT NULL,
    "approvedById" UUID,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAdjustmentDetail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stockAdjustmentId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "previousStock" DECIMAL(10,2) NOT NULL,
    "newStock" DECIMAL(10,2) NOT NULL,
    "difference" DECIMAL(10,2) NOT NULL,
    "previousConvertedQuantity" DECIMAL(10,2) NOT NULL,
    "newConvertedQuantity" DECIMAL(10,2) NOT NULL,
    "convertedDifference" DECIMAL(10,2) NOT NULL,
    "productBase" DECIMAL(10,2),
    "productHeight" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockAdjustmentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAdjustmentReason" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockAdjustmentReason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockAdjustment_referenceNumber_key" ON "StockAdjustment"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StockAdjustmentReason_name_key" ON "StockAdjustmentReason"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsIssue_referenceNumber_key" ON "GoodsIssue"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryMovement_referenceNumber_key" ON "InventoryMovement"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryMovement_stockAdjustmentId_key" ON "InventoryMovement"("stockAdjustmentId");

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_stockAdjustmentId_fkey" FOREIGN KEY ("stockAdjustmentId") REFERENCES "StockAdjustment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "StockAdjustmentReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustmentDetail" ADD CONSTRAINT "StockAdjustmentDetail_stockAdjustmentId_fkey" FOREIGN KEY ("stockAdjustmentId") REFERENCES "StockAdjustment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustmentDetail" ADD CONSTRAINT "StockAdjustmentDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustmentDetail" ADD CONSTRAINT "StockAdjustmentDetail_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
