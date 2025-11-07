import { NextRequest, NextResponse } from 'next/server';
import { requireEditor, AuthError } from '../../../../lib/auth-middleware';
import { emailService } from '../../../../lib/email-service';

export async function GET(request: NextRequest) {
  try {
    await requireEditor(request);

    const settings = {
      isConfigured: emailService.isEmailConfigured(),
      adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER || '',
      siteName: process.env.SITE_NAME || 'Portfolio CMS',
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: process.env.SMTP_PORT || '587',
      smtpSecure: process.env.SMTP_SECURE === 'true',
      smtpUser: process.env.SMTP_USER || '',
      // Don't return password for security
    };

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireEditor(request);

    const { action } = await request.json();

    if (action === 'test') {
      const isConnected = await emailService.testConnection();
      
      if (isConnected) {
        // Send a test email
        const testEmailData = {
          name: 'Test User',
          email: process.env.ADMIN_EMAIL || process.env.SMTP_USER || '',
          projectType: 'Email Configuration Test',
          message: 'This is a test message to verify your email configuration is working correctly.',
          marketingConsent: false,
          submittedAt: new Date(),
        };

        const success = await emailService.sendContactNotification(testEmailData);
        
        return NextResponse.json({
          success,
          message: success 
            ? 'Test email sent successfully! Check your inbox.' 
            : 'Email service is configured but failed to send test email.'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Email service connection failed. Please check your SMTP configuration.'
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    
    console.error('Error testing email settings:', error);
    return NextResponse.json(
      { error: 'Failed to test email settings' },
      { status: 500 }
    );
  }
}