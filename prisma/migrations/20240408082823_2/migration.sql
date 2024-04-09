/*
  Warnings:

  - Added the required column `foodItemId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "foodItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "mode" SET DEFAULT 'CASH';

-- CreateTable
CREATE TABLE "foodItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "foodItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "foodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
