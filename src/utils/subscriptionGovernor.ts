import { AccountTier, SubscriptionRecord } from '../types';

export interface GovernedSubscription {
  id: string;
  tierName: AccountTier;
  effectiveTier: AccountTier;
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

/**
 * 30-day period standard for Razorpay one-time tier passes
 */
export const ONE_TIME_PASS_DURATION_DAYS = 30;

/**
 * Calculates start and end timestamps for a one-time subscription purchase
 */
export function calculateOneTimePeriod(durationDays = ONE_TIME_PASS_DURATION_DAYS, fromDate = new Date()): { currentPeriodStart: string; currentPeriodEnd: string } {
  const start = new Date(fromDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return {
    currentPeriodStart: start.toISOString(),
    currentPeriodEnd: end.toISOString(),
  };
}

/**
 * Core Subscription Governor: evaluates real-time validity, expiration, and effective tier
 */
export function evaluateSubscriptionGovernor(
  sub: Partial<SubscriptionRecord> | null | undefined,
  isSuperUser = false
): GovernedSubscription {
  const now = Date.now();
  const subId = sub?.id || 'guest';
  const rawTier = (sub?.tierName || 'Starter') as AccountTier;
  const isSuper = isSuperUser || Boolean(sub?.isSuperUser);

  // 1. Super User override: permanent Collection tier access
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

  // 2. Free Starter Tier: Permanent default
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

  const provider = (sub.provider as 'razorpay' | 'paypal' | 'system') || (sub.razorpayPaymentId ? 'razorpay' : 'paypal');
  const paymentType = (sub.paymentType as 'one_time' | 'recurring') || (provider === 'razorpay' ? 'one_time' : 'recurring');

  // 3. Razorpay / One-Time Payment Governor
  if (paymentType === 'one_time' || provider === 'razorpay') {
    let periodEndMs = 0;

    if (sub.currentPeriodEnd) {
      periodEndMs = new Date(sub.currentPeriodEnd).getTime();
    } else if (sub.updatedAt) {
      // Fallback if legacy record had no explicit currentPeriodEnd: 30 days from updatedAt
      const updatedMs = new Date(sub.updatedAt).getTime();
      periodEndMs = updatedMs + ONE_TIME_PASS_DURATION_DAYS * 24 * 60 * 60 * 1000;
    } else {
      periodEndMs = now; // Expired immediately if no timestamp exists
    }

    const diffMs = periodEndMs - now;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isExpired = diffMs <= 0;

    if (isExpired) {
      return {
        id: subId,
        tierName: rawTier,
        effectiveTier: 'Starter', // Downgraded by Governor upon expiration
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
        governorNote: `One-time ${rawTier} pass expired on ${new Date(periodEndMs).toLocaleDateString()}. Reverted to Starter tier.`,
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
      governorNote: `Active one-time ${rawTier} pass (${daysRemaining} days remaining until ${new Date(periodEndMs).toLocaleDateString()})`,
    };
  }

  // 4. PayPal / Recurring Subscriptions
  const isCanceledOrPastDue = sub.billingStatus === 'canceled' || sub.billingStatus === 'past_due' || sub.billingStatus === 'unpaid';
  const effectiveTier = isCanceledOrPastDue ? 'Starter' : rawTier;

  return {
    id: subId,
    tierName: rawTier,
    effectiveTier,
    billingStatus: isCanceledOrPastDue ? (sub.billingStatus as any) : 'active',
    paymentType: 'recurring',
    provider: 'paypal',
    paypalSubscriptionId: sub.paypalSubscriptionId,
    daysRemaining: Infinity,
    isExpired: isCanceledOrPastDue,
    isSuperUser: false,
    updatedAt: sub.updatedAt || new Date().toISOString(),
    governorNote: isCanceledOrPastDue
      ? `Recurring subscription ${sub.billingStatus}. Reverted to Starter tier.`
      : `Active recurring PayPal subscription (${rawTier} Plan)`,
  };
}
