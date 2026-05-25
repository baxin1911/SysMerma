-- AlterTable
ALTER TABLE "GoodsIssue" ALTER COLUMN "observations" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "GoodsReceipt" ALTER COLUMN "observations" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "PurchaseRequisition" ALTER COLUMN "observations" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "StockAdjustment" ALTER COLUMN "observations" SET DATA TYPE VARCHAR(500);
