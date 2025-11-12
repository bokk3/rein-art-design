import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { emailService } from '../../../lib/email-service';
import DOMPurify from 'isomorphic-dompurify';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes

  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}

export async function POST(request: NextRequest) {
  // Rate limiting check (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }
  }

  try {
    const body: ContactFormData = await request.json();
    let { name, email, projectType, message, privacyAccepted, marketingConsent } = body;

    // Trim and sanitize input data (remove all HTML to prevent XSS)
    name = DOMPurify.sanitize(name?.trim() || '', { ALLOWED_TAGS: [] });
    email = email?.trim().toLowerCase() || '';
    projectType = DOMPurify.sanitize(projectType?.trim() || '', { ALLOWED_TAGS: [] });
    message = DOMPurify.sanitize(message?.trim() || '', { ALLOWED_TAGS: [] }); // Plain text only

    // Validate required fields
    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // GDPR compliance validation
    if (!privacyAccepted) {
      return NextResponse.json(
        { error: 'Privacy policy acceptance is required' },
        { status: 400 }
      );
    }

    // Enhanced validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Basic spam protection - check for suspicious patterns
    const suspiciousPatterns = [
      /https?:\/\/[^\s]+/gi, // URLs
      /\b(?:viagra|cialis|casino|lottery|winner)\b/gi, // Common spam words
    ];
    
    const fullText = `${name} ${email} ${message}`.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(fullText)) {
        return NextResponse.json(
          { error: 'Message contains suspicious content' },
          { status: 400 }
        );
      }
    }

    // Create contact message in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email, // Already lowercased above
        projectType,
        message,
        privacyAccepted,
        marketingConsent,
        read: false,
        replied: false
      }
    });

    // Send email notifications
    try {
      const emailData = {
        name: contactMessage.name,
        email: contactMessage.email,
        projectType: contactMessage.projectType,
        message: contactMessage.message,
        marketingConsent: contactMessage.marketingConsent,
        submittedAt: contactMessage.createdAt,
      };

      // Send notification to admin (fire and forget - don't block response)
      emailService.sendContactNotification(emailData).catch(error => {
        console.error('Failed to send admin notification:', error);
      });

      // Send auto-reply to customer (fire and forget)
      emailService.sendAutoReply(emailData).catch(error => {
        console.error('Failed to send auto-reply:', error);
      });
    } catch (error) {
      // Log email errors but don't fail the request
      console.error('Email service error:', error);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact message sent successfully',
        id: contactMessage.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}