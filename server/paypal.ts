import { getAppCredentials } from './configManager';

export async function getPayPalConfig() {
  const creds = await getAppCredentials();
  return {
    clientId: creds.paypal.clientId,
    mode: creds.paypal.mode,
    planIds: creds.paypal.planIds,
  };
}

let accessToken = '';
let tokenExpiresAt = 0;

export async function getPayPalAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const creds = await getAppCredentials();
  const { clientId, clientSecret, mode } = creds.paypal;
  const apiBase = mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (!response.ok) {
    const errText = await response.text();
    console.error('Failed to get PayPal token:', errText);
    throw new Error('Failed to authenticate with PayPal Live API');
  }
  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;
  return accessToken;
}

export async function createPayPalOrder(amount: number, description: string, returnUrl?: string, cancelUrl?: string) {
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
          description: description || 'DECK / divider Subscription Pass',
        },
      ],
      application_context: {
        brand_name: 'DECK / divider',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: returnUrl || 'https://deckdivider.app/app?paypal_success=true',
        cancel_url: cancelUrl || 'https://deckdivider.app/app?paypal_cancel=true',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('PayPal createPayPalOrder error:', err);
    throw new Error('Failed to create PayPal order: ' + err);
  }

  const data = await res.json();
  const approvalLink = data.links?.find((l: any) => l.rel === 'approve')?.href;
  return {
    orderId: data.id,
    approvalUrl: approvalLink,
    ...data,
  };
}

export const TIER_PRICES: Record<string, number> = {
  Bunch: 11,
  Stack: 22,
  Deck: 33,
  Collection: 44,
};

export async function getPlanIdForTier(tier: string): Promise<string> {
  const creds = await getAppCredentials();
  const planId = creds.paypal.planIds[tier as keyof typeof creds.paypal.planIds];
  if (!planId) throw new Error(`No PayPal subscription plan ID configured for tier: ${tier}`);
  return planId;
}

export async function createSubscription(tier: string, returnUrl: string, cancelUrl: string) {
  const planId = await getPlanIdForTier(tier);
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: 'Deck Divider',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('PayPal createSubscription error:', err);
    throw new Error('Failed to create subscription: ' + err);
  }
  return await res.json();
}

export async function reviseSubscription(subscriptionId: string, newTier: string, returnUrl: string, cancelUrl: string) {
  const planId = await getPlanIdForTier(newTier);
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v1/billing/subscriptions/${subscriptionId}/revise`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: 'Deck Divider',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  });

  if (res.status === 200 || res.status === 201) {
    return await res.json();
  } else if (res.status === 204) {
    return { status: 'NO_APPROVAL_NEEDED', plan_id: planId };
  } else {
    const err = await res.text();
    console.error('PayPal reviseSubscription error:', err);
    throw new Error('Failed to revise subscription: ' + err);
  }
}

export async function getSubscription(subscriptionId: string) {
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return await res.json();
}

export const PAYPAL_WEBHOOK_EVENT_TYPES = [
  { name: 'BILLING.SUBSCRIPTION.ACTIVATED', description: 'A subscription is activated.' },
  { name: 'BILLING.SUBSCRIPTION.CREATED', description: 'A subscription is created.' },
  { name: 'BILLING.SUBSCRIPTION.CANCELLED', description: 'A subscription is cancelled.' },
  { name: 'BILLING.SUBSCRIPTION.SUSPENDED', description: 'A subscription is suspended.' },
  { name: 'BILLING.SUBSCRIPTION.EXPIRED', description: 'A subscription expires.' },
  { name: 'BILLING.SUBSCRIPTION.UPDATED', description: 'A subscription is updated.' },
  { name: 'BILLING.SUBSCRIPTION.RE-ACTIVATED', description: 'A subscription is re-activated.' },
  { name: 'PAYMENT.SALE.COMPLETED', description: 'A sale payment is completed.' },
  { name: 'PAYMENT.SALE.DENIED', description: 'A sale payment is denied.' },
  { name: 'PAYMENT.SALE.REFUNDED', description: 'A sale payment is refunded.' },
  { name: 'PAYMENT.SALE.REVERSED', description: 'A sale payment is reversed.' },
];

export async function listPayPalWebhooks() {
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v1/notifications/webhooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Failed to list PayPal webhooks: ' + err);
  }
  return await res.json();
}

export async function registerPayPalWebhook(webhookUrl: string) {
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const eventTypes = PAYPAL_WEBHOOK_EVENT_TYPES.map((e) => ({ name: e.name }));

  const res = await fetch(`${apiBase}/v1/notifications/webhooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: webhookUrl,
      event_types: eventTypes,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Failed to register PayPal webhook: ' + err);
  }
  return await res.json();
}

export async function deletePayPalWebhook(webhookId: string) {
  const token = await getPayPalAccessToken();
  const creds = await getAppCredentials();
  const apiBase = creds.paypal.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

  const res = await fetch(`${apiBase}/v1/notifications/webhooks/${webhookId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error('Failed to delete PayPal webhook: ' + err);
  }
  return { success: true };
}

