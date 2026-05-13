-- AddColumn charityChoice
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "charityChoice" TEXT DEFAULT 'ocean-cleanup';
-- AddColumn totalContributed
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalContributed" DOUBLE PRECISION NOT NULL DEFAULT 0;
-- AddColumn contributionMonths
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "contributionMonths" INTEGER NOT NULL DEFAULT 0;
