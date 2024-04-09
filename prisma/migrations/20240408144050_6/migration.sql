/*
  Warnings:

  - You are about to drop the column `billNumber` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billNumber" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "billNumber";
