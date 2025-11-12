"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useT } from '@/hooks/use-t';

interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
  privacyAccepted?: string;
  marketingConsent?: string;
}

export function ContactForm() {
  const { t } = useT()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    message: '',
    privacyAccepted: false,
    marketingConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/contact/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to defaults
        setCategories([
          'Keukens',
          'Badkamermeubels',
          'Woonkamermeubels',
          'Op maat gemaakte meubels',
          'Renovatie',
          'Andere'
        ])
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 254) {
      newErrors.email = 'Email address is too long';
    }

    // Project type validation
    if (!formData.projectType.trim()) {
      newErrors.projectType = 'Project type is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    // GDPR compliance validation
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the privacy policy to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: '',
          privacyAccepted: false,
          marketingConsent: false
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setSubmitError(errorData.error || 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-green-400 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('form.messageSent')}
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>{t('form.thankYou')}</p>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setSubmitStatus('idle')}
                variant="outline"
                size="sm"
              >
                {t('form.sendAnother')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('form.errorSending')}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{submitError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="text-sm text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                >
                  {t('form.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.name')} *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-red-300' : ''}
            placeholder={t('form.name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.email')} *
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-300' : ''}
            placeholder={t('form.email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('form.projectType')} *
        </label>
        <select
          id="projectType"
          value={formData.projectType}
          onChange={(e) => handleChange('projectType', e.target.value)}
          className={`w-full rounded-md border ${errors.projectType ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          disabled={loadingCategories}
        >
          <option value="">{loadingCategories ? 'Loading...' : t('form.selectProjectType')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('form.message')} *
          </label>
          <span className={`text-xs ${formData.message.length > 2000 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {formData.message.length}/2000
          </span>
        </div>
        <textarea
          id="message"
          rows={6}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`w-full rounded-md border ${errors.message ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Tell us about your project..."
          maxLength={2000}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* GDPR Compliance Section */}
      <div className="space-y-4 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Data Privacy & Consent</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="privacyAccepted"
              type="checkbox"
              checked={formData.privacyAccepted}
              onChange={(e) => handleChange('privacyAccepted', e.target.checked)}
              className={`mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${errors.privacyAccepted ? 'border-red-300' : ''}`}
            />
            <label htmlFor="privacyAccepted" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('form.privacyAccept').split('privacy policy').map((part, i, arr) => 
                i === arr.length - 1 ? part : (
                  <span key={i}>
                    {part}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      privacy policy
                    </a>
                  </span>
                )
              )}
            </label>
          </div>
          {errors.privacyAccepted && (
            <p className="ml-7 text-sm text-red-600">{errors.privacyAccepted}</p>
          )}

          <div className="flex items-start">
            <input
              id="marketingConsent"
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => handleChange('marketingConsent', e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="marketingConsent" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('form.marketingConsent')}
            </label>
          </div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>{t('form.dataProtection')}</strong> Your personal data will be processed in accordance with GDPR regulations. 
            We will only use your information to respond to your inquiry and, if consented, to send you relevant updates.
          </p>
          <p>
            You have the right to access, rectify, or delete your personal data at any time. 
            Contact us at privacy@example.com for any data protection requests.
          </p>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.privacyAccepted}
          className="w-full md:w-auto"
        >
          {isSubmitting ? t('form.sending') : t('form.sendMessage')}
        </Button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        * {t('form.required')} fields
      </div>
    </form>
  );
}