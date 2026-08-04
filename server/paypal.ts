const PAYPAL_MODE = process.env.PAYPAL_MODE || 'live';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'EBY3NmWWbURMAaxJl4m3xqrvc76TtlBcKebkEzw3lU0lVYfKZrq89UtfGzF_6IagElsHIXjiOQHnrXGD';
const PAYPAL_API_BASE = PAYPAL_MODE === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

export const PAYPAL_PLAN_IDS: Record<string, string> = {
  Bunch: process.env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
  Stack: process.env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
  Deck: process.env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
  Collection: process.env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
};

export function getPayPalConfig() {
  return {
    clientId: PAYPAL_CLIENT_ID,
    mode: PAYPAL_MODE,
    planIds: PAYPAL_PLAN_IDS,
  };
}

let accessToken = '';
let tokenExpiresAt = 0;

export async function getPayPalAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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

export function getPlanIdForTier(tier: string): string {
  const planId = PAYPAL_PLAN_IDS[tier];
  if (!planId) throw new Error(`No PayPal subscription plan ID configured for tier: ${tier}`);
  return planId;
}

export async function createSubscription(tier: string, returnUrl: string, cancelUrl: string) {
  const planId = getPlanIdForTier(tier);
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
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
  const planId = getPlanIdForTier(newTier);
  const token = await getPayPalAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/revise`, {
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
  const res = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return await res.json();
}
