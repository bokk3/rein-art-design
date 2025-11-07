import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmailService } from '../email-service';
import nodemailer from 'nodemailer';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

// Mock environment variables
const mockEnv = {
  SMTP_HOST: 'smtp.test.com',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  SMTP_USER: 'test@example.com',
  SMTP_PASS: 'testpassword',
  ADMIN_EMAIL: 'admin@example.com',
  SITE_NAME: 'Test Site',
};

describe('EmailService', () => {
  let emailService: EmailService;
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up environment variables
    Object.entries(mockEnv).forEach(([key, value]) => {
      process.env[key] = value;
    });

    // Mock transporter
    mockTransporter = {
      sendMail: vi.fn(),
      verify: vi.fn(),
    };

    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter);

    emailService = new EmailService();
  });

  describe('initialization', () => {
    it('should initialize with valid configuration', () => {
      expect(emailService.isEmailConfigured()).toBe(true);
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'testpassword',
        },
      });
    });

    it('should not initialize without required configuration', () => {
      delete process.env.SMTP_HOST;
      const unconfiguredService = new EmailService();
      expect(unconfiguredService.isEmailConfigured()).toBe(false);
    });
  });

  describe('sendContactNotification', () => {
    const testData = {
      name: 'John Doe',
      email: 'john@test.com',
      projectType: 'Web Development',
      message: 'This is a test message.',
      marketingConsent: true,
      submittedAt: new Date('2023-01-01T12:00:00Z'),
    };

    it('should send contact notification successfully', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const result = await emailService.sendContactNotification(testData);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test Site" <test@example.com>',
        to: 'admin@example.com',
        subject: 'New Contact Form Submission - Web Development',
        text: expect.stringContaining('John Doe'),
        html: expect.stringContaining('John Doe'),
        replyTo: 'john@test.com',
      });
    });

    it('should include all form data in notification', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      await emailService.sendContactNotification(testData);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      
      expect(callArgs.text).toContain('John Doe');
      expect(callArgs.text).toContain('john@test.com');
      expect(callArgs.text).toContain('Web Development');
      expect(callArgs.text).toContain('This is a test message.');
      expect(callArgs.text).toContain('Marketing Consent: Yes');

      expect(callArgs.html).toContain('John Doe');
      expect(callArgs.html).toContain('john@test.com');
      expect(callArgs.html).toContain('Web Development');
      expect(callArgs.html).toContain('This is a test message.');
    });

    it('should handle marketing consent correctly', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const dataWithoutConsent = { ...testData, marketingConsent: false };
      await emailService.sendContactNotification(dataWithoutConsent);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.text).toContain('Marketing Consent: No');
    });

    it('should retry on failure', async () => {
      mockTransporter.sendMail
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({ messageId: 'test-message-id' });

      const result = await emailService.sendContactNotification(testData);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Persistent error'));

      const result = await emailService.sendContactNotification(testData);

      expect(result).toBe(false);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should return false when not configured', async () => {
      delete process.env.SMTP_HOST;
      const unconfiguredService = new EmailService();

      const result = await unconfiguredService.sendContactNotification(testData);

      expect(result).toBe(false);
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should return false when admin email is not configured', async () => {
      delete process.env.ADMIN_EMAIL;
      delete process.env.SMTP_USER;

      const result = await emailService.sendContactNotification(testData);

      expect(result).toBe(false);
    });
  });

  describe('sendAutoReply', () => {
    const testData = {
      name: 'John Doe',
      email: 'john@test.com',
      projectType: 'Web Development',
      message: 'This is a test message.',
      marketingConsent: true,
      submittedAt: new Date('2023-01-01T12:00:00Z'),
    };

    it('should send auto-reply successfully', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const result = await emailService.sendAutoReply(testData);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test Site" <test@example.com>',
        to: 'john@test.com',
        subject: 'Thank you for your message',
        text: expect.stringContaining('Thank you for your message, John Doe!'),
        html: expect.stringContaining('Thank you for your message, John Doe!'),
      });
    });

    it('should include marketing consent info in auto-reply', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      await emailService.sendAutoReply(testData);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('You have opted in to receive occasional updates');
    });

    it('should not include marketing info when consent is false', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const dataWithoutConsent = { ...testData, marketingConsent: false };
      await emailService.sendAutoReply(dataWithoutConsent);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).not.toContain('You have opted in to receive occasional updates');
    });

    it('should retry on failure with fewer attempts', async () => {
      mockTransporter.sendMail
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({ messageId: 'test-message-id' });

      const result = await emailService.sendAutoReply(testData);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Persistent error'));

      const result = await emailService.sendAutoReply(testData);

      expect(result).toBe(false);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3); // Initial + 2 retries (fewer than notification)
    });
  });

  describe('testConnection', () => {
    it('should return true when connection is successful', async () => {
      mockTransporter.verify.mockResolvedValue(true);

      const result = await emailService.testConnection();

      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('should return false when connection fails', async () => {
      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.testConnection();

      expect(result).toBe(false);
    });

    it('should return false when not configured', async () => {
      delete process.env.SMTP_HOST;
      const unconfiguredService = new EmailService();

      const result = await unconfiguredService.testConnection();

      expect(result).toBe(false);
    });
  });

  describe('HTML escaping', () => {
    it('should escape HTML characters in email content', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const dataWithHtml = {
        name: 'John <script>alert("xss")</script> Doe',
        email: 'john@test.com',
        projectType: 'Web & Mobile Development',
        message: 'Message with <b>HTML</b> & special chars "quotes"',
        marketingConsent: false,
        submittedAt: new Date(),
      };

      await emailService.sendContactNotification(dataWithHtml);

      const callArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('John &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; Doe');
      expect(callArgs.html).toContain('Web &amp; Mobile Development');
      expect(callArgs.html).toContain('Message with &lt;b&gt;HTML&lt;/b&gt; &amp; special chars &quot;quotes&quot;');
    });
  });
});