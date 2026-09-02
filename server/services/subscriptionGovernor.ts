import { getAdminDb } from '../firebaseAdmin.js';

export interface ServerGovernedSubscription {
  id: string;
  tierName: string;
  effectiveTier: string;
  billingStatus: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  paymentType: 'one_time' | 'recurring';
  provider: 'razorpay' | 'paypal' | 'system';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining: number;
  isExpired: boolean;
  isSuperUser: boolean;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
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
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: 'Governed as Super User (Unlimited Lifetime Access)',
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

  const provider = sub.provider || (sub.razorpayPaymentId ? 'razorpay' : 'paypal');
  const paymentType = sub.paymentType || (provider === 'razorpay' ? 'one_time' : 'recurring');

  // Razorpay one-time payment governor
  if (paymentType === 'one_time' || provider === 'razorpay') {
    let periodEndMs = 0;

    if (sub.currentPeriodEnd) {
      periodEndMs = new Date(sub.currentPeriodEnd).getTime();
    } else if (sub.updatedAt) {
      const updatedMs = new Date(sub.updatedAt).getTime();
      periodEndMs = updatedMs + ONE_TIME_PASS_DURATION_DAYS * 24 * 60 * 60 * 1000;
    } else {
      periodEndMs = now;
    }

    const diffMs = periodEndMs - now;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isExpired = diffMs <= 0;

    if (isExpired) {
      return {
        id: subId,
        tierName: rawTier,
        effectiveTier: 'Starter',
        billingStatus: 'expired',
        paymentType: 'one_time',
        provider: 'razorpay',
        currentPeriodStart: sub.currentPeriodStart || sub.updatedAt,
        currentPeriodEnd: sub.currentPeriodEnd || new Date(periodEndMs).toISOString(),
        daysRemaining: 0,
        isExpired: true,
        isSuperUser: false,
        razorpayPaymentId: sub.razorpayPaymentId,
        razorpayOrderId: sub.razorpayOrderId,
        updatedAt: sub.updatedAt || new Date().toISOString(),
        governorNote: `One-time ${rawTier} pass expired on ${new Date(periodEndMs).toLocaleDateString()}. Effective tier is Starter.`,
      };
    }

    return {
      id: subId,
      tierName: rawTier,
      effectiveTier: rawTier,
      billingStatus: 'active',
      paymentType: 'one_time',
      provider: 'razorpay',
      currentPeriodStart: sub.currentPeriodStart || sub.updatedAt,
      currentPeriodEnd: sub.currentPeriodEnd || new Date(periodEndMs).toISOString(),
      daysRemaining,
      isExpired: false,
      isSuperUser: false,
      razorpayPaymentId: sub.razorpayPaymentId,
      razorpayOrderId: sub.razorpayOrderId,
      updatedAt: sub.updatedAt || new Date().toISOString(),
      governorNote: `Active one-time ${rawTier} pass (${daysRemaining} days remaining)`,
    };
  }

  // PayPal recurring
  const isCanceledOrPastDue = sub.billingStatus === 'canceled' || sub.billingStatus === 'past_due' || sub.billingStatus === 'unpaid';
  const effectiveTier = isCanceledOrPastDue ? 'Starter' : rawTier;

  return {
    id: subId,
    tierName: rawTier,
    effectiveTier,
    billingStatus: isCanceledOrPastDue ? sub.billingStatus : 'active',
    paymentType: 'recurring',
    provider: 'paypal',
    paypalSubscriptionId: sub.paypalSubscriptionId,
    daysRemaining: Infinity,
    isExpired: isCanceledOrPastDue,
    isSuperUser: false,
    updatedAt: sub.updatedAt || new Date().toISOString(),
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
    const db = getAdminDb();
    const docSnap = await db.collection('subscriptions').doc(userId).get();
    if (!docSnap.exists) {
      return evaluateServerSubscription(null, isSuperUser);
    }
    const rawData = docSnap.data();
    return evaluateServerSubscription({ ...rawData, id: userId }, isSuperUser);
  } catch (error) {
    console.warn('[Governor] Firestore lookup fallback:', error);
    return evaluateServerSubscription(null, isSuperUser);
  }
}
