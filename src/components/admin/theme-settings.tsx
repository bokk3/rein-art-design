'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/contexts/theme-context'
import { Sun, Moon, Monitor, Settings } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'system' | 'user-choice'

interface ThemeSettingsData {
  mode: ThemeMode
  allowUserToggle: boolean
  defaultTheme: 'light' | 'dark'
  grayscaleImages: boolean
}

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<ThemeSettingsData>({
    mode: 'user-choice',
    allowUserToggle: true,
    defaultTheme: 'light',
    grayscaleImages: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load current theme settings
  useEffect(() => {
    loadThemeSettings()
  }, [])

  const loadThemeSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/theme-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading theme settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveThemeSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/theme-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        // Apply the theme settings immediately
        applyThemeSettings()
        // Reload page to apply image settings changes
        window.location.reload()
      } else {
        alert('Failed to save theme settings')
      }
    } catch (error) {
      console.error('Error saving theme settings:', error)
      alert('Error saving theme settings')
    } finally {
      setSaving(false)
    }
  }

  const applyThemeSettings = () => {
    // Apply theme based on admin settings
    if (settings.mode === 'light') {
      setTheme('light')
    } else if (settings.mode === 'dark') {
      setTheme('dark')
    } else if (settings.mode === 'system') {
      setTheme('system') // Set to system mode, which will follow system preference
    }
    // For 'user-choice', don't change the current theme
  }

  const handleModeChange = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, mode }))
  }

  const handleToggleChange = (allowUserToggle: boolean) => {
    setSettings(prev => ({ ...prev, allowUserToggle }))
  }

  const handleDefaultThemeChange = (defaultTheme: 'light' | 'dark') => {
    setSettings(prev => ({ ...prev, defaultTheme }))
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Theme Mode Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
            Theme Mode
          </Label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => handleModeChange('light')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.mode === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Sun className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-xs font-medium text-gray-900 dark:text-white">Light</div>
            </button>

            <button
              onClick={() => handleModeChange('dark')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.mode === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Moon className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <div className="text-xs font-medium text-gray-900 dark:text-white">Dark</div>
            </button>

            <button
              onClick={() => handleModeChange('system')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.mode === 'system'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Monitor className="h-5 w-5 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
              <div className="text-xs font-medium text-gray-900 dark:text-white">System</div>
            </button>

            <button
              onClick={() => handleModeChange('user-choice')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.mode === 'user-choice'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Settings className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-xs font-medium text-gray-900 dark:text-white">User Choice</div>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Choose how the theme is determined for your site
          </p>
        </div>

        {/* User Toggle Setting */}
        <div>
          <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
            User Controls
          </Label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.allowUserToggle}
                onChange={(e) => handleToggleChange(e.target.checked)}
                disabled={settings.mode !== 'user-choice'}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show theme toggle in navigation
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">
              {settings.mode !== 'user-choice' 
                ? 'Only available when "User Choice" mode is selected'
                : 'Users can switch between light and dark themes'
              }
            </p>
          </div>
        </div>

        {/* Default Theme for User Choice */}
        {settings.mode === 'user-choice' && (
          <div>
            <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
              Default Theme (for new users)
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDefaultThemeChange('light')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                  settings.defaultTheme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => handleDefaultThemeChange('dark')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                  settings.defaultTheme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </div>
        )}

        {/* Grayscale Images Toggle */}
        <div>
          <Label className="text-base font-medium text-gray-900 dark:text-white mb-3 block">
            Image Display
          </Label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.grayscaleImages}
                onChange={(e) => setSettings(prev => ({ ...prev, grayscaleImages: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Display images in grayscale (black & white)
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">
              Apply a grayscale filter to all project and gallery images for a monochrome aesthetic
            </p>
          </div>
        </div>

        {/* Current Theme Preview */}
        <div>
          <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
            Current Theme
          </Label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {theme === 'light' ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {theme} Mode Active
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            onClick={saveThemeSettings}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}