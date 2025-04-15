/*
  Warnings:

  - You are about to drop the column `userId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `currentBalance` on the `User` table. All the data in the column will be lost.
  - Added the required column `householdId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `householdId` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'transfer';

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "userId",
ADD COLUMN     "householdId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "userId",
ADD COLUMN     "householdId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentBalance";

-- CreateTable
CREATE TABLE "Household" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseholdUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "householdId" INTEGER NOT NULL,

    CONSTRAINT "HouseholdUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdUser_userId_householdId_key" ON "HouseholdUser"("userId", "householdId");

-- AddForeignKey
ALTER TABLE "HouseholdUser" ADD CONSTRAINT "HouseholdUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseholdUser" ADD CONSTRAINT "HouseholdUser_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
