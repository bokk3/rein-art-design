-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacyAccepted" BOOLEAN NOT NULL DEFAULT true;
