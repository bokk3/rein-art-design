'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Globe, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react'

interface SEOSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  canonicalUrl: string
  robotsIndex: boolean
  robotsFollow: boolean
  sitemapEnabled: boolean
  structuredDataEnabled: boolean
}

export function SEOSettings() {
  const [settings, setSettings] = useState<SEOSettings>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    twitterCreator: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    sitemapEnabled: true,
    structuredDataEnabled: true
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
      const response = await fetch('/api/admin/seo-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setSaveMessage(null)
      const response = await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'SEO settings saved successfully!' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setSaveMessage({ type: 'error', text: errorData.error || 'Failed to save SEO settings' })
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      setSaveMessage({ type: 'error', text: 'Error saving SEO settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SEOSettings, value: any) => {
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

      {/* Meta Tags */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Meta Tags</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-900 dark:text-white">
              Meta Title
            </Label>
            <Input
              id="metaTitle"
              value={settings.metaTitle}
              onChange={(e) => updateSetting('metaTitle', e.target.value)}
              placeholder="Your Site Title"
              className="mt-1"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {settings.metaTitle.length}/60 characters (recommended: 50-60)
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-900 dark:text-white">
              Meta Description
            </Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={(e) => updateSetting('metaDescription', e.target.value)}
              placeholder="A brief description of your site"
              className="mt-1"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {settings.metaDescription.length}/160 characters (recommended: 150-160)
            </p>
          </div>

          <div>
            <Label htmlFor="metaKeywords" className="text-sm font-medium text-gray-900 dark:text-white">
              Meta Keywords
            </Label>
            <Input
              id="metaKeywords"
              value={settings.metaKeywords}
              onChange={(e) => updateSetting('metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comma-separated keywords (less important for SEO, but still used by some search engines)
            </p>
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Graph (Facebook, LinkedIn)</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ogTitle" className="text-sm font-medium text-gray-900 dark:text-white">
              OG Title
            </Label>
            <Input
              id="ogTitle"
              value={settings.ogTitle}
              onChange={(e) => updateSetting('ogTitle', e.target.value)}
              placeholder="Open Graph Title"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Title shown when your site is shared on social media
            </p>
          </div>

          <div>
            <Label htmlFor="ogDescription" className="text-sm font-medium text-gray-900 dark:text-white">
              OG Description
            </Label>
            <Textarea
              id="ogDescription"
              value={settings.ogDescription}
              onChange={(e) => updateSetting('ogDescription', e.target.value)}
              placeholder="Open Graph Description"
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Description shown when your site is shared on social media
            </p>
          </div>

          <div>
            <Label htmlFor="ogImage" className="text-sm font-medium text-gray-900 dark:text-white">
              OG Image URL
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="ogImage"
                value={settings.ogImage}
                onChange={(e) => updateSetting('ogImage', e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className="flex-1"
              />
              <ImageIcon className="h-5 w-5 text-gray-400 self-center" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended size: 1200x630px. Image shown when your site is shared (leave empty to use site logo)
            </p>
          </div>

          <div>
            <Label htmlFor="ogType" className="text-sm font-medium text-gray-900 dark:text-white">
              OG Type
            </Label>
            <select
              id="ogType"
              value={settings.ogType}
              onChange={(e) => updateSetting('ogType', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#181818] text-gray-900 dark:text-white"
            >
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="product">Product</option>
              <option value="profile">Profile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Twitter Cards */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Twitter Cards</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="twitterCard" className="text-sm font-medium text-gray-900 dark:text-white">
              Twitter Card Type
            </Label>
            <select
              id="twitterCard"
              value={settings.twitterCard}
              onChange={(e) => updateSetting('twitterCard', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#181818] text-gray-900 dark:text-white"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary with Large Image</option>
            </select>
          </div>

          <div>
            <Label htmlFor="twitterSite" className="text-sm font-medium text-gray-900 dark:text-white">
              Twitter Site (@username)
            </Label>
            <Input
              id="twitterSite"
              value={settings.twitterSite}
              onChange={(e) => updateSetting('twitterSite', e.target.value)}
              placeholder="@yourusername"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="twitterCreator" className="text-sm font-medium text-gray-900 dark:text-white">
              Twitter Creator (@username)
            </Label>
            <Input
              id="twitterCreator"
              value={settings.twitterCreator}
              onChange={(e) => updateSetting('twitterCreator', e.target.value)}
              placeholder="@yourusername"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="canonicalUrl" className="text-sm font-medium text-gray-900 dark:text-white">
              Canonical URL
            </Label>
            <Input
              id="canonicalUrl"
              value={settings.canonicalUrl}
              onChange={(e) => updateSetting('canonicalUrl', e.target.value)}
              placeholder="https://www.yoursite.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your site's main URL (used for canonical tags)
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.robotsIndex}
                onChange={(e) => updateSetting('robotsIndex', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Allow search engines to index this site
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.robotsFollow}
                onChange={(e) => updateSetting('robotsFollow', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Allow search engines to follow links on this site
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.sitemapEnabled}
                onChange={(e) => updateSetting('sitemapEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable automatic sitemap generation
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.structuredDataEnabled}
                onChange={(e) => updateSetting('structuredDataEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable structured data (Schema.org markup)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  )
}

