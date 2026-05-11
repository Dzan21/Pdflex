/*
  Warnings:

  - You are about to drop the column `progress` on the `TranslateJob` table. All the data in the column will be lost.
  - You are about to drop the column `resultFileId` on the `TranslateJob` table. All the data in the column will be lost.
  - The `status` column on the `TranslateJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TranslateJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'ERROR');

-- DropForeignKey
ALTER TABLE "EmailToken" DROP CONSTRAINT "EmailToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "TranslateJob" DROP CONSTRAINT "TranslateJob_fileId_fkey";

-- DropForeignKey
ALTER TABLE "TranslateJob" DROP CONSTRAINT "TranslateJob_userId_fkey";

-- AlterTable
ALTER TABLE "TranslateJob" DROP COLUMN "progress",
DROP COLUMN "resultFileId",
DROP COLUMN "status",
ADD COLUMN     "status" "TranslateJobStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailToken" ADD CONSTRAINT "EmailToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslateJob" ADD CONSTRAINT "TranslateJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslateJob" ADD CONSTRAINT "TranslateJob_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
