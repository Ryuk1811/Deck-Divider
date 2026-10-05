import { AccountTier, SubscriptionRecord } from '../types';

export interface GovernedSubscription {
  id: string;
  tierName: AccountTier;
  effectiveTier: AccountTier;
  billingStatus: 'active' | 'expiring_soon' | 'expired' | 'past_due' | 'canceled' | 'unpaid';
  paymentType: 'one_time' | 'recurring';
  provider: 'paypal' | 'system';
  billingCycle?: 'monthly' | 'yearly' | 'lifetime';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  isLifetime: boolean;
  isSuperUser: boolean;
  lifetimeOrderNumber?: number;
  orderId?: string;
  paypalSubscriptionId?: string;
  updatedAt: string;
  governorNote?: string;
}

export const ONE_TIME_PASS_DURATION_DAYS = 30;

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
  const subId = sub?.id || 'guest';
  const rawTier = (sub?.tierName || 'Starter') as AccountTier;
  const isSuper = isSuperUser || Boolean(sub?.isSuperUser);
  const isLifetime = Boolean(sub?.isLifetime);

  // 1. Super User / Founder Lifetime override: permanent Collection tier access
  if (isSuper || isLifetime) {
    return {
      id: subId,
      tierName: 'Collection',
      effectiveTier: 'Collection',
      billingStatus: 'active',
      paymentType: 'one_time',
      provider: sub?.provider || 'system',
      billingCycle: 'lifetime',
      daysRemaining: Infinity,
      isExpired: false,
      isExpiringSoon: false,
      isLifetime: true,
      isSuperUser: isSuper,
      lifetimeOrderNumber: sub?.lifetimeOrderNumber,
      orderId: sub?.orderId,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: isLifetime
        ? `Founder Lifetime Pass Member #${sub?.lifetimeOrderNumber || 1} (Permanent Access)`
        : 'Governed as Super User (Unlimited Lifetime Access)',
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
      isExpiringSoon: false,
      isLifetime: false,
      isSuperUser: false,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote: 'Governed under Standard Free Starter Tier',
    };
  }

  const provider = (sub.provider as 'paypal' | 'system') || 'paypal';
  const paymentType = (sub.paymentType as 'one_time' | 'recurring') || 'one_time';
  const billingCycle = sub.billingCycle || 'monthly';

  // 3. One-Time Pass / Governed Expiration Calculation
  if (sub.currentPeriodEnd) {
    const now = Date.now();
    const end = new Date(sub.currentPeriodEnd).getTime();
    const diff = end - now;
    const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    const isExpired = diff <= 0;
    const isExpiringSoon = !isExpired && daysRemaining <= 7;
    const effectiveTier = isExpired ? 'Starter' : rawTier;

    let billingStatus: GovernedSubscription['billingStatus'] = 'active';
    if (isExpired) {
      billingStatus = 'expired';
    } else if (isExpiringSoon) {
      billingStatus = 'expiring_soon';
    }

    const governorNote = isExpired
      ? `${rawTier} pass expired. Reverted to Free Starter tier. Renew anytime to restore higher limits.`
      : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining on ${rawTier} pass (${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}).`;

    return {
      id: subId,
      tierName: rawTier,
      effectiveTier,
      billingStatus,
      paymentType,
      provider,
      billingCycle,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      daysRemaining,
      isExpired,
      isExpiringSoon,
      isLifetime: false,
      isSuperUser: false,
      orderId: sub.orderId,
      paypalSubscriptionId: sub.paypalSubscriptionId,
      updatedAt: sub?.updatedAt || new Date().toISOString(),
      governorNote,
    };
  }

  // Fallback for legacy subscriptions without periodEnd
  const isCanceledOrPastDue = sub.billingStatus === 'canceled' || sub.billingStatus === 'past_due' || sub.billingStatus === 'unpaid';
  const effectiveTier = isCanceledOrPastDue ? 'Starter' : rawTier;

  return {
    id: subId,
    tierName: rawTier,
    effectiveTier,
    billingStatus: isCanceledOrPastDue ? (sub.billingStatus as any) : 'active',
    paymentType,
    provider,
    billingCycle,
    paypalSubscriptionId: sub.paypalSubscriptionId,
    daysRemaining: Infinity,
    isExpired: isCanceledOrPastDue,
    isExpiringSoon: false,
    isLifetime: false,
    isSuperUser: false,
    updatedAt: sub?.updatedAt || new Date().toISOString(),
    governorNote: isCanceledOrPastDue
      ? `Recurring subscription ${sub.billingStatus}. Reverted to Starter tier.`
      : `Active ${rawTier} Plan`,
  };
}
