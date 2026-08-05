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
