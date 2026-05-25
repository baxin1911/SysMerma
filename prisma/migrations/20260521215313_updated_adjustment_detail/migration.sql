-- AlterTable
ALTER TABLE "MovementDetail" ADD COLUMN     "stockAdjustmentDetailId" UUID;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_stockAdjustmentDetailId_fkey" FOREIGN KEY ("stockAdjustmentDetailId") REFERENCES "StockAdjustmentDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
