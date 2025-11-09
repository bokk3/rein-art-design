// Color utility functions for dark mode adaptation

/**
 * Check if a color is light (luminance > 0.5)
 */
export function isLightColor(color: string): boolean {
  if (!color) return false
  const hex = color.replace('#', '')
  if (hex.length !== 6) return false
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * Darken a color by a factor (0-1) for dark mode
 */
export function darkenColor(color: string, factor: number = 0.4): string {
  if (!color) return color
  const hex = color.replace('#', '')
  if (hex.length !== 6) return color
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  if (luminance > 0.9) {
    const darkValue = Math.floor(30 + (luminance - 0.9) * 20)
    return `#${darkValue.toString(16).padStart(2, '0')}${darkValue.toString(16).padStart(2, '0')}${darkValue.toString(16).padStart(2, '0')}`
  }
  const newR = Math.max(0, Math.floor(r * (1 - factor)))
  const newG = Math.max(0, Math.floor(g * (1 - factor)))
  const newB = Math.max(0, Math.floor(b * (1 - factor)))
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Check if a color is pure black (or very close to black)
 */
export function isPureBlack(color: string): boolean {
  if (!color) return false
  const hex = color.replace('#', '').toLowerCase().trim()
  if (hex.length === 3) {
    return hex === '000'
  }
  if (hex.length === 6) {
    if (hex === '000000') return true
    const num = parseInt(hex, 16)
    if (isNaN(num)) return false
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff
    return r < 10 && g < 10 && b < 10
  }
  return false
}

/**
 * Adjust dark colors for dark mode (keep them dark, don't lighten to gray)
 */
export function adjustDarkColorForDarkMode(color: string): string {
  if (!color) return color
  if (isPureBlack(color)) {
    return color
  }
  const hex = color.replace('#', '').toLowerCase()
  if (hex.length !== 6) return color
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  if (luminance < 0.15) {
    return color
  }
  return color
}

/**
 * Lighten a color by a factor (0-1) for text on dark backgrounds
 */
export function lightenColor(color: string, factor: number = 0.3): string {
  if (!color) return color
  const hex = color.replace('#', '')
  if (hex.length !== 6) return color
  const r = Math.min(255, Math.floor(parseInt(hex.substring(0, 2), 16) + (255 - parseInt(hex.substring(0, 2), 16)) * factor))
  const g = Math.min(255, Math.floor(parseInt(hex.substring(2, 4), 16) + (255 - parseInt(hex.substring(2, 4), 16)) * factor))
  const b = Math.min(255, Math.floor(parseInt(hex.substring(4, 6), 16) + (255 - parseInt(hex.substring(4, 6), 16)) * factor))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

