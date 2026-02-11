import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { verifyWebhook } from '@clerk/nextjs/server';
import { createSupabaseAdmin } from '@/lib/supabase-server';

/**
 * Clerk Billing / auth webhook endpoint.
 *
 * This endpoint:
 * - Verifies the Svix signature using CLERK_WEBHOOK_SECRET
 * - Syncs subscription status into Supabase subscriptions table
 * - Handles subscription lifecycle events (created, updated, active, canceled, ended, pastDue)
 */

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

type SubscriptionEventData = {
  id?: string;
  object?: {
    id?: string;
    user_id?: string;
    plan?: {
      key?: string;
    };
    status?: string;
  };
  user_id?: string;
  plan?: {
    key?: string;
  };
  status?: string;
};

function extractSubscriptionData(
  eventType: string,
  data: unknown
): {
  clerkUserId: string;
  clerkSubscriptionId: string;
  planKey: string;
  status: 'active' | 'canceled' | 'ended' | 'past_due';
} | null {
  const d = data as SubscriptionEventData;

  // Handle subscription.created / subscription.updated
  if (eventType.startsWith('subscription.')) {
    const obj = d.object ?? d;
    const userId = obj.user_id ?? d.user_id;
    const subscriptionId = obj.id ?? d.id;
    const planKey = obj.plan?.key ?? d.plan?.key;
    const status = obj.status ?? d.status;

    if (!userId || !subscriptionId || !planKey || !status) {
      console.warn('[CLERK_WEBHOOK] Missing required fields in subscription event', {
        eventType,
        hasUserId: !!userId,
        hasSubscriptionId: !!subscriptionId,
        hasPlanKey: !!planKey,
        hasStatus: !!status,
      });
      return null;
    }

    // Map Clerk status to our DB status
    const statusMap: Record<string, 'active' | 'canceled' | 'ended' | 'past_due'> = {
      active: 'active',
      canceled: 'canceled',
      ended: 'ended',
      past_due: 'past_due',
    };

    const mappedStatus = statusMap[status.toLowerCase()] ?? 'active';

    return {
      clerkUserId: userId,
      clerkSubscriptionId: subscriptionId,
      planKey,
      status: mappedStatus,
    };
  }

  // Handle subscriptionItem.active / .canceled / .ended / .pastDue
  if (eventType.startsWith('subscriptionItem.')) {
    const obj = d.object ?? d;
    const userId = obj.user_id ?? d.user_id;
    const subscriptionId = obj.id ?? d.id;
    const planKey = obj.plan?.key ?? d.plan?.key;

    if (!userId || !subscriptionId || !planKey) {
      console.warn('[CLERK_WEBHOOK] Missing required fields in subscriptionItem event', {
        eventType,
        hasUserId: !!userId,
        hasSubscriptionId: !!subscriptionId,
        hasPlanKey: !!planKey,
      });
      return null;
    }

    // Extract status from event type: subscriptionItem.active -> active
    const statusFromType = eventType.split('.').pop()?.toLowerCase() ?? 'active';
    const statusMap: Record<string, 'active' | 'canceled' | 'ended' | 'past_due'> = {
      active: 'active',
      canceled: 'canceled',
      ended: 'ended',
      pastdue: 'past_due',
    };

    const mappedStatus = statusMap[statusFromType] ?? 'active';

    return {
      clerkUserId: userId,
      clerkSubscriptionId: subscriptionId,
      planKey,
      status: mappedStatus,
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  if (!CLERK_WEBHOOK_SECRET) {
    console.warn('[CLERK_WEBHOOK] CLERK_WEBHOOK_SECRET is not configured');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let event: WebhookEvent;

  try {
    event = await verifyWebhook({
      secret: CLERK_WEBHOOK_SECRET,
      payload,
      headers,
    });
  } catch (error) {
    console.error('[CLERK_WEBHOOK] Signature verification failed', error);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = event;

  console.log('[CLERK_WEBHOOK] Received event', {
    type,
    id: (data as { id?: string } | undefined)?.id,
  });

  // Handle subscription lifecycle events
  const subscriptionEvents = [
    'subscription.created',
    'subscription.updated',
    'subscriptionItem.active',
    'subscriptionItem.canceled',
    'subscriptionItem.ended',
    'subscriptionItem.pastDue',
  ];

  if (subscriptionEvents.includes(type)) {
    const subscriptionData = extractSubscriptionData(type, data);

    if (subscriptionData) {
      try {
        const supabase = createSupabaseAdmin();

        const { error } = await supabase.from('subscriptions').upsert(
          {
            clerk_user_id: subscriptionData.clerkUserId,
            clerk_subscription_id: subscriptionData.clerkSubscriptionId,
            plan_key: subscriptionData.planKey,
            status: subscriptionData.status,
          },
          {
            onConflict: 'clerk_user_id,plan_key',
          }
        );

        if (error) {
          console.error('[CLERK_WEBHOOK] Failed to sync subscription to Supabase', error);
          return new NextResponse('Database sync failed', { status: 500 });
        }

        console.log('[CLERK_WEBHOOK] Synced subscription', {
          clerkUserId: subscriptionData.clerkUserId,
          planKey: subscriptionData.planKey,
          status: subscriptionData.status,
        });
      } catch (err) {
        console.error('[CLERK_WEBHOOK] Error syncing subscription', err);
        return new NextResponse('Database sync error', { status: 500 });
      }
    }
  }

  return new NextResponse('Webhook received', { status: 200 });
}

