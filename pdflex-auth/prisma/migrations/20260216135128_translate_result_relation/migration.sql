-- AlterTable
ALTER TABLE "TranslateJob" ADD COLUMN     "resultFileId" TEXT;

-- AddForeignKey
ALTER TABLE "TranslateJob" ADD CONSTRAINT "TranslateJob_resultFileId_fkey" FOREIGN KEY ("resultFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
