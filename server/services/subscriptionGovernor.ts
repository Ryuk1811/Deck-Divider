import { getAdminDb, hasAdminCredentials } from '../firebaseAdmin.js';

export interface ServerGovernedSubscription {
  id: string;
  tierName: string;
  effectiveTier: string;
  billingStatus: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  paymentType: 'one_time' | 'recurring';
  provider: 'paypal' | 'system';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining: number;
  isExpired: boolean;
  isSuperUser: boolean;
  isLifetime?: boolean;
  lifetimeOrderNumber?: number;
  paypalSubscriptionId?: string;
  updatedAt: string;
  governorNote?: string;
}

export const ONE_TIME_PASS_DURATION_DAYS = 30;

export function calculateOneTimePeriod(durationDays = ONE_TIME_PASS_DURATION_DAYS, fromDate = new Date()) {
  const start = new Date(fromDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return {
    currentPeriodStart: start.toISOString(),
    currentPeriodEnd: end.toISOString(),
  };
}

export function evaluateServerSubscription(
  sub: any,
  isSuperUser = false
): ServerGovernedSubscription {
  const now = Date.now();
  const subId = sub?.id || 'guest';
  const rawTier = (sub?.tierName || 'Starter');
  const isSuper = isSuperUser || Boolean(sub?.isSuperUser);

  if (isSuper) {
    return {
      id: subId,
      tierName: 'Collection',
      effectiveTier: 'Collection',
      billingStatus: 'active',
      paymentType: 'recurring',
      provider: 'system',
      daysRemaining: Infinity,
      isExpired: false,
      isSuperUser: true,
      isLifetime: true,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: 'Governed as Super User (Unlimited Lifetime Access)',
    };
  }

  // Lifetime Founder Pass (Collection Tier - One-Time Payment $250)
  if (sub?.isLifetime || (sub?.paymentType === 'one_time' && sub?.tierName === 'Collection')) {
    return {
      id: subId,
      tierName: 'Collection',
      effectiveTier: 'Collection',
      billingStatus: 'active',
      paymentType: 'one_time',
      provider: sub?.provider || 'paypal',
      daysRemaining: 99999,
      isExpired: false,
      isSuperUser: false,
      isLifetime: true,
      lifetimeOrderNumber: sub?.lifetimeOrderNumber,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: `Governed as Lifetime Founder Pass Member #${sub?.lifetimeOrderNumber || 1} (Permanent Collection Tier)`,
    };
  }

  if (rawTier === 'Starter' || !sub) {
    return {
      id: subId,
      tierName: 'Starter',
      effectiveTier: 'Starter',
      billingStatus: 'active',
      paymentType: 'one_time',
      provider: 'system',
      daysRemaining: Infinity,
      isExpired: false,
      isSuperUser: false,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: 'Governed under Standard Free Starter Tier',
    };
  }

  const provider = (sub.provider as 'paypal' | 'system') || 'paypal';
  const paymentType = (sub.paymentType as 'one_time' | 'recurring') || 'recurring';

  // PayPal recurring
  const isCanceledOrPastDue = sub.billingStatus === 'canceled' || sub.billingStatus === 'past_due' || sub.billingStatus === 'unpaid';
  const effectiveTier = isCanceledOrPastDue ? 'Starter' : rawTier;

  return {
    id: subId,
    tierName: rawTier,
    effectiveTier,
    billingStatus: isCanceledOrPastDue ? sub.billingStatus : 'active',
    paymentType,
    provider: 'paypal',
    paypalSubscriptionId: sub.paypalSubscriptionId,
    daysRemaining: Infinity,
    isExpired: isCanceledOrPastDue,
    isSuperUser: false,
    updatedAt: sub?.updatedAt || new Date().toISOString(),
    governorNote: isCanceledOrPastDue
      ? `Recurring subscription ${sub.billingStatus}. Effective tier is Starter.`
      : `Active recurring PayPal subscription (${rawTier})`,
  };
}

/**
 * Fetches and evaluates the subscription for a user from Firestore Admin DB
 */
export async function getGovernedUserSubscription(userId: string, isSuperUser = false): Promise<ServerGovernedSubscription> {
  try {
    if (!hasAdminCredentials()) {
      return evaluateServerSubscription(null, isSuperUser);
    }
    const db = getAdminDb();
    const docSnap = await db.collection('subscriptions').doc(userId).get();
    if (!docSnap.exists) {
      return evaluateServerSubscription(null, isSuperUser);
    }
    const rawData = docSnap.data();
    return evaluateServerSubscription({ ...rawData, id: userId }, isSuperUser);
  } catch (error: any) {
    console.warn('[Governor] Firestore lookup fallback:', error?.message || error);
    return evaluateServerSubscription(null, isSuperUser);
  }
}
