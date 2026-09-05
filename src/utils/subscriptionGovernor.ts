import { AccountTier, SubscriptionRecord } from '../types';

export interface GovernedSubscription {
  id: string;
  tierName: AccountTier;
  effectiveTier: AccountTier;
  billingStatus: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'expired';
  paymentType: 'one_time' | 'recurring';
  provider: 'paypal' | 'system';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  daysRemaining: number;
  isExpired: boolean;
  isSuperUser: boolean;
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

  const provider = (sub.provider as 'paypal' | 'system') || 'paypal';
  const paymentType = (sub.paymentType as 'one_time' | 'recurring') || 'recurring';

  // 3. PayPal / Recurring Subscriptions
  const isCanceledOrPastDue = sub.billingStatus === 'canceled' || sub.billingStatus === 'past_due' || sub.billingStatus === 'unpaid';
  const effectiveTier = isCanceledOrPastDue ? 'Starter' : rawTier;

  return {
    id: subId,
    tierName: rawTier,
    effectiveTier,
    billingStatus: isCanceledOrPastDue ? (sub.billingStatus as any) : 'active',
    paymentType,
    provider,
    paypalSubscriptionId: sub.paypalSubscriptionId,
    daysRemaining: Infinity,
    isExpired: isCanceledOrPastDue,
    isSuperUser: false,
    updatedAt: sub?.updatedAt || new Date().toISOString(),
    governorNote: isCanceledOrPastDue
      ? `Recurring subscription ${sub.billingStatus}. Reverted to Starter tier.`
      : `Active recurring PayPal subscription (${rawTier} Plan)`,
  };
}
