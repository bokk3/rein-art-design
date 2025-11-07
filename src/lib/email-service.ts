import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface ContactNotificationData {
  name: string;
  email: string;
  projectType: string;
  message: string;
  marketingConsent: boolean;
  submittedAt: Date;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      const emailConfig: EmailConfig = {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      };

      // Only initialize if all required config is present
      if (emailConfig.host && emailConfig.auth.user && emailConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;
      } else {
        console.warn('Email service not configured. Missing SMTP environment variables.');
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  async sendContactNotification(data: ContactNotificationData, retryCount = 0): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('Email service not configured. Skipping email notification.');
      return false;
    }

    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
      if (!adminEmail) {
        console.error('Admin email not configured');
        return false;
      }

      const emailHtml = this.generateContactNotificationHtml(data);
      const emailText = this.generateContactNotificationText(data);

      const mailOptions = {
        from: `"${process.env.SITE_NAME || 'Portfolio CMS'}" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Contact Form Submission - ${data.projectType}`,
        text: emailText,
        html: emailHtml,
        replyTo: data.email,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact notification sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error(`Failed to send contact notification (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.sendContactNotification(data, retryCount + 1);
      }
      
      return false;
    }
  }

  async sendAutoReply(data: ContactNotificationData, retryCount = 0): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    const maxRetries = 2; // Fewer retries for auto-reply
    const retryDelay = 1000 * Math.pow(2, retryCount);

    try {
      const emailHtml = this.generateAutoReplyHtml(data);
      const emailText = this.generateAutoReplyText(data);

      const mailOptions = {
        from: `"${process.env.SITE_NAME || 'Portfolio CMS'}" <${process.env.SMTP_USER}>`,
        to: data.email,
        subject: 'Thank you for your message',
        text: emailText,
        html: emailHtml,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Auto-reply sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error(`Failed to send auto-reply (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying auto-reply in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.sendAutoReply(data, retryCount + 1);
      }
      
      return false;
    }
  }

  private generateContactNotificationHtml(data: ContactNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-top: 5px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
            .message { white-space: pre-wrap; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
              <p>You have received a new message through your website contact form.</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${this.escapeHtml(data.name)}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">
                  <a href="mailto:${this.escapeHtml(data.email)}">${this.escapeHtml(data.email)}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">Project Type:</div>
                <div class="value">${this.escapeHtml(data.projectType)}</div>
              </div>
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="value message">${this.escapeHtml(data.message)}</div>
              </div>
              
              <div class="field">
                <div class="label">Marketing Consent:</div>
                <div class="value">${data.marketingConsent ? 'Yes - Customer agreed to receive marketing communications' : 'No - Customer declined marketing communications'}</div>
              </div>
              
              <div class="field">
                <div class="label">Submitted:</div>
                <div class="value">${data.submittedAt.toLocaleString()}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>This message was sent through your website contact form. You can reply directly to this email to respond to the customer.</p>
              <p>To manage contact messages, visit your admin panel.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateContactNotificationText(data: ContactNotificationData): string {
    return `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Project Type: ${data.projectType}
Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
Submitted: ${data.submittedAt.toLocaleString()}

Message:
${data.message}

---
This message was sent through your website contact form.
You can reply directly to this email to respond to the customer.
    `.trim();
  }

  private generateAutoReplyHtml(data: ContactNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thank you for your message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank you for your message, ${this.escapeHtml(data.name)}!</h2>
            </div>
            
            <div class="content">
              <p>We have received your message about <strong>${this.escapeHtml(data.projectType)}</strong> and will get back to you as soon as possible.</p>
              
              <p>We typically respond to all inquiries within 24 hours during business days.</p>
              
              <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
              
              <p>Best regards,<br>The Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated response. Please do not reply to this email.</p>
              ${data.marketingConsent ? '<p>You have opted in to receive occasional updates about our services.</p>' : ''}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateAutoReplyText(data: ContactNotificationData): string {
    return `
Thank you for your message, ${data.name}!

We have received your message about ${data.projectType} and will get back to you as soon as possible.

We typically respond to all inquiries within 24 hours during business days.

If you have any urgent questions, please don't hesitate to contact us directly.

Best regards,
The Team

---
This is an automated response. Please do not reply to this email.
${data.marketingConsent ? 'You have opted in to receive occasional updates about our services.' : ''}
    `.trim();
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }

  isEmailConfigured(): boolean {
    return this.isConfigured;
  }
}

export const emailService = new EmailService();