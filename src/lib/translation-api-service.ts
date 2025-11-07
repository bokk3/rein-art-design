/**
 * Translation API Service
 * Supports DeepL, Google Translate, and LibreTranslate for automatic translation
 */

interface TranslationProvider {
  translate(text: string, from: string, to: string): Promise<string>
}

class DeepLProvider implements TranslationProvider {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.DEEPL_API_KEY || ''
    // Use free API if key ends with :fx (DeepL free tier indicator)
    const isFreeKey = this.apiKey.endsWith(':fx')
    this.apiUrl = isFreeKey 
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate'
  }

  async translate(text: string, from: string, to: string, retries = 3): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepL API key not configured. Please add DEEPL_API_KEY to your environment variables.')
    }

    // DeepL language code mapping
    const languageMap: Record<string, string> = {
      'nl': 'NL',
      'fr': 'FR',
      'en': 'EN',
      'de': 'DE',
      'es': 'ES',
      'it': 'IT',
      'pt': 'PT',
      'pl': 'PL',
      'ru': 'RU',
      'ja': 'JA',
      'zh': 'ZH',
      'zh-cn': 'ZH',
      'zh-hans': 'ZH',
      'zh-hant': 'ZH',
      'zh-tw': 'ZH',
    }

    // Normalize language codes (handle variants like zh-CN, zh-Hans, etc.)
    const normalizeLangCode = (code: string): string => {
      const lower = code.toLowerCase()
      // Handle Chinese variants
      if (lower.startsWith('zh')) {
        return 'ZH'
      }
      return languageMap[lower] || code.toUpperCase()
    }

    const sourceLang = normalizeLangCode(from)
    const targetLang = normalizeLangCode(to)

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            text,
            source_lang: sourceLang,
            target_lang: targetLang,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return data.translations[0].text
        }

        // Handle rate limiting (429) with exponential backoff
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const waitTime = retryAfter 
            ? parseInt(retryAfter) * 1000 
            : Math.min(1000 * Math.pow(2, attempt), 30000) // Max 30 seconds
          
          if (attempt < retries - 1) {
            console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${retries}`)
            await new Promise(resolve => setTimeout(resolve, waitTime))
            continue
          }
        }

        // For other errors, throw immediately
        const error = await response.text()
        throw new Error(`DeepL API error: ${response.status} ${error}`)
      } catch (error: any) {
        // If it's the last attempt or not a rate limit error, throw
        if (attempt === retries - 1 || !error.message?.includes('429')) {
          throw error
        }
        // Otherwise, wait and retry
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 30000)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    throw new Error('Translation failed after retries')
  }
}

class GoogleTranslateProvider implements TranslationProvider {
  private apiKey: string
  private apiUrl = 'https://translation.googleapis.com/language/translate/v2'

  constructor() {
    this.apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || ''
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key not configured')
    }

    // Normalize Chinese language codes for Google Translate
    const normalizeLangCode = (code: string): string => {
      const lower = code.toLowerCase()
      if (lower.startsWith('zh')) {
        // Google Translate uses 'zh' or 'zh-CN' for Simplified Chinese
        return lower.includes('hant') || lower.includes('tw') ? 'zh-TW' : 'zh'
      }
      return code
    }

    const sourceLang = normalizeLangCode(from)
    const targetLang = normalizeLangCode(to)

    const response = await fetch(
      `${this.apiUrl}?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Google Translate API error: ${error}`)
    }

    const data = await response.json()
    return data.data.translations[0].translatedText
  }
}

class LibreTranslateProvider implements TranslationProvider {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate'
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    // Normalize Chinese language codes for LibreTranslate
    const normalizeLangCode = (code: string): string => {
      const lower = code.toLowerCase()
      if (lower.startsWith('zh')) {
        // LibreTranslate uses 'zh' for Chinese
        return 'zh'
      }
      return code
    }

    const sourceLang = normalizeLangCode(from)
    const targetLang = normalizeLangCode(to)

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    })

    if (!response.ok) {
      throw new Error('LibreTranslate API error')
    }

    const data = await response.json()
    return data.translatedText
  }
}

export class TranslationAPIService {
  private provider: TranslationProvider

  constructor() {
    const providerType = process.env.TRANSLATION_PROVIDER || 'deepl'
    
    switch (providerType) {
      case 'deepl':
        this.provider = new DeepLProvider()
        break
      case 'google':
        this.provider = new GoogleTranslateProvider()
        break
      case 'libretranslate':
        this.provider = new LibreTranslateProvider()
        break
      default:
        throw new Error(`Unknown translation provider: ${providerType}`)
    }
  }

  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    try {
      return await this.provider.translate(text, fromLang, toLang)
    } catch (error) {
      console.error('Translation error:', error)
      throw error
    }
  }

  async translateBatch(
    texts: string[],
    fromLang: string,
    toLang: string
  ): Promise<string[]> {
    // Batch translation with rate limiting
    const results: string[] = []
    const batchSize = 10
    const delay = 200 // ms between batches to respect rate limits

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(text => this.translateText(text, fromLang, toLang))
      )
      results.push(...batchResults)

      // Rate limiting
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    return results
  }

  /**
   * Check if translation API is configured
   */
  static isConfigured(): boolean {
    const provider = process.env.TRANSLATION_PROVIDER || 'deepl'
    
    switch (provider) {
      case 'deepl':
        return !!process.env.DEEPL_API_KEY
      case 'google':
        return !!process.env.GOOGLE_TRANSLATE_API_KEY
      case 'libretranslate':
        return true // LibreTranslate doesn't require a key
      default:
        return false
    }
  }
}

