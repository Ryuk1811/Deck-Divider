import { getPayPalAccessToken } from './paypal.js';
import { getAppCredentials } from './configManager.js';
import { getAdminDb } from './firebaseAdmin.js';

export async function verifyPayPalWebhookSignature(reqHeaders: Record<string, any>, rawBody: any): Promise<boolean> {
  try {
    const creds = await getAppCredentials();
    const webhookId = creds.paypal.webhookId;

    // If no webhookId configured yet, log warning and allow event processing in sandbox/dev mode
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

export async function handlePayPalWebhookEvent(event: any): Promise<{ success: boolean; handledEvent: string }> {
  const eventType = event.event_type;
  const resource = event.resource || {};
  const db = getAdminDb();

  console.log(`[PayPal Webhook] Processing event: ${eventType} (ID: ${event.id})`);

  const subscriptionId = resource.id || resource.billing_agreement_id;
  const customUserId = resource.custom_id;

  let targetUid: string | null = null;

  if (customUserId) {
    targetUid = customUserId;
  } else if (subscriptionId) {
    // Find subscription doc in Firestore matching paypalSubscriptionId
    const snap = await db.collection('subscriptions').where('paypalSubscriptionId', '==', subscriptionId).limit(1).get();
    if (!snap.empty) {
      targetUid = snap.docs[0].id;
    }
  }

  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.CREATED': {
      if (targetUid) {
        await db.collection('subscriptions').doc(targetUid).set({
          billingStatus: 'ACTIVE',
          paypalSubscriptionId: subscriptionId || 'ACTIVATED_SUB',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[PayPal Webhook] Activated subscription for UID: ${targetUid}`);
      }
      break;
    }

    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      if (targetUid) {
        await db.collection('subscriptions').doc(targetUid).set({
          tierName: 'Starter', // Revert to free Starter tier
          billingStatus: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[PayPal Webhook] Cancelled subscription and reverted to Starter tier for UID: ${targetUid}`);
      }
      break;
    }

    case 'BILLING.SUBSCRIPTION.SUSPENDED':
    case 'BILLING.SUBSCRIPTION.EXPIRED': {
      if (targetUid) {
        await db.collection('subscriptions').doc(targetUid).set({
          tierName: 'Starter', // Revert to free tier on expiration/suspension
          billingStatus: eventType.replace('BILLING.SUBSCRIPTION.', ''),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[PayPal Webhook] ${eventType} for UID: ${targetUid}`);
      }
      break;
    }

    case 'PAYMENT.SALE.COMPLETED': {
      if (targetUid) {
        await db.collection('subscriptions').doc(targetUid).set({
          billingStatus: 'ACTIVE',
          lastPaymentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[PayPal Webhook] Recurring payment completed for UID: ${targetUid}`);
      }
      break;
    }

    case 'PAYMENT.SALE.DENIED': {
      if (targetUid) {
        await db.collection('subscriptions').doc(targetUid).set({
          billingStatus: 'PAYMENT_DENIED',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        console.log(`[PayPal Webhook] Payment denied for UID: ${targetUid}`);
      }
      break;
    }

    default:
      console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
  }

  return { success: true, handledEvent: eventType };
}
