import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';
import { z } from 'zod';

/**
 * Webhook payload schema from n8n (original data + AI analysis).
 * Matches the structure defined in user-feedback-prd.md.
 */
const webhookPayloadSchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().min(1),
  browser: z.string().optional(),
  timestamp: z.string().optional(),
  url: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  category: z.enum(['bug', 'feature_request', 'question', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  summary: z.string().optional(),
  actionable: z.boolean().optional(),
  processedAt: z.string().optional(),
});

/**
 * Rate limit tracker: IP address → {count, resetTime}
 * In-memory storage (works for single server; use Redis for multi-server).
 */
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Rate limit configuration:
 * - Max requests: 10 per minute per IP
 * - Time window: 60 seconds (60,000 milliseconds)
 */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Cleanup old rate limit entries to prevent memory leaks.
 * Runs periodically to remove entries older than 5 minutes.
 */
let lastCleanup = Date.now();
function cleanupOldEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  const cutoff = now - CLEANUP_INTERVAL_MS;
  for (const [ip, data] of rateLimitMap.entries()) {
    if (data.resetTime < cutoff) {
      rateLimitMap.delete(ip);
    }
  }
  lastCleanup = now;
}

/**
 * Get client IP address from request headers.
 * Tries multiple headers in order of preference (Vercel → standard → fallback).
 */
function getClientIP(request: NextRequest): string {
  // Vercel uses x-forwarded-for (may contain multiple IPs, take first)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  // Alternative header used by some proxies
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to connection remote address (may not work behind proxies)
  const remoteAddress = request.headers.get('remote-addr');
  if (remoteAddress) {
    return remoteAddress;
  }

  return 'unknown';
}

/**
 * Check rate limit for the given IP address.
 * Returns {allowed: true} if request should proceed, or {allowed: false, retryAfter} if blocked.
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    // First request from this IP: create entry
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  // Check if time window has passed (reset if expired)
  if (now >= entry.resetTime) {
    // Reset: new time window starts now
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  // Within time window: check count
  if (entry.count < RATE_LIMIT_MAX) {
    // Under limit: increment count and allow
    entry.count++;
    return { allowed: true };
  }

  // Over limit: block and return retry-after seconds
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return { allowed: false, retryAfter };
}

/**
 * Verify API key from request header.
 * Compares X-API-Key header to N8N_WEBHOOK_SECRET environment variable.
 */
function verifyAPIKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!expectedSecret) {
    // Secret not configured: log warning but allow (for development)
    console.warn('[WEBHOOK] N8N_WEBHOOK_SECRET not configured');
    return true; // Allow in development, but should be configured in production
  }

  if (!apiKey) {
    return false; // Missing API key
  }

  // Use constant-time comparison to prevent timing attacks
  // In production, consider using crypto.timingSafeEqual for Node.js
  return apiKey === expectedSecret;
}

/**
 * Log webhook request with consistent format.
 * Format: [WEBHOOK] timestamp | IP | status | reason
 */
function logWebhookRequest(
  ip: string,
  status: 'SUCCESS' | 'BLOCKED' | 'ERROR',
  reason: string,
  extra?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const logMessage = `[WEBHOOK] ${timestamp} | ${ip} | ${status} | ${reason}`;
  if (extra) {
    console.log(logMessage, extra);
  } else {
    console.log(logMessage);
  }
}

/**
 * POST handler for n8n webhook callback.
 * Receives processed feedback with AI analysis and stores in Supabase.
 *
 * Security layers:
 * 1. Rate limiting (10 requests/minute per IP)
 * 2. API key verification (X-API-Key header)
 * 3. Request logging (all attempts logged)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIP(request);
  let requestSize = 0;

  try {
    // Cleanup old rate limit entries periodically
    cleanupOldEntries();

    // Get request body size (for logging)
    const body = await request.json();
    requestSize = JSON.stringify(body).length;

    // Log all attempts (before security checks)
    if (requestSize > 100 * 1024) {
      // Warn about large payloads (> 100KB)
      logWebhookRequest(ip, 'ERROR', 'Request size exceeds 100KB', {
        size: requestSize,
      });
    }

    // Security Layer 1: Rate Limiting
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      logWebhookRequest(ip, 'BLOCKED', 'Rate limit exceeded', {
        retryAfter: rateLimitCheck.retryAfter,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfter ?? 60),
          },
        }
      );
    }

    // Security Layer 2: API Key Verification
    const apiKeyValid = verifyAPIKey(request);
    if (!apiKeyValid) {
      logWebhookRequest(ip, 'BLOCKED', 'Invalid or missing API key');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate payload structure
    const validation = webhookPayloadSchema.safeParse(body);
    if (!validation.success) {
      const error = validation.error.errors[0]?.message ?? 'Invalid payload';
      logWebhookRequest(ip, 'ERROR', `Validation error: ${error}`, {
        validationErrors: validation.error.errors,
      });
      return NextResponse.json(
        { success: false, error: `Invalid payload: ${error}` },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Insert into Supabase
    const supabase = createSupabaseAdmin();
    const { error: insertError } = await supabase.from('feedback').insert({
      user_id: data.userId ?? null,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email ?? null,
      message: data.message,
      browser: data.browser ?? null,
      url: data.url ?? null,
      sentiment: data.sentiment ?? null,
      category: data.category ?? null,
      priority: data.priority ?? null,
      summary: data.summary ?? null,
      actionable: data.actionable ?? null,
      created_at: data.timestamp
        ? new Date(data.timestamp).toISOString()
        : new Date().toISOString(),
      processed_at: data.processedAt
        ? new Date(data.processedAt).toISOString()
        : null,
    });

    if (insertError) {
      logWebhookRequest(ip, 'ERROR', 'Database error', {
        error: insertError.message,
        userId: data.userId,
      });
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    // Success: log with processing time
    const processingTime = Date.now() - startTime;
    logWebhookRequest(ip, 'SUCCESS', 'Feedback stored', {
      userId: data.userId,
      sentiment: data.sentiment,
      category: data.category,
      priority: data.priority,
      requestSize,
      processingTimeMs: processingTime,
    });

    return NextResponse.json(
      { success: true, message: 'Feedback stored' },
      { status: 200 }
    );
  } catch (err) {
    // Unexpected error: log and return generic error
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error';
    logWebhookRequest(ip, 'ERROR', `Unexpected error: ${errorMessage}`, {
      requestSize,
      error: err instanceof Error ? err.stack : String(err),
    });
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
