// Text utility functions for multilingual support

/**
 * Get text from multilingual text object or string
 */
export function getText(
  text: string | { [key: string]: string } | undefined,
  currentLanguage: string = 'nl'
): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[currentLanguage] || text['nl'] || Object.values(text)[0] || ''
}

