'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { feedbackSchema } from '@/lib/schemas/feedback';

export type SubmitFeedbackResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Server Action: Submit feedback to n8n webhook.
 * Extracts user info from Clerk, collects request metadata, and sends to n8n.
 */
export async function submitFeedback(
  formData: FormData
): Promise<SubmitFeedbackResult> {
  try {
    // Validate form data
    const message = formData.get('message')?.toString().trim();
    const validation = feedbackSchema.safeParse({ description: message });
    if (!validation.success) {
      const error = validation.error.errors[0]?.message ?? 'Invalid feedback';
      return { success: false, error };
    }

    // Get user info from Clerk (optional - feedback works for unauthenticated users)
    const { userId } = await auth();
    let firstName = 'Anonymous';
    let lastName = '';
    let email: string | undefined;

    if (userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        firstName = user.firstName ?? firstName;
        lastName = user.lastName ?? lastName;
        email = user.emailAddresses[0]?.emailAddress;
      } catch (err) {
        console.warn('[submitFeedback] Failed to fetch user details:', err);
        // Continue with anonymous feedback
      }
    }

    // Get request metadata
    const headersList = await headers();
    const browser = headersList.get('user-agent') ?? undefined;
    const referer = headersList.get('referer') ?? undefined;
    const timestamp = new Date().toISOString();

    // Construct payload for n8n webhook
    const payload = {
      userId: userId ?? undefined,
      firstName,
      lastName,
      email,
      message: validation.data.description,
      browser,
      timestamp,
      url: referer,
    };

    // Get n8n webhook URL from environment
    const webhookUrl = process.env.N8N_FEEDBACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('[submitFeedback] N8N_FEEDBACK_WEBHOOK_URL not configured');
      return {
        success: false,
        error: 'Feedback service is not configured. Please try again later.',
      };
    }

    // Call n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          '[submitFeedback] n8n webhook error:',
          response.status,
          response.statusText
        );
        return {
          success: false,
          error: 'Failed to send feedback. Please try again.',
        };
      }

      return {
        success: true,
        message: 'Feedback submitted successfully',
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('[submitFeedback] Request timeout');
        return {
          success: false,
          error: 'Request timed out. Please try again.',
        };
      }
      throw err;
    }
  } catch (err) {
    console.error('[submitFeedback] Unexpected error:', err);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
