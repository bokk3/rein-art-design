-- CreateTable
CREATE TABLE "translation_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translation_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "component_translations" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "pageBuilderId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "fieldPath" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "component_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "translation_keys_key_key" ON "translation_keys"("key");

-- CreateIndex
CREATE INDEX "translation_keys_category_idx" ON "translation_keys"("category");

-- CreateIndex
CREATE UNIQUE INDEX "translations_keyId_languageId_key" ON "translations"("keyId", "languageId");

-- CreateIndex
CREATE INDEX "translations_languageId_idx" ON "translations"("languageId");

-- CreateIndex
CREATE INDEX "translations_keyId_idx" ON "translations"("keyId");

-- CreateIndex
CREATE UNIQUE INDEX "component_translations_componentId_pageBuilderId_languageId_fieldPath_key" ON "component_translations"("componentId", "pageBuilderId", "languageId", "fieldPath");

-- CreateIndex
CREATE INDEX "component_translations_pageBuilderId_languageId_idx" ON "component_translations"("pageBuilderId", "languageId");

-- CreateIndex
CREATE INDEX "component_translations_componentId_idx" ON "component_translations"("componentId");

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "translation_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_translations" ADD CONSTRAINT "component_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

