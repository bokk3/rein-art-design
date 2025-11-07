"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface EmailSettings {
  isConfigured: boolean;
  adminEmail: string;
  siteName: string;
  smtpHost: string;
  smtpPort: string;
  smtpSecure: boolean;
  smtpUser: string;
}

export function EmailSettings() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch email settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test' }),
      });

      if (response.ok) {
        const result = await response.json();
        setTestResult(result);
      } else {
        setTestResult({
          success: false,
          message: 'Failed to test email configuration'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Network error while testing email configuration'
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
          Failed to Load Email Settings
        </h3>
        <p className="text-red-700 dark:text-red-400">
          Unable to fetch email configuration. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Email Configuration Status
        </h3>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${settings.isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${settings.isConfigured ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
              {settings.isConfigured ? 'Email service is configured' : 'Email service is not configured'}
            </span>
          </div>

          {settings.isConfigured && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Current Configuration</h4>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <div><strong>SMTP Host:</strong> {settings.smtpHost}</div>
                <div><strong>SMTP Port:</strong> {settings.smtpPort}</div>
                <div><strong>Secure Connection:</strong> {settings.smtpSecure ? 'Yes (TLS/SSL)' : 'No'}</div>
                <div><strong>SMTP User:</strong> {settings.smtpUser}</div>
                <div><strong>Admin Email:</strong> {settings.adminEmail}</div>
                <div><strong>Site Name:</strong> {settings.siteName}</div>
              </div>
            </div>
          )}

          {!settings.isConfigured && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Configuration Required</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                To enable email notifications, please set the following environment variables:
              </p>
              <div className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300 font-mono bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
                <div>SMTP_HOST=your-smtp-server.com</div>
                <div>SMTP_PORT=587</div>
                <div>SMTP_SECURE=false</div>
                <div>SMTP_USER=your-email@domain.com</div>
                <div>SMTP_PASS=your-email-password</div>
                <div>ADMIN_EMAIL=admin@domain.com</div>
                <div>SITE_NAME="Your Site Name"</div>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
                After updating your environment variables, restart the application for changes to take effect.
              </p>
            </div>
          )}
        </div>
      </div>

      {settings.isConfigured && (
        <div className="glass border border-white/20 dark:border-gray-700/30 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Test Email Configuration
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Send a test email to verify your email configuration is working correctly.
          </p>

          <Button
            onClick={testEmailConfiguration}
            disabled={isTesting}
            className="mb-4"
          >
            {isTesting ? 'Sending Test Email...' : 'Send Test Email'}
          </Button>

          {testResult && (
            <div className={`border rounded-lg p-4 ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <div className={`shrink-0 w-5 h-5 rounded-full mr-3 ${
                  testResult.success ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <h4 className={`font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? 'Test Successful' : 'Test Failed'}
                  </h4>
                  <p className={`text-sm ${
                    testResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">
          Email Notifications
        </h3>
        <p className="text-blue-800 dark:text-blue-300 text-sm mb-3">
          When properly configured, the system will automatically:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>Send you notifications when new contact form submissions are received</li>
          <li>Send automatic confirmation emails to customers who submit the contact form</li>
          <li>Include all form data and customer consent preferences in notifications</li>
          <li>Allow direct reply to customer emails from your email client</li>
        </ul>
      </div>
    </div>
  );
}