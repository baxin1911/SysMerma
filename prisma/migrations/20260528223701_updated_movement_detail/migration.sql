-- AlterTable
ALTER TABLE "MovementDetail" ADD COLUMN     "productBase" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "productHeight" DECIMAL(10,2) NOT NULL DEFAULT 0;
