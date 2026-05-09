/*
  Warnings:

  - Added the required column `supplierId` to the `MovementDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovementDetail" ADD COLUMN     "supplierId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
