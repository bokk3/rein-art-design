'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, MapPin, Phone, Mail, CreditCard, FileText, AlertCircle } from 'lucide-react'

interface BusinessSettings {
  companyName: string
  companyOwner: string
  legalName: string
  address: string
  city: string
  postalCode: string
  country: string
  contactEmail: string
  contactPhone: string
  whatsapp: string
  vatNumber: string
  companyRegistration: string
  iban: string
  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
}

export function BusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    companyName: '',
    companyOwner: '',
    legalName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    contactEmail: '',
    contactPhone: '',
    whatsapp: '',
    vatNumber: '',
    companyRegistration: '',
    iban: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }
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
      const response = await fetch('/api/admin/business-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading business settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setSaveMessage(null)
      const response = await fetch('/api/admin/business-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Business settings saved successfully!' })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setSaveMessage({ type: 'error', text: errorData.error || 'Failed to save business settings' })
      }
    } catch (error) {
      console.error('Error saving business settings:', error)
      setSaveMessage({ type: 'error', text: 'Error saving business settings' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateBusinessHours = (day: keyof BusinessSettings['businessHours'], field: 'open' | 'close' | 'closed', value: any) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
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

  const days = [
    { key: 'monday' as const, label: 'Monday' },
    { key: 'tuesday' as const, label: 'Tuesday' },
    { key: 'wednesday' as const, label: 'Wednesday' },
    { key: 'thursday' as const, label: 'Thursday' },
    { key: 'friday' as const, label: 'Friday' },
    { key: 'saturday' as const, label: 'Saturday' },
    { key: 'sunday' as const, label: 'Sunday' }
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

      {/* Company Information */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-900 dark:text-white">
              Company Name
            </Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => updateSetting('companyName', e.target.value)}
              placeholder="Your Company Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="companyOwner" className="text-sm font-medium text-gray-900 dark:text-white">
              Owner Name
            </Label>
            <Input
              id="companyOwner"
              value={settings.companyOwner}
              onChange={(e) => updateSetting('companyOwner', e.target.value)}
              placeholder="Owner Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="legalName" className="text-sm font-medium text-gray-900 dark:text-white">
              Legal Company Name
            </Label>
            <Input
              id="legalName"
              value={settings.legalName}
              onChange={(e) => updateSetting('legalName', e.target.value)}
              placeholder="Legal Company Name (e.g., Company BVBA)"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-900 dark:text-white">
              Street Address
            </Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => updateSetting('address', e.target.value)}
              placeholder="Street Address"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode" className="text-sm font-medium text-gray-900 dark:text-white">
                Postal Code
              </Label>
              <Input
                id="postalCode"
                value={settings.postalCode}
                onChange={(e) => updateSetting('postalCode', e.target.value)}
                placeholder="1234"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-900 dark:text-white">
                City
              </Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => updateSetting('city', e.target.value)}
                placeholder="City"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country" className="text-sm font-medium text-gray-900 dark:text-white">
              Country
            </Label>
            <Input
              id="country"
              value={settings.country}
              onChange={(e) => updateSetting('country', e.target.value)}
              placeholder="Country"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateSetting('contactEmail', e.target.value)}
              placeholder="contact@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-900 dark:text-white">
              Phone
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => updateSetting('contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-900 dark:text-white">
              WhatsApp (optional)
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              value={settings.whatsapp}
              onChange={(e) => updateSetting('whatsapp', e.target.value)}
              placeholder="+1 555 123 4567"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Legal & Financial */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal & Financial</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="vatNumber" className="text-sm font-medium text-gray-900 dark:text-white">
              VAT Number
            </Label>
            <Input
              id="vatNumber"
              value={settings.vatNumber}
              onChange={(e) => updateSetting('vatNumber', e.target.value)}
              placeholder="BE 1234 567 890"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="companyRegistration" className="text-sm font-medium text-gray-900 dark:text-white">
              Company Registration Number
            </Label>
            <Input
              id="companyRegistration"
              value={settings.companyRegistration}
              onChange={(e) => updateSetting('companyRegistration', e.target.value)}
              placeholder="Company Registration Number"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="iban" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              IBAN
            </Label>
            <Input
              id="iban"
              value={settings.iban}
              onChange={(e) => updateSetting('iban', e.target.value)}
              placeholder="BE 12 3456 7890 1234"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Hours</h3>
        </div>

        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.key} className="flex items-center gap-4">
              <div className="w-24">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!settings.businessHours[day.key].closed}
                    onChange={(e) => updateBusinessHours(day.key, 'closed', !e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{day.label}</span>
                </label>
              </div>
              {!settings.businessHours[day.key].closed ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={settings.businessHours[day.key].open}
                    onChange={(e) => updateBusinessHours(day.key, 'open', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <Input
                    type="time"
                    value={settings.businessHours[day.key].close}
                    onChange={(e) => updateBusinessHours(day.key, 'close', e.target.value)}
                    className="w-32"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? 'Saving...' : 'Save Business Settings'}
        </Button>
      </div>
    </div>
  )
}

