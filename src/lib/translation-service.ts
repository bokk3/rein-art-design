import { prisma } from './db'
import { TranslationKey, Translation, ComponentTranslation, Language } from '@prisma/client'

// Cache for translations (in-memory, can be replaced with Redis in production)
const translationCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export interface TranslationKeyWithTranslations extends TranslationKey {
  translations: (Translation & {
    language: Language
  })[]
}

export interface CreateTranslationKeyData {
  key: string
  category: string
  description?: string
  translations?: {
    languageId: string
    value: string
  }[]
}

export interface UpdateTranslationKeyData {
  key?: string
  category?: string
  description?: string
}

export interface CreateTranslationData {
  keyId: string
  languageId: string
  value: string
}

export interface ComponentTranslationData {
  componentId: string
  pageBuilderId: string
  languageId: string
  fieldPath: string
  value: string
}

export interface GetComponentTranslationsParams {
  componentId: string
  pageBuilderId: string
  languageCode: string
  fallbackLanguageCode?: string
}

export class TranslationService {
  /**
   * Get default language code
   */
  static async getDefaultLanguageCode(): Promise<string> {
    const defaultLang = await prisma.language.findFirst({
      where: { isDefault: true, isActive: true }
    })
    return defaultLang?.code || 'nl'
  }

  /**
   * Get active languages
   */
  static async getActiveLanguages(): Promise<Language[]> {
    return prisma.language.findMany({
      where: { isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { code: 'asc' }
      ]
    })
  }

  /**
   * Get translation for a key with fallback logic
   * Tries: preferred language -> default language -> first available
   */
  static async getTranslation(
    key: string,
    languageCode: string,
    fallbackLanguageCode?: string
  ): Promise<string | null> {
    // Check cache first
    const cacheKey = `${key}:${languageCode}`
    const cached = translationCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.value
    }

    // Get language IDs
    const [preferredLang, fallbackLang, defaultLang] = await Promise.all([
      prisma.language.findUnique({ where: { code: languageCode } }),
      fallbackLanguageCode
        ? prisma.language.findUnique({ where: { code: fallbackLanguageCode } })
        : null,
      prisma.language.findFirst({ where: { isDefault: true, isActive: true } })
    ])

    // Try preferred language
    if (preferredLang) {
      const translation = await prisma.translation.findFirst({
        where: {
          key: { key },
          languageId: preferredLang.id
        },
        include: { key: true }
      })

      if (translation) {
        translationCache.set(cacheKey, { value: translation.value, timestamp: Date.now() })
        return translation.value
      }
    }

    // Try fallback language
    if (fallbackLang && fallbackLang.id !== preferredLang?.id) {
      const translation = await prisma.translation.findFirst({
        where: {
          key: { key },
          languageId: fallbackLang.id
        },
        include: { key: true }
      })

      if (translation) {
        translationCache.set(cacheKey, { value: translation.value, timestamp: Date.now() })
        return translation.value
      }
    }

    // Try default language
    if (defaultLang && defaultLang.id !== preferredLang?.id && defaultLang.id !== fallbackLang?.id) {
      const translation = await prisma.translation.findFirst({
        where: {
          key: { key },
          languageId: defaultLang.id
        },
        include: { key: true }
      })

      if (translation) {
        translationCache.set(cacheKey, { value: translation.value, timestamp: Date.now() })
        return translation.value
      }
    }

    // Try any available translation
    const anyTranslation = await prisma.translation.findFirst({
      where: {
        key: { key }
      },
      include: { key: true }
    })

    if (anyTranslation) {
      translationCache.set(cacheKey, { value: anyTranslation.value, timestamp: Date.now() })
      return anyTranslation.value
    }

    return null
  }

  /**
   * Get multiple translations at once (batch operation)
   */
  static async getTranslations(
    keys: string[],
    languageCode: string,
    fallbackLanguageCode?: string
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {}

    // Get all translations in parallel
    const translations = await Promise.all(
      keys.map(key => this.getTranslation(key, languageCode, fallbackLanguageCode))
    )

    keys.forEach((key, index) => {
      if (translations[index]) {
        results[key] = translations[index]!
      }
    })

    return results
  }

  /**
   * Get translation key by key string
   */
  static async getTranslationKey(key: string): Promise<TranslationKeyWithTranslations | null> {
    return prisma.translationKey.findUnique({
      where: { key },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Get all translation keys with optional filtering
   */
  static async getAllTranslationKeys(filters?: {
    category?: string
    search?: string
  }): Promise<TranslationKeyWithTranslations[]> {
    const where: any = {}

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.search) {
      where.OR = [
        { key: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    return prisma.translationKey.findMany({
      where,
      include: {
        translations: {
          include: {
            language: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    })
  }

  /**
   * Create a translation key with optional translations
   */
  static async createTranslationKey(
    data: CreateTranslationKeyData
  ): Promise<TranslationKeyWithTranslations> {
    const { translations, ...keyData } = data

    return prisma.translationKey.create({
      data: {
        ...keyData,
        ...(translations && translations.length > 0 && {
          translations: {
            create: translations
          }
        })
      },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Update a translation key
   */
  static async updateTranslationKey(
    id: string,
    data: UpdateTranslationKeyData
  ): Promise<TranslationKeyWithTranslations> {
    // Clear cache for this key
    const key = await prisma.translationKey.findUnique({ where: { id } })
    if (key) {
      this.clearCacheForKey(key.key)
    }

    return prisma.translationKey.update({
      where: { id },
      data,
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Delete a translation key (cascades to translations)
   */
  static async deleteTranslationKey(id: string): Promise<void> {
    const key = await prisma.translationKey.findUnique({ where: { id } })
    if (key) {
      this.clearCacheForKey(key.key)
    }

    await prisma.translationKey.delete({
      where: { id }
    })
  }

  /**
   * Create or update a translation
   */
  static async upsertTranslation(data: CreateTranslationData): Promise<Translation> {
    // Clear cache
    const key = await prisma.translationKey.findUnique({ where: { id: data.keyId } })
    if (key) {
      this.clearCacheForKey(key.key)
    }

    // Check if translation exists
    const existing = await prisma.translation.findFirst({
      where: {
        keyId: data.keyId,
        languageId: data.languageId
      }
    })

    if (existing) {
      return prisma.translation.update({
        where: { id: existing.id },
        data: { value: data.value }
      })
    } else {
      return prisma.translation.create({
        data
      })
    }
  }

  /**
   * Delete a translation
   */
  static async deleteTranslation(keyId: string, languageId: string): Promise<void> {
    const key = await prisma.translationKey.findUnique({ where: { id: keyId } })
    if (key) {
      this.clearCacheForKey(key.key)
    }

    const translation = await prisma.translation.findFirst({
      where: {
        keyId,
        languageId
      }
    })

    if (translation) {
      await prisma.translation.delete({
        where: { id: translation.id }
      })
    }
  }

  /**
   * Get component translations for a specific component and language
   */
  static async getComponentTranslations(
    params: GetComponentTranslationsParams
  ): Promise<Record<string, string>> {
    const { componentId, pageBuilderId, languageCode, fallbackLanguageCode } = params

    // Get language IDs
    const [preferredLang, fallbackLang, defaultLang] = await Promise.all([
      prisma.language.findUnique({ where: { code: languageCode } }),
      fallbackLanguageCode
        ? prisma.language.findUnique({ where: { code: fallbackLanguageCode } })
        : null,
      prisma.language.findFirst({ where: { isDefault: true, isActive: true } })
    ])

    const translations: Record<string, string> = {}

    // Try preferred language
    if (preferredLang) {
      const preferredTranslations = await prisma.componentTranslation.findMany({
        where: {
          componentId,
          pageBuilderId,
          languageId: preferredLang.id
        }
      })

      preferredTranslations.forEach(t => {
        translations[t.fieldPath] = t.value
      })
    }

    // Fill in missing translations from fallback
    if (fallbackLang && fallbackLang.id !== preferredLang?.id) {
      const missingPaths = Object.keys(translations).length === 0
        ? await prisma.componentTranslation.findMany({
            where: {
              componentId,
              pageBuilderId,
              languageId: fallbackLang.id
            }
          })
        : []

      missingPaths.forEach(t => {
        if (!translations[t.fieldPath]) {
          translations[t.fieldPath] = t.value
        }
      })
    }

    // Fill in missing translations from default
    if (defaultLang && defaultLang.id !== preferredLang?.id && defaultLang.id !== fallbackLang?.id) {
      const allPaths = await prisma.componentTranslation.findMany({
        where: {
          componentId,
          pageBuilderId
        },
        distinct: ['fieldPath']
      })

      const missingPaths = allPaths
        .map(t => t.fieldPath)
        .filter(path => !translations[path])

      if (missingPaths.length > 0) {
        const defaultTranslations = await prisma.componentTranslation.findMany({
          where: {
            componentId,
            pageBuilderId,
            languageId: defaultLang.id,
            fieldPath: { in: missingPaths }
          }
        })

        defaultTranslations.forEach(t => {
          if (!translations[t.fieldPath]) {
            translations[t.fieldPath] = t.value
          }
        })
      }
    }

    return translations
  }

  /**
   * Save component translations (upsert)
   */
  static async saveComponentTranslations(
    translations: ComponentTranslationData[]
  ): Promise<ComponentTranslation[]> {
    return Promise.all(
      translations.map(async t => {
        // Check if translation exists
        const existing = await prisma.componentTranslation.findFirst({
          where: {
            componentId: t.componentId,
            pageBuilderId: t.pageBuilderId,
            languageId: t.languageId,
            fieldPath: t.fieldPath
          }
        })

        if (existing) {
          return prisma.componentTranslation.update({
            where: { id: existing.id },
            data: { value: t.value }
          })
        } else {
          return prisma.componentTranslation.create({
            data: t
          })
        }
      })
    )
  }

  /**
   * Delete component translations
   */
  static async deleteComponentTranslations(
    componentId: string,
    pageBuilderId: string,
    languageId?: string
  ): Promise<void> {
    await prisma.componentTranslation.deleteMany({
      where: {
        componentId,
        pageBuilderId,
        ...(languageId && { languageId })
      }
    })
  }

  /**
   * Get translation coverage statistics
   */
  static async getTranslationCoverage(languageCode: string): Promise<{
    totalKeys: number
    translatedKeys: number
    coverage: number
    missingKeys: string[]
  }> {
    const language = await prisma.language.findUnique({ where: { code: languageCode } })
    if (!language) {
      return { totalKeys: 0, translatedKeys: 0, coverage: 0, missingKeys: [] }
    }

    const [totalKeys, translatedKeys] = await Promise.all([
      prisma.translationKey.count(),
      prisma.translation.count({
        where: { languageId: language.id }
      })
    ])

    const allKeys = await prisma.translationKey.findMany({
      select: { id: true, key: true }
    })

    const translatedKeyIds = await prisma.translation.findMany({
      where: { languageId: language.id },
      select: { keyId: true }
    })

    const translatedKeyIdSet = new Set(translatedKeyIds.map(t => t.keyId))
    const missingKeys = allKeys
      .filter(k => !translatedKeyIdSet.has(k.id))
      .map(k => k.key)

    return {
      totalKeys,
      translatedKeys,
      coverage: totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0,
      missingKeys
    }
  }

  /**
   * Clear cache for a specific key
   */
  private static clearCacheForKey(key: string): void {
    const keysToDelete: string[] = []
    translationCache.forEach((_, cacheKey) => {
      if (cacheKey.startsWith(`${key}:`)) {
        keysToDelete.push(cacheKey)
      }
    })
    keysToDelete.forEach(k => translationCache.delete(k))
  }

  /**
   * Clear entire translation cache
   */
  static clearCache(): void {
    translationCache.clear()
  }
}

