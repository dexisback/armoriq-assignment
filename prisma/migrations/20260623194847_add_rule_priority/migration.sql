/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Rule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "updatedAt",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 100;
