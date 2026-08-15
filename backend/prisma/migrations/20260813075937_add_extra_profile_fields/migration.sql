/*
  Warnings:

  - Added the required column `city` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherTongue` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `religion` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "motherTongue" TEXT NOT NULL,
ALTER COLUMN "religion" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL;
