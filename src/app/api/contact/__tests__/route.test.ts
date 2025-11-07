import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { prisma } from '../../../../lib/db';
import { emailService } from '../../../../lib/email-service';

// Mock the email service
vi.mock('../../../../lib/email-service', () => ({
  emailService: {
    sendContactNotification: vi.fn().mockResolvedValue(true),
    sendAutoReply: vi.fn().mockResolvedValue(true),
  }
}));

// Mock console methods to avoid noise in tests
vi.mock('console', () => ({
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}));

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.contactMessage.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  });

  describe('POST', () => {
    it('should create a contact message with valid data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough to pass validation.',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Contact message sent successfully');
      expect(data.id).toBeDefined();

      // Verify the message was saved to database
      const savedMessage = await prisma.contactMessage.findUnique({
        where: { id: data.id }
      });

      expect(savedMessage).toBeTruthy();
      expect(savedMessage?.name).toBe(validData.name);
      expect(savedMessage?.email).toBe(validData.email.toLowerCase());
      expect(savedMessage?.projectType).toBe(validData.projectType);
      expect(savedMessage?.message).toBe(validData.message);
      expect(savedMessage?.privacyAccepted).toBe(true);
      expect(savedMessage?.marketingConsent).toBe(false);
      expect(savedMessage?.read).toBe(false);
      expect(savedMessage?.replied).toBe(false);
    });

    it('should trigger email notifications', async () => {
      const validData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        projectType: 'E-commerce',
        message: 'This is another test message for email testing.',
        privacyAccepted: true,
        marketingConsent: true
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      // Mock email service methods to resolve successfully
      vi.mocked(emailService.sendContactNotification).mockResolvedValue(true);
      vi.mocked(emailService.sendAutoReply).mockResolvedValue(true);

      const response = await POST(request);
      expect(response.status).toBe(201);

      // Give a small delay for async email operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify email methods were called
      expect(emailService.sendContactNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validData.name,
          email: validData.email,
          projectType: validData.projectType,
          message: validData.message,
          marketingConsent: validData.marketingConsent,
          submittedAt: expect.any(Date)
        })
      );

      expect(emailService.sendAutoReply).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validData.name,
          email: validData.email,
          projectType: validData.projectType,
          message: validData.message,
          marketingConsent: validData.marketingConsent,
          submittedAt: expect.any(Date)
        })
      );
    });

    it('should reject missing required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@test.com',
        // Missing projectType and message
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('All required fields must be filled');
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough.',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email format');
    });

    it('should reject message that is too short', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'Short',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message must be at least 10 characters long');
    });

    it('should reject message that is too long', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'A'.repeat(2001), // 2001 characters
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message must be less than 2000 characters');
    });

    it('should reject without privacy policy acceptance', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough.',
        privacyAccepted: false,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Privacy policy acceptance is required');
    });

    it('should reject name that is too short', async () => {
      const invalidData = {
        name: 'A',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough.',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Name must be between 2 and 100 characters');
    });

    it('should reject name that is too long', async () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough.',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Name must be between 2 and 100 characters');
    });

    it('should detect suspicious content', async () => {
      const suspiciousData = {
        name: 'Spam User',
        email: 'spam@test.com',
        projectType: 'Web Development',
        message: 'Check out this amazing casino website at https://spam-casino.com for free viagra!',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suspiciousData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message contains suspicious content');
    });

    it('should handle email service failures gracefully', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@test.com',
        projectType: 'Web Development',
        message: 'This is a test message that is long enough.',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      // Mock email service to fail
      vi.mocked(emailService.sendContactNotification).mockRejectedValue(new Error('Email service error'));
      vi.mocked(emailService.sendAutoReply).mockRejectedValue(new Error('Email service error'));

      const response = await POST(request);
      const data = await response.json();

      // Should still succeed even if email fails
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Contact message sent successfully');
    });

    it('should trim and normalize input data', async () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: '  JOHN@TEST.COM  ',
        projectType: '  Web Development  ',
        message: '  This is a test message with whitespace that is long enough to pass validation.  ',
        privacyAccepted: true,
        marketingConsent: false
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithWhitespace),
      });

      const response = await POST(request);
      const data = await response.json();

      if (response.status !== 201) {
        console.log('Unexpected error:', data);
      }

      expect(response.status).toBe(201);

      // Verify the data was trimmed and normalized
      const savedMessage = await prisma.contactMessage.findUnique({
        where: { id: data.id }
      });

      expect(savedMessage?.name).toBe('John Doe');
      expect(savedMessage?.email).toBe('john@test.com');
      expect(savedMessage?.projectType).toBe('Web Development');
      expect(savedMessage?.message).toBe('This is a test message with whitespace that is long enough to pass validation.');
    });
  });
});