'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Share2, Facebook, Instagram, Linkedin, Twitter, Youtube, Music, AlertCircle } from 'lucide-react'

interface SocialSettings {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  youtube: string
  pinterest: string
  tiktok: string
  enableSharing: boolean
}

export function SocialSettings() {
  const [settings, setSettings] = useState<SocialSettings>({
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    pinterest: '',
    tiktok: '',
    enableSharing: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/social-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading social settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setSaveMessage(null)
      const response = await fetch('/api/admin/social-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Social media settings saved successfully!' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setSaveMessage({ type: 'error', text: errorData.error || 'Failed to save social settings' })
      }
    } catch (error) {
      console.error('Error saving social settings:', error)
      setSaveMessage({ type: 'error', text: 'Error saving social settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SocialSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
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

  const socialPlatforms = [
    { key: 'facebook' as const, label: 'Facebook', icon: Facebook, placeholder: 'https://www.facebook.com/yourpage' },
    { key: 'instagram' as const, label: 'Instagram', icon: Instagram, placeholder: 'https://www.instagram.com/yourprofile' },
    { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, placeholder: 'https://www.linkedin.com/company/yourcompany' },
    { key: 'twitter' as const, label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
    { key: 'youtube' as const, label: 'YouTube', icon: Youtube, placeholder: 'https://www.youtube.com/channel/yourchannel' },
    { key: 'pinterest' as const, label: 'Pinterest', icon: Share2, placeholder: 'https://www.pinterest.com/yourprofile' },
    { key: 'tiktok' as const, label: 'TikTok', icon: Music, placeholder: 'https://www.tiktok.com/@yourhandle' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Save Message */}
      {saveMessage && (
        <div className={`border rounded-lg p-4 ${
          saveMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`h-5 w-5 mr-2 ${
              saveMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`} />
            <span className={`${
              saveMessage.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}>
              {saveMessage.text}
            </span>
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add your social media profile URLs. These links will be displayed in your site's footer and can be used for social sharing.
        </p>

        <div className="space-y-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            return (
              <div key={platform.key}>
                <Label htmlFor={platform.key} className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {platform.label}
                </Label>
                <Input
                  id={platform.key}
                  type="url"
                  value={settings[platform.key]}
                  onChange={(e) => updateSetting(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="mt-1"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Social Sharing Settings */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Sharing</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableSharing}
              onChange={(e) => updateSetting('enableSharing', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable social sharing buttons on pages
            </span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">
            Allow visitors to share your content on social media platforms
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? 'Saving...' : 'Save Social Settings'}
        </Button>
      </div>
    </div>
  )
}

