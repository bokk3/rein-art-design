'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ImageSettingsContextType {
  grayscaleImages: boolean
}

const ImageSettingsContext = createContext<ImageSettingsContextType>({
  grayscaleImages: false
})

export function ImageSettingsProvider({ children }: { children: ReactNode }) {
  const [grayscaleImages, setGrayscaleImages] = useState(false)

  useEffect(() => {
    // Load image settings from API
    const loadImageSettings = async () => {
      try {
        const response = await fetch('/api/image-settings')
        if (response.ok) {
          const data = await response.json()
          setGrayscaleImages(data.grayscaleImages || false)
        }
      } catch (error) {
        console.error('Error loading image settings:', error)
      }
    }

    loadImageSettings()

    // Poll for settings changes every 5 seconds (or listen to storage events)
    const interval = setInterval(loadImageSettings, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ImageSettingsContext.Provider value={{ grayscaleImages }}>
      {children}
    </ImageSettingsContext.Provider>
  )
}

export function useImageSettings() {
  return useContext(ImageSettingsContext)
}

