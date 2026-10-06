import { getPayPalAccessToken } from './paypal.js';
import { getAppCredentials } from './configManager.js';
import { getAdminDb } from './firebaseAdmin.js';

export interface WebhookEventLog {
  id: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  status: 'PROCESSED' | 'WARNING' | 'FAILED' | 'SIMULATED';
  summary: string;
  targetUid: string | null;
  subscriptionId: string | null;
  planId?: string | null;
  tierName?: string | null;
  rawEvent?: any;
}

// In-memory ring buffer of recent webhook events for real-time monitoring
const recentWebhookLogs: WebhookEventLog[] = [];
const MAX_LOGS = 100;

function pushWebhookLog(log: WebhookEventLog) {
  recentWebhookLogs.unshift(log);
  if (recentWebhookLogs.length > MAX_LOGS) {
    recentWebhookLogs.pop();
  }
}

export function getRecentWebhookLogs(): WebhookEventLog[] {
  return [...recentWebhookLogs];
}

export function clearRecentWebhookLogs(): void {
  recentWebhookLogs.length = 0;
}

export async function verifyPayPalWebhookSignature(reqHeaders: Record<string, any>, rawBody: any): Promise<boolean> {
  try {
    const creds = await getAppCredentials();
    const webhookId = creds.paypal.webhookId;

    // If no webhookId configured yet, log notice and allow event processing in sandbox/dev mode
    if (!webhookId || webhookId === 'MY_PAYPAL_WEBHOOK_ID') {
      console.warn('[PayPal Webhook] No webhookId configured. Skipping signature check in development mode.');
      return true;
    }

    const token = await getPayPalAccessToken();
    const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

    const verifyPayload = {
      auth_algo: reqHeaders['paypal-auth-algo'] || reqHeaders['PAYPAL-AUTH-ALGO'],
      cert_url: reqHeaders['paypal-cert-url'] || reqHeaders['PAYPAL-CERT-URL'],
      transmission_id: reqHeaders['paypal-transmission-id'] || reqHeaders['PAYPAL-TRANSMISSION-ID'],
      transmission_sig: reqHeaders['paypal-transmission-sig'] || reqHeaders['PAYPAL-TRANSMISSION-SIG'],
      transmission_time: reqHeaders['paypal-transmission-time'] || reqHeaders['PAYPAL-TRANSMISSION-TIME'],
      webhook_id: webhookId,
      webhook_event: rawBody,
    };

    const res = await fetch(`${apiBase}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyPayload),
    });

    if (res.ok) {
      const data = await res.json();
      return data.verification_status === 'SUCCESS';
    } else {
      console.warn('[PayPal Webhook] Verification API returned non-OK status:', await res.text());
    }
  } catch (err: any) {
    console.error('[PayPal Webhook Signature Error]', err.message);
  }
  return false;
}

// Map PayPal plan ID to AccountTier name
export async function resolveTierFromPlanId(planId?: string): Promise<string> {
  if (!planId) return 'Bunch';
  const creds = await getAppCredentials();
  const plans = creds.paypal.planIds;
  if (plans.Bunch === planId) return 'Bunch';
  if (plans.Stack === planId) return 'Stack';
  if (plans.Deck === planId) return 'Deck';
  if (plans.Collection === planId) return 'Collection';
  return 'Bunch';
}

export async function handlePayPalWebhookEvent(
  event: any,
  isSimulation: boolean = false
): Promise<{ success: boolean; handledEvent: string; summary: string; log: WebhookEventLog }> {
  const eventType = event.event_type || 'UNKNOWN';
  const eventId = event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const resource = event.resource || {};
  const db = getAdminDb();

  console.log(`[PayPal Webhook] Processing event: ${eventType} (Event ID: ${eventId})`);

  const subscriptionId = resource.id || resource.billing_agreement_id || null;
  const customUserId = resource.custom_id || resource.custom || null;
  const planId = resource.plan_id || null;

  let targetUid: string | null = null;
  let resolvedTier: string | null = null;
  let summary = '';
  let status: 'PROCESSED' | 'WARNING' | 'FAILED' | 'SIMULATED' = isSimulation ? 'SIMULATED' : 'PROCESSED';

  if (planId) {
    resolvedTier = await resolveTierFromPlanId(planId);
  }

  // 1. Identify Target User ID
  if (customUserId) {
    targetUid = customUserId;
  } else if (subscriptionId) {
    try {
      const snap = await db.collection('subscriptions').where('paypalSubscriptionId', '==', subscriptionId).limit(1).get();
      if (!snap.empty) {
        targetUid = snap.docs[0].id;
        const currentData = snap.docs[0].data();
        if (!resolvedTier && currentData.tierName) {
          resolvedTier = currentData.tierName;
        }
      }
    } catch (err) {
      console.warn('[PayPal Webhook] Firestore subscription query error:', err);
    }
  }

  // 2. Dispatch by Event Type
  try {
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const tier = resolvedTier || 'Bunch';
        summary = `Subscription activated for plan ${tier} (Sub ID: ${subscriptionId || 'N/A'})`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            tierName: tier,
            billingStatus: 'ACTIVE',
            provider: 'paypal',
            paypalSubscriptionId: subscriptionId || 'ACTIVATED_SUB',
            activatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Activated ${tier} tier for UID: ${targetUid}`);
        } else {
          status = 'WARNING';
          summary += ' - No matching user UID found in database';
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CREATED': {
        summary = `Subscription created (Sub ID: ${subscriptionId || 'N/A'})`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            billingStatus: 'CREATED',
            paypalSubscriptionId: subscriptionId || 'CREATED_SUB',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.UPDATED':
      case 'BILLING.SUBSCRIPTION.RE-ACTIVATED': {
        const tier = resolvedTier || 'Bunch';
        summary = `Subscription ${eventType.toLowerCase()} to ${tier}`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            tierName: tier,
            billingStatus: 'ACTIVE',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Updated subscription for UID: ${targetUid} to ${tier}`);
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        summary = `Subscription cancelled. Reverting account to free Starter tier.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            tierName: 'Starter',
            billingStatus: 'CANCELLED',
            cancelledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Cancelled subscription and reverted to Starter for UID: ${targetUid}`);
        } else {
          status = 'WARNING';
          summary += ' - No matching user found to cancel';
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const actionType = eventType.replace('BILLING.SUBSCRIPTION.', '');
        summary = `Subscription ${actionType}. Reverting account to free Starter tier.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            tierName: 'Starter',
            billingStatus: actionType,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] ${actionType} for UID: ${targetUid}`);
        }
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        const amount = resource.amount?.total ? `$${resource.amount.total} ${resource.amount.currency}` : 'recurring amount';
        summary = `Recurring sale payment of ${amount} completed successfully.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            billingStatus: 'ACTIVE',
            lastPaymentAt: new Date().toISOString(),
            lastPaymentAmount: resource.amount?.total || null,
            lastPaymentCurrency: resource.amount?.currency || 'USD',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Recorded payment completion for UID: ${targetUid}`);
        }
        break;
      }

      case 'PAYMENT.SALE.DENIED': {
        summary = `Payment sale denied by PayPal.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            billingStatus: 'PAYMENT_DENIED',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Payment denied for UID: ${targetUid}`);
        }
        break;
      }

      case 'PAYMENT.SALE.REFUNDED': {
        summary = `Payment sale refunded.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            billingStatus: 'REFUNDED',
            refundedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
        break;
      }

      case 'PAYMENT.SALE.REVERSED': {
        summary = `Payment sale reversed (chargeback/dispute). Setting tier to Starter.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            tierName: 'Starter',
            effectiveTier: 'Starter',
            billingStatus: 'PAYMENT_REVERSED',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Payment reversed for UID: ${targetUid}`);
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        summary = `Recurring payment failed for subscription ${subscriptionId || 'N/A'}.`;
        if (targetUid) {
          await db.collection('subscriptions').doc(targetUid).set({
            billingStatus: 'PAST_DUE',
            lastPaymentFailureAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
          console.log(`[PayPal Webhook] Payment failed notice recorded for UID: ${targetUid}`);
        }
        break;
      }

      case 'CHECKOUT.ORDER.APPROVED': {
        summary = `Checkout order approved: ${resource.id || 'N/A'}`;
        break;
      }

      default:
        summary = `Received and acknowledged event ${eventType}`;
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
        break;
    }
  } catch (err: any) {
    status = 'FAILED';
    summary = `Error executing webhook handler: ${err.message}`;
    console.error('[PayPal Webhook Execution Error]', err);
  }

  // 3. Construct and record log entry
  const logEntry: WebhookEventLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId,
    eventType,
    timestamp: new Date().toISOString(),
    status,
    summary,
    targetUid,
    subscriptionId,
    planId,
    tierName: resolvedTier,
    rawEvent: isSimulation ? event : { id: event.id, event_type: event.event_type, create_time: event.create_time, summary: event.summary },
  };

  pushWebhookLog(logEntry);

  // Store in Firestore asynchronously if available
  try {
    await db.collection('paypal_webhook_events').doc(logEntry.id).set(logEntry);
  } catch (dbErr) {
    // Non-blocking background log write
  }

  return {
    success: status !== 'FAILED',
    handledEvent: eventType,
    summary,
    log: logEntry,
  };
}

// Generate a simulated webhook payload for testing purposes
export function createSimulatedWebhookEvent(
  eventType: string = 'BILLING.SUBSCRIPTION.ACTIVATED',
  customUid?: string,
  tier: string = 'Stack'
) {
  const timestamp = new Date().toISOString();
  const subId = `I-SIM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const sampleEvents: Record<string, any> = {
    'BILLING.SUBSCRIPTION.ACTIVATED': {
      id: `WH-SIM-${Date.now()}`,
      create_time: timestamp,
      resource_type: 'subscription',
      event_version: '1.0',
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      summary: `Subscription activated for ${tier} Tier`,
      resource: {
        id: subId,
        status: 'ACTIVE',
        custom_id: customUid || 'simulated_user_123',
        plan_id: `P-SIM_${tier.toUpperCase()}`,
        start_time: timestamp,
        subscriber: {
          name: { given_name: 'Pokemon', surname: 'Collector' },
          email_address: 'collector@example.com',
        },
      },
    },
    'PAYMENT.SALE.COMPLETED': {
      id: `WH-SIM-${Date.now()}`,
      create_time: timestamp,
      resource_type: 'sale',
      event_version: '1.0',
      event_type: 'PAYMENT.SALE.COMPLETED',
      summary: `Sale payment completed`,
      resource: {
        id: `PAY-SIM-${Date.now()}`,
        billing_agreement_id: subId,
        custom_id: customUid || 'simulated_user_123',
        state: 'completed',
        amount: {
          total: (tier === 'Collection' ? '14.00' : tier === 'Deck' ? '11.00' : tier === 'Stack' ? '7.00' : '4.00'),
          currency: 'USD',
        },
      },
    },
    'BILLING.SUBSCRIPTION.CANCELLED': {
      id: `WH-SIM-${Date.now()}`,
      create_time: timestamp,
      resource_type: 'subscription',
      event_version: '1.0',
      event_type: 'BILLING.SUBSCRIPTION.CANCELLED',
      summary: `Subscription cancelled`,
      resource: {
        id: subId,
        status: 'CANCELLED',
        custom_id: customUid || 'simulated_user_123',
      },
    },
    'BILLING.SUBSCRIPTION.SUSPENDED': {
      id: `WH-SIM-${Date.now()}`,
      create_time: timestamp,
      resource_type: 'subscription',
      event_version: '1.0',
      event_type: 'BILLING.SUBSCRIPTION.SUSPENDED',
      summary: `Subscription suspended`,
      resource: {
        id: subId,
        status: 'SUSPENDED',
        custom_id: customUid || 'simulated_user_123',
      },
    },
  };

  return sampleEvents[eventType] || sampleEvents['BILLING.SUBSCRIPTION.ACTIVATED'];
}
